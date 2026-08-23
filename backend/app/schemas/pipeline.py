from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class PipelineRunOut(BaseModel):
    id: UUID
    pipeline_name: str
    last_run_at: datetime
    items_collected: int
    status: Literal["ok", "error", "running"]
    note: str | None = None


class PipelineRunCreate(BaseModel):
    pipeline_name: str
    items_collected: int = 0
    status: Literal["ok", "error", "running"] = "ok"
    note: str | None = None
