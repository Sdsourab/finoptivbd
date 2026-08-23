from fastapi import APIRouter, Depends, Response
from supabase import Client

from app.db.helpers import attach_cache_headers
from app.db.supabase_client import get_supabase
from app.schemas.prediction import PredictionOut

router = APIRouter(tags=["predictions"])


@router.get("/predictions", response_model=list[PredictionOut])
def list_predictions(response: Response, supabase: Client = Depends(get_supabase)):
    """Public prediction ledger. Phase 3."""
    result = supabase.table("predictions").select("*").order("predicted_at", desc=True).execute()
    attach_cache_headers(response)
    return result.data
