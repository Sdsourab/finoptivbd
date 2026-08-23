from fastapi import APIRouter, Depends, Response
from supabase import Client

from app.db.helpers import attach_cache_headers
from app.db.supabase_client import get_supabase
from app.schemas.pipeline import PipelineRunOut

router = APIRouter(tags=["pipeline"])


@router.get("/pipeline-status", response_model=list[PipelineRunOut])
def pipeline_status(response: Response, supabase: Client = Depends(get_supabase)):
    """Latest row per pipeline_name. Phase 2 (bd-news-collector widget)."""
    result = supabase.table("pipeline_runs").select("*").order("last_run_at", desc=True).execute()
    seen: set[str] = set()
    latest = []
    for row in result.data:
        if row["pipeline_name"] not in seen:
            seen.add(row["pipeline_name"])
            latest.append(row)
    attach_cache_headers(response)
    return latest
