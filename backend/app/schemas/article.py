from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, HttpUrl, model_validator


class ArticleStatOut(BaseModel):
    id: UUID
    label: str
    value: str
    sort_order: int = 0


class ArticleBase(BaseModel):
    content_type: Literal["case_study", "blog_post"] = "case_study"
    title: str
    slug: str
    excerpt: str
    category_id: UUID | None = None
    methodology_id: UUID | None = None

    # case-study fields (case_study only; leave null for blog_post)
    problem: str | None = None
    data_description: str | None = None
    method: str | None = None
    result: str | None = None
    business_implication: str | None = None
    colab_url: HttpUrl | None = None
    dataset_available: bool = False
    notebook_available: bool = False
    deterministic: bool = False

    # blog fields (blog_post only; leave null for case_study)
    body_markdown: str | None = None
    reading_time_minutes: int | None = None

    # set when this article is a pointer to content hosted elsewhere
    # (Medium, LinkedIn, a Colab notebook, GitHub, ...) rather than written
    # in full on this site
    external_url: HttpUrl | None = None

    status: Literal["draft", "published"] = "draft"

    @model_validator(mode="after")
    def check_required_fields_for_type(self):
        # An external-link article has nothing written here to require —
        # the whole point is that the real content lives elsewhere.
        if self.external_url:
            return self
        if self.content_type == "case_study" and self.status == "published":
            if not self.business_implication:
                raise ValueError("business_implication is required to publish a case study")
        if self.content_type == "blog_post" and self.status == "published":
            if not self.body_markdown:
                raise ValueError("body_markdown is required to publish a blog post")
        return self


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    """Every field optional — PUT applies a partial update. The publish-
    requires-content rule is re-checked in the router against the MERGED
    (existing + update) record, since a partial body alone can't tell
    whether e.g. business_implication was already set on an earlier save.
    """

    content_type: Literal["case_study", "blog_post"] | None = None
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    cover_image_url: str | None = None
    category_id: UUID | None = None
    methodology_id: UUID | None = None
    problem: str | None = None
    data_description: str | None = None
    method: str | None = None
    result: str | None = None
    business_implication: str | None = None
    colab_url: HttpUrl | None = None
    dataset_available: bool | None = None
    notebook_available: bool | None = None
    deterministic: bool | None = None
    body_markdown: str | None = None
    reading_time_minutes: int | None = None
    external_url: HttpUrl | None = None
    status: Literal["draft", "published"] | None = None


class ArticleOut(ArticleBase):
    id: UUID
    cover_image_url: str | None = None
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    stats: list[ArticleStatOut] = []