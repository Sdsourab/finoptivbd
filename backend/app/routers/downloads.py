from uuid import UUID

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from supabase import Client

from app.db.supabase_client import get_supabase

router = APIRouter(tags=["downloads"])


class DownloadRequestCreate(BaseModel):
    article_id: UUID | None = None
    requester_email: EmailStr


@router.post("/download-requests", status_code=status.HTTP_201_CREATED)
def create_download_request(payload: DownloadRequestCreate, supabase: Client = Depends(get_supabase)):
    """Gated dataset/notebook download request. Phase 2. No auth — anyone
    can submit one (RLS: insert-only for the public; only admins can read).
    """
    data = payload.model_dump(mode="json", exclude_none=True)
    result = supabase.table("download_requests").insert(data).execute()
    return {"id": result.data[0]["id"], "received": True}
