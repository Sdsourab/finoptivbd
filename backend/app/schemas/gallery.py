from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class GalleryItemOut(BaseModel):
    id: UUID
    image_url: str
    caption: str | None = None
    related_article_slug: str | None = None
    sort_order: int = 0
    created_at: datetime


class GalleryItemCreate(BaseModel):
    image_url: str
    caption: str | None = None
    related_article_slug: str | None = None
    sort_order: int = 0


class GalleryItemUpdate(BaseModel):
    image_url: str | None = None
    caption: str | None = None
    related_article_slug: str | None = None
    sort_order: int | None = None