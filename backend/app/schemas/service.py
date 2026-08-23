from uuid import UUID

from pydantic import BaseModel


class ServiceOut(BaseModel):
    id: UUID
    name: str
    description: str
    starting_price_usd: float | None = None
    related_case_study_slug: str | None = None
    active: bool
    sort_order: int = 0


class ServiceCreate(BaseModel):
    name: str
    description: str
    starting_price_usd: float | None = None
    related_case_study_slug: str | None = None
    active: bool = True
    sort_order: int = 0


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    starting_price_usd: float | None = None
    related_case_study_slug: str | None = None
    active: bool | None = None
    sort_order: int | None = None
