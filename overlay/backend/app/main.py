import logging

from fastapi import APIRouter, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client

from app.core.config import settings
from app.db.supabase_client import get_supabase
from app.routers import admin, articles, categories, downloads, gallery, methodologies, pipeline, predictions, search, services

logger = logging.getLogger(__name__)

# Vercel Services forwards the original path, so routes stay under this prefix.
API_PREFIX = "/api/backend"

app = FastAPI(
    title="Finoptiv API",
    version="0.2.0",
    docs_url=f"{API_PREFIX}/docs",
    openapi_url=f"{API_PREFIX}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix=API_PREFIX)
api_router.include_router(articles.router)
api_router.include_router(categories.router)
api_router.include_router(methodologies.router)
api_router.include_router(pipeline.router)
api_router.include_router(predictions.router)
api_router.include_router(services.router)
api_router.include_router(gallery.router)
api_router.include_router(search.router)
api_router.include_router(downloads.router)
api_router.include_router(admin.router)


@api_router.get("/health", tags=["meta"])
def health(supabase: Client = Depends(get_supabase)):
    """Readiness check that verifies real database connectivity.

    The keep-alive workflow calls this route. A no-op health response would
    keep Vercel warm but would not count as database activity for Supabase.
    """
    try:
        supabase.table("methodologies").select("id").limit(1).execute()
    except Exception as exc:
        logger.exception("Supabase database health check failed")
        raise HTTPException(
            status_code=503,
            detail="Supabase database is unavailable. Verify project status and run all database migrations.",
        ) from exc
    return {"status": "ok", "database": "ok"}


app.include_router(api_router)
