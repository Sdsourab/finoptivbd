from fastapi import APIRouter, Depends, Response
from supabase import Client

from app.db.helpers import attach_cache_headers
from app.db.supabase_client import get_supabase
from app.schemas.gallery import GalleryItemOut

router = APIRouter(tags=["gallery"])


@router.get("/gallery", response_model=list[GalleryItemOut])
def list_gallery(response: Response, supabase: Client = Depends(get_supabase)):
    result = supabase.table("gallery_items").select("*").order("sort_order").execute()
    attach_cache_headers(response)
    return result.data