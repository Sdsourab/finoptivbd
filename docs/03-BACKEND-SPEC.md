# Finoptiv — Project Blueprint (03: Backend — FastAPI)

## Folder layout

```
backend/
├── api/
│   └── index.py            # ASGI entrypoint Vercel's Python runtime calls
├── app/
│   ├── main.py              # creates the FastAPI() app, mounts routers, sets cache headers
│   ├── core/
│   │   ├── config.py        # reads env vars (Supabase URL/keys, JWT settings)
│   │   └── security.py      # verifies Supabase JWT, admin-check dependency
│   ├── db/
│   │   └── supabase_client.py
│   ├── schemas/
│   │   ├── article.py
│   │   ├── category.py
│   │   ├── pipeline.py
│   │   └── prediction.py
│   └── routers/
│       ├── articles.py       # serves both case_study and blog_post content_types
│       ├── categories.py
│       ├── methodologies.py
│       ├── pipeline.py
│       ├── predictions.py    # phase 3
│       ├── services.py       # phase 3
│       └── admin.py          # auth-gated CRUD
├── tests/
│   └── test_articles.py
├── requirements.txt
└── vercel.json
```

## Auth flow

1. Frontend authenticates the owner via Supabase Auth (email/password — this is a single-admin site).
2. Supabase issues a JWT; the frontend sends it as `Authorization: Bearer <token>` on write requests.
3. `core/security.py` exposes `get_current_admin()`, a FastAPI dependency that verifies the JWT against Supabase's JWKS and confirms the resulting `user.id` exists in `admins`. Raises `401` otherwise.
4. Every write endpoint depends on `get_current_admin()`. Read endpoints rely on Postgres RLS (`status = 'published'`) as the real gate, so a bug in the API layer can't leak drafts.

No password comparison anywhere in this codebase — this is what retires the v1 hardcoded-password model entirely.

## Endpoint contract

Public (no auth):
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Keep-alive ping target (see `07`) |
| GET | `/articles` | List published content — `?content_type=case_study\|blog_post`, `?category=`, `?methodology=`, `?page=` (default page size 10) |
| GET | `/articles/{slug}` | Full detail — case-study fields or `body_markdown`, depending on `content_type`, includes `article_stats` |
| GET | `/articles/{slug}/related` | Up to 3 published articles sharing `methodology_id` or `category_id`, excluding the current slug |
| GET | `/categories` | List all categories |
| GET | `/methodologies` | List all methodology tags |
| GET | `/pipeline-status` | Latest `pipeline_runs` row per pipeline (Phase 2) |
| GET | `/predictions` | Public prediction ledger (Phase 3) |
| GET | `/services` | Active service offerings (Phase 3) |
| POST | `/download-requests` | Insert a gated-download request (email + article id) |

Admin only (`get_current_admin` dependency):
| Method | Path | Purpose |
|---|---|---|
| POST | `/admin/articles` | Create article (draft by default), either `content_type` |
| PUT | `/admin/articles/{id}` | Update, including publish/unpublish |
| DELETE | `/admin/articles/{id}` | Delete |
| POST | `/admin/pipeline-runs` | Log a pipeline run |
| POST | `/admin/predictions` | Create a prediction ledger entry |
| PUT | `/admin/predictions/{id}/resolve` | Record actual outcome + computed error |

Every write endpoint validates its body against a Pydantic schema — reject on bad input, never trust client-side validation alone. There is no `/contact` or `/hire-me` endpoint — that path is a static `mailto:` link handled entirely by the frontend, deliberately zero backend surface.

## Pydantic schema shape (illustrative — implement in full in `app/schemas/`)

```python
class ArticleCreate(BaseModel):
    content_type: Literal["case_study", "blog_post"] = "case_study"
    title: str
    slug: str
    excerpt: str
    category_id: UUID | None
    methodology_id: UUID | None
    # case-study fields
    problem: str | None = None
    data_description: str | None = None
    method: str | None = None
    result: str | None = None
    business_implication: str | None = None
    colab_url: HttpUrl | None = None
    # blog fields
    body_markdown: str | None = None
    reading_time_minutes: int | None = None
    status: Literal["draft", "published"] = "draft"

    @model_validator(mode="after")
    def check_required_fields_for_type(self):
        if self.content_type == "case_study" and self.status == "published":
            if not self.business_implication:
                raise ValueError("business_implication is required to publish a case study")
        if self.content_type == "blog_post" and self.status == "published":
            if not self.body_markdown:
                raise ValueError("body_markdown is required to publish a blog post")
        return self

class ArticleOut(ArticleCreate):
    id: UUID
    cover_image_url: str | None
    published_at: datetime | None
    stats: list[ArticleStatOut] = []
```

## Performance notes (backend)

- Public GET endpoints return `Cache-Control: public, max-age=60, stale-while-revalidate=300` — content changes rarely, so aggressive edge caching is safe and keeps response times low without any paid caching layer.
- Fetch `article_stats` for a list of articles in one batched query (`where article_id = any(...)`), never per-row in a loop — the classic N+1 mistake, and the one most likely to make `/articles` feel slow as content grows.
- Page size is capped at 10 server-side regardless of what the client requests — keeps every response small.
- `/articles/{slug}/related` is cheap by construction (indexed columns, `limit 3`) — no need for a separate cache layer on top of the response header above.

## Vercel deployment (Python serverless)

`backend/vercel.json`:
```json
{
  "builds": [{ "src": "api/index.py", "use": "@vercel/python" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.py" }]
}
```

`api/index.py` imports and re-exports the FastAPI app from `app.main` — Vercel's Python runtime serves an ASGI app directly.

## Environment variables (set in Vercel project settings, never committed)

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY      # backend only — full write access, bypasses RLS
SUPABASE_JWT_SECRET            # to verify frontend-issued tokens
ALLOWED_ORIGINS                # frontend's Vercel URL, for CORS
```

`SUPABASE_SERVICE_ROLE_KEY` must never reach the frontend bundle.

## Testing (minimum bar)

`tests/test_articles.py` should cover at minimum:
- `GET /articles` returns only `published` rows
- `GET /articles?content_type=blog_post` returns only blog posts
- `POST /admin/articles` without a valid token returns `401`
- `POST /admin/articles` with `status=published` and no `business_implication` (case study) returns `422`
