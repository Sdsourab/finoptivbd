from fastapi import APIRouter, Depends, Response
from supabase import Client

from app.db.helpers import attach_cache_headers
from app.db.supabase_client import get_supabase
from app.schemas.category import CategoryOut

router = APIRouter(tags=["categories"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(response: Response, supabase: Client = Depends(get_supabase)):
    result = supabase.table("categories").select("*").order("name").execute()
    attach_cache_headers(response)
    return result.data
