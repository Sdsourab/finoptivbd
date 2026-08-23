from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PredictionOut(BaseModel):
    id: UUID
    article_id: UUID | None = None
    claim: str
    predicted_value: str
    predicted_at: datetime
    actual_value: str | None = None
    resolved_at: datetime | None = None
    error_pct: float | None = None


class PredictionCreate(BaseModel):
    article_id: UUID | None = None
    claim: str
    predicted_value: str


class PredictionResolve(BaseModel):
    actual_value: str
    error_pct: float | None = None
