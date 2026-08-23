from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from supabase import Client

from app.db.helpers import attach_cache_headers, batch_attach_stats
from app.db.supabase_client import get_supabase
from app.schemas.article import ArticleOut

router = APIRouter(tags=["articles"])
PAGE_SIZE = 10  # capped server-side regardless of what the client requests


@router.get("/articles", response_model=list[ArticleOut])
def list_articles(
    response: Response,
    content_type: Literal["case_study", "blog_post"] | None = None,
    category: str | None = Query(None, description="category slug"),
    methodology: str | None = Query(None, description="methodology slug"),
    page: int = Query(1, ge=1),
    supabase: Client = Depends(get_supabase),
):
    query = supabase.table("articles").select("*").eq("status", "published")

    if content_type:
        query = query.eq("content_type", content_type)
    if category:
        cat = supabase.table("categories").select("id").eq("slug", category).limit(1).execute()
        if not cat.data:
            return []
        query = query.eq("category_id", cat.data[0]["id"])
    if methodology:
        meth = supabase.table("methodologies").select("id").eq("slug", methodology).limit(1).execute()
        if not meth.data:
            return []
        query = query.eq("methodology_id", meth.data[0]["id"])

    start = (page - 1) * PAGE_SIZE
    end = start + PAGE_SIZE - 1
    result = query.order("published_at", desc=True).range(start, end).execute()

    attach_cache_headers(response)
    return batch_attach_stats(supabase, result.data)


@router.get("/articles/{slug}", response_model=ArticleOut)
def get_article(slug: str, response: Response, supabase: Client = Depends(get_supabase)):
    result = (
        supabase.table("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    attach_cache_headers(response)
    return batch_attach_stats(supabase, result.data)[0]


@router.get("/articles/{slug}/related", response_model=list[ArticleOut])
def get_related_articles(slug: str, response: Response, supabase: Client = Depends(get_supabase)):
    """Up to 3 published articles sharing methodology_id or category_id,
    excluding the current slug. Computed at query time on purpose — a stored
    related_article_ids array goes stale the moment content changes.
    """
    current = (
        supabase.table("articles")
        .select("id, methodology_id, category_id")
        .eq("slug", slug)
        .eq("status", "published")
        .limit(1)
        .execute()
    )
    if not current.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    current_article = current.data[0]
    method_id = current_article.get("methodology_id")
    category_id = current_article.get("category_id")

    if not method_id and not category_id:
        return []

    query = supabase.table("articles").select("*").eq("status", "published").neq("id", current_article["id"])
    if method_id and category_id:
        query = query.or_(f"methodology_id.eq.{method_id},category_id.eq.{category_id}")
    elif method_id:
        query = query.eq("methodology_id", method_id)
    else:
        query = query.eq("category_id", category_id)

    result = query.order("published_at", desc=True).limit(3).execute()
    attach_cache_headers(response)
    return batch_attach_stats(supabase, result.data)
