from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import admin, articles, categories, downloads, gallery, methodologies, pipeline, predictions, search, services

# Deployed as a Vercel Service (see /vercel.json at the repo root) sharing
# one domain with the frontend. The root vercel.json only exposes the
# "/api/backend/*" path publicly and routes it here — but it forwards the
# ORIGINAL, unstripped path to this service, not a shortened one. So every
# route in this app has to actually live under /api/backend, including the
# docs, or it's simply unreachable from the outside.
API_PREFIX = "/api/backend"

app = FastAPI(
    title="Finoptiv API",
    version="0.1.0",
    docs_url=f"{API_PREFIX}/docs",
    openapi_url=f"{API_PREFIX}/openapi.json",
)

# Same-origin under Vercel Services, so this mostly matters for local dev
# where the backend may run on its own port (e.g. via `uvicorn` directly
# instead of `vercel dev`).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins or ["*"],
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
def health():
    """Keep-alive ping target — see .github/workflows/keepalive.yml.
    Reachable at /api/backend/health once deployed.
    """
    return {"status": "ok"}


app.include_router(api_router)
