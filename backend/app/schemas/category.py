from uuid import UUID

from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: UUID
    name: str
    slug: str


class MethodologyOut(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None = None
