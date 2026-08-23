from fastapi import APIRouter, Depends, Response
from supabase import Client

from app.db.helpers import attach_cache_headers
from app.db.supabase_client import get_supabase

router = APIRouter(tags=["services"])


@router.get("/services")
def list_services(response: Response, supabase: Client = Depends(get_supabase)):
    """Active service offerings. Phase 3."""
    result = (
        supabase.table("services")
        .select("*")
        .eq("active", True)
        .order("sort_order")
        .execute()
    )
    attach_cache_headers(response)
    return result.data
