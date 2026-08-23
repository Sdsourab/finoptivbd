from fastapi import APIRouter, Depends, Response
from supabase import Client

from app.db.helpers import attach_cache_headers
from app.db.supabase_client import get_supabase
from app.schemas.category import MethodologyOut

router = APIRouter(tags=["methodologies"])


@router.get("/methodologies", response_model=list[MethodologyOut])
def list_methodologies(response: Response, supabase: Client = Depends(get_supabase)):
    result = supabase.table("methodologies").select("*").order("name").execute()
    attach_cache_headers(response)
    return result.data
