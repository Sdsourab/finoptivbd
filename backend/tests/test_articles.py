"""
Covers the minimum bar from docs/03-BACKEND-SPEC.md:
  - GET /articles returns only published rows
  - GET /articles?content_type=blog_post returns only blog posts
  - POST /admin/articles without a valid token returns 401
  - POST /admin/articles with status=published and no business_implication
    (case study) returns 422

Uses a small fake standing in for the supabase-py query builder, injected via
FastAPI's dependency_overrides. This means CI can run `pytest` green with
zero real Supabase credentials (ci.yml sets none) — the fake IS the test
fixture, not a mock of one.
"""

from fastapi.testclient import TestClient

from app.core.security import get_current_admin
from app.db.supabase_client import get_supabase
from app.main import app
import uuid


class _FakeResult:
    def __init__(self, data):
        self.data = data


class _FakeQuery:
    """Minimal chainable stand-in for postgrest-py's query builder. Filter/
    order/range/limit calls narrow an in-memory list; execute() returns it.
    """

    def __init__(self, rows: list[dict]):
        self._rows = rows

    def select(self, *_args, **_kwargs):
        return self

    def eq(self, field, value):
        self._rows = [r for r in self._rows if r.get(field) == value]
        return self

    def neq(self, field, value):
        self._rows = [r for r in self._rows if r.get(field) != value]
        return self

    def in_(self, field, values):
        self._rows = [r for r in self._rows if r.get(field) in values]
        return self

    def or_(self, *_args, **_kwargs):
        return self

    def order(self, *_args, **_kwargs):
        return self

    def range(self, *_args, **_kwargs):
        return self

    def limit(self, n):
        self._rows = self._rows[:n]
        return self

    def insert(self, data):
        row = dict(data)
        row.setdefault("id", str(uuid.uuid4()))
        row.setdefault("created_at", "2026-01-01T00:00:00Z")
        row.setdefault("updated_at", "2026-01-01T00:00:00Z")
        self._rows = [row]
        return self

    def update(self, _data):
        return self

    def delete(self):
        return self

    def execute(self):
        return _FakeResult(self._rows)


class FakeSupabase:
    def __init__(self, tables: dict[str, list[dict]]):
        self._tables = tables

    def table(self, name: str):
        return _FakeQuery(list(self._tables.get(name, [])))

    def rpc(self, name: str, params: dict):
        """Stands in for the search_articles() Postgres function (see
        migration 0002) — real trigram ranking obviously isn't available
        here, so this does a plain substring match, just enough to test the
        endpoint's plumbing (auth-free, published-only, calls through RPC).
        """
        if name == "search_articles":
            q = params.get("search_query", "").lower()
            rows = [
                a
                for a in self._tables.get("articles", [])
                if a.get("status") == "published" and (q in a.get("title", "").lower() or q in a.get("excerpt", "").lower())
            ]
            return _FakeQuery(rows)
        return _FakeQuery([])


def _article(**overrides) -> dict:
    base = {
        "id": "11111111-1111-1111-1111-111111111111",
        "content_type": "case_study",
        "slug": "uni-sync",
        "title": "UniSync",
        "excerpt": "An academic portal.",
        "category_id": None,
        "methodology_id": None,
        "business_implication": "Saved the department hours of manual work.",
        "status": "published",
        "published_at": "2026-01-01T00:00:00Z",
        "created_at": "2026-01-01T00:00:00Z",
        "updated_at": "2026-01-01T00:00:00Z",
        "cover_image_url": None,
    }
    base.update(overrides)
    return base


PUBLISHED_CASE_STUDY = _article()
PUBLISHED_BLOG_POST = _article(
    id="22222222-2222-2222-2222-222222222222",
    content_type="blog_post",
    slug="how-i-built-this",
    title="How I built this",
    body_markdown="It started with a spec bundle.",
    reading_time_minutes=4,
    business_implication=None,
)
DRAFT_BLOG_POST = _article(
    id="33333333-3333-3333-3333-333333333333",
    content_type="blog_post",
    slug="draft-post",
    title="Draft post",
    body_markdown="wip",
    business_implication=None,
    status="draft",
    published_at=None,
)


def _client_with_fake_db() -> TestClient:
    fake = FakeSupabase(
        {
            "articles": [PUBLISHED_CASE_STUDY, PUBLISHED_BLOG_POST, DRAFT_BLOG_POST],
            "article_stats": [],
        }
    )
    app.dependency_overrides[get_supabase] = lambda: fake
    return TestClient(app)


def teardown_function():
    app.dependency_overrides.clear()


def test_list_articles_returns_only_published():
    client = _client_with_fake_db()
    response = client.get("/api/backend/articles")
    assert response.status_code == 200
    slugs = {a["slug"] for a in response.json()}
    assert slugs == {"uni-sync", "how-i-built-this"}


def test_list_articles_filters_by_content_type():
    client = _client_with_fake_db()
    response = client.get("/api/backend/articles", params={"content_type": "blog_post"})
    assert response.status_code == 200
    body = response.json()
    assert [a["slug"] for a in body] == ["how-i-built-this"]


def test_create_article_without_token_is_unauthorized():
    client = _client_with_fake_db()
    response = client.post("/api/backend/admin/articles", json={"title": "New", "slug": "new", "excerpt": "e"})
    assert response.status_code == 401


def test_search_finds_published_articles_by_title():
    client = _client_with_fake_db()
    response = client.get("/api/backend/search", params={"q": "uni"})
    assert response.status_code == 200
    slugs = [a["slug"] for a in response.json()]
    assert "uni-sync" in slugs


def test_create_service_requires_auth():
    client = _client_with_fake_db()
    response = client.post("/api/backend/admin/services", json={"name": "X", "description": "Y"})
    assert response.status_code == 401


def test_create_service_with_auth_succeeds():
    client = _client_with_fake_db()
    app.dependency_overrides[get_current_admin] = lambda: "test-admin-id"
    try:
        response = client.post("/api/backend/admin/services", json={"name": "Test service", "description": "desc"})
    finally:
        app.dependency_overrides.pop(get_current_admin, None)
    assert response.status_code == 201
    assert response.json()["name"] == "Test service"


def test_admin_list_articles_requires_auth():
    client = _client_with_fake_db()
    response = client.get("/api/backend/admin/articles")
    assert response.status_code == 401


def test_admin_list_articles_returns_all_statuses():
    client = _client_with_fake_db()
    app.dependency_overrides[get_current_admin] = lambda: "test-admin-id"
    try:
        response = client.get("/api/backend/admin/articles")
    finally:
        app.dependency_overrides.pop(get_current_admin, None)
    assert response.status_code == 200
    slugs = {a["slug"] for a in response.json()}
    # unlike the public endpoint, this includes the draft
    assert slugs == {"uni-sync", "how-i-built-this", "draft-post"}


def test_publish_case_study_without_business_implication_is_rejected():
    client = _client_with_fake_db()
    app.dependency_overrides[get_current_admin] = lambda: "test-admin-id"
    try:
        response = client.post(
            "/api/backend/admin/articles",
            json={
                "content_type": "case_study",
                "title": "New case study",
                "slug": "new-case-study",
                "excerpt": "e",
                "status": "published",
            },
        )
    finally:
        app.dependency_overrides.pop(get_current_admin, None)
    assert response.status_code == 422
