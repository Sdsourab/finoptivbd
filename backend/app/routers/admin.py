from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core.security import get_current_admin
from app.db.helpers import batch_attach_stats
from app.db.supabase_client import get_supabase
from app.schemas.article import ArticleCreate, ArticleOut, ArticleUpdate
from app.schemas.pipeline import PipelineRunCreate, PipelineRunOut
from app.schemas.gallery import GalleryItemCreate, GalleryItemOut, GalleryItemUpdate
from app.schemas.prediction import PredictionCreate, PredictionOut, PredictionResolve
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


# ---- Articles ----

@router.get("/articles", response_model=list[ArticleOut])
def admin_list_articles(supabase: Client = Depends(get_supabase)):
    result = supabase.table("articles").select("*").order("updated_at", desc=True).execute()
    return batch_attach_stats(supabase, result.data)


@router.get("/articles/{article_id}", response_model=ArticleOut)
def admin_get_article(article_id: UUID, supabase: Client = Depends(get_supabase)):
    result = supabase.table("articles").select("*").eq("id", str(article_id)).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return batch_attach_stats(supabase, result.data)[0]


@router.post("/articles", response_model=ArticleOut, status_code=status.HTTP_201_CREATED)
def create_article(payload: ArticleCreate, supabase: Client = Depends(get_supabase)):
    data = payload.model_dump(mode="json", exclude_none=True)
    if data.get("status") == "published":
        data["published_at"] = "now()"
    result = supabase.table("articles").insert(data).execute()
    return {**result.data[0], "stats": []}


@router.put("/articles/{article_id}", response_model=ArticleOut)
def update_article(article_id: UUID, payload: ArticleUpdate, supabase: Client = Depends(get_supabase)):
    existing = supabase.table("articles").select("*").eq("id", str(article_id)).limit(1).execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    current = existing.data[0]
    updates = payload.model_dump(mode="json", exclude_unset=True)
    merged = {**current, **updates}

    if merged.get("status") == "published" and not merged.get("external_url"):
        if merged.get("content_type") == "case_study" and not merged.get("business_implication"):
            raise HTTPException(status_code=422, detail="business_implication is required to publish a case study")
        if merged.get("content_type") == "blog_post" and not merged.get("body_markdown"):
            raise HTTPException(status_code=422, detail="body_markdown is required to publish a blog post")
    if merged.get("status") == "published" and current.get("status") != "published":
        updates["published_at"] = "now()"

    result = supabase.table("articles").update(updates).eq("id", str(article_id)).execute()
    return batch_attach_stats(supabase, result.data)[0]


@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(article_id: UUID, supabase: Client = Depends(get_supabase)):
    supabase.table("articles").delete().eq("id", str(article_id)).execute()
    return None


# ---- Pipeline (Phase 2) ----

@router.post("/pipeline-runs", response_model=PipelineRunOut, status_code=status.HTTP_201_CREATED)
def log_pipeline_run(payload: PipelineRunCreate, supabase: Client = Depends(get_supabase)):
    result = supabase.table("pipeline_runs").insert(payload.model_dump()).execute()
    return result.data[0]


# ---- Predictions (Phase 3) ----

@router.post("/predictions", response_model=PredictionOut, status_code=status.HTTP_201_CREATED)
def create_prediction(payload: PredictionCreate, supabase: Client = Depends(get_supabase)):
    data = payload.model_dump(mode="json", exclude_none=True)
    result = supabase.table("predictions").insert(data).execute()
    return result.data[0]


@router.put("/predictions/{prediction_id}/resolve", response_model=PredictionOut)
def resolve_prediction(prediction_id: UUID, payload: PredictionResolve, supabase: Client = Depends(get_supabase)):
    existing = supabase.table("predictions").select("*").eq("id", str(prediction_id)).limit(1).execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found")

    data = {
        "actual_value": payload.actual_value,
        "error_pct": payload.error_pct,
        "resolved_at": "now()",
    }
    result = supabase.table("predictions").update(data).eq("id", str(prediction_id)).execute()
    return result.data[0]


# ---- Services (Phase 3) ----

@router.get("/services", response_model=list[ServiceOut])
def admin_list_services(supabase: Client = Depends(get_supabase)):
    result = supabase.table("services").select("*").order("sort_order").execute()
    return result.data


@router.post("/services", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, supabase: Client = Depends(get_supabase)):
    data = payload.model_dump(mode="json", exclude_none=True)
    result = supabase.table("services").insert(data).execute()
    return result.data[0]


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(service_id: UUID, payload: ServiceUpdate, supabase: Client = Depends(get_supabase)):
    existing = supabase.table("services").select("id").eq("id", str(service_id)).limit(1).execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    updates = payload.model_dump(mode="json", exclude_unset=True)
    result = supabase.table("services").update(updates).eq("id", str(service_id)).execute()
    return result.data[0]


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: UUID, supabase: Client = Depends(get_supabase)):
    supabase.table("services").delete().eq("id", str(service_id)).execute()
    return None


# ---- Gallery ----

@router.get("/gallery", response_model=list[GalleryItemOut])
def admin_list_gallery(supabase: Client = Depends(get_supabase)):
    result = supabase.table("gallery_items").select("*").order("sort_order").execute()
    return result.data


@router.post("/gallery", response_model=GalleryItemOut, status_code=status.HTTP_201_CREATED)
def create_gallery_item(payload: GalleryItemCreate, supabase: Client = Depends(get_supabase)):
    data = payload.model_dump(mode="json", exclude_none=True)
    result = supabase.table("gallery_items").insert(data).execute()
    return result.data[0]


@router.put("/gallery/{item_id}", response_model=GalleryItemOut)
def update_gallery_item(item_id: UUID, payload: GalleryItemUpdate, supabase: Client = Depends(get_supabase)):
    existing = supabase.table("gallery_items").select("id").eq("id", str(item_id)).limit(1).execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    updates = payload.model_dump(mode="json", exclude_unset=True)
    result = supabase.table("gallery_items").update(updates).eq("id", str(item_id)).execute()
    return result.data[0]


@router.delete("/gallery/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_item(item_id: UUID, supabase: Client = Depends(get_supabase)):
    supabase.table("gallery_items").delete().eq("id", str(item_id)).execute()
    return None