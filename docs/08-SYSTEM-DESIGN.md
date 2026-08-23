# Finoptiv — Project Blueprint (08: System Design)

> This file serves two purposes: it's the internal architecture reference for whoever builds this, and its content is what the public `/system-design` page renders for visitors (see `04`). Write and edit it for a technical reader, not just as internal notes.

## Why this page exists

The single most direct way to prove real engineering happened on a portfolio site is to explain, precisely, how it works. This page turns the architecture itself into content, aimed at the technical recruiters and researchers who are Finoptiv's primary audience (see `00`).

## High-level architecture

```
                        ┌─────────────────────┐
   Visitor's browser ──▶│   Vercel Edge/CDN    │
                        └──────────┬───────────┘
                                   │  static/ISR HTML for public pages
                                   ▼
                        ┌─────────────────────┐
                        │  Next.js (frontend)  │  Vercel project A
                        │  App Router + ISR    │
                        └──────────┬───────────┘
                                   │  JSON, only on cache miss / admin actions
                                   ▼
                        ┌─────────────────────┐
                        │  FastAPI (backend)   │  Vercel project B
                        │  Python serverless   │  (stateless, cold-start per call)
                        └──────────┬───────────┘
                                   │  Postgres wire protocol, service-role key
                                   ▼
                        ┌─────────────────────┐
                        │      Supabase        │
                        │  Postgres + Auth +   │
                        │      Storage         │
                        └─────────────────────┘
```

Two independently deployed Vercel projects from one GitHub monorepo (`06`) — frontend and backend scale, fail, and redeploy independently.

## Request lifecycle — reading a case study

1. Visitor requests `/work/uni-sync`.
2. Vercel Edge serves the statically generated HTML for that slug if the ISR cache (60s window, `04`) hasn't expired — no backend call at all on the common path.
3. On a cache miss (first request after a content edit), Next.js server-renders the page, calling `GET /articles/uni-sync` and `GET /articles/uni-sync/related` on the FastAPI backend.
4. FastAPI queries Supabase using the service-role key, but the query itself is still shaped by the same rules RLS would enforce (only `published` rows are ever selected) — RLS is the actual security boundary; the API layer doesn't rely on remembering to filter correctly.
5. Response returns with `Cache-Control` headers (`03`) so Vercel's edge can cache it too, independent of the frontend's own ISR cache.
6. Rendered HTML streams to the visitor; the illustrated/retro component bundle is never fetched, because this route doesn't import it (`04`).

## Request lifecycle — admin publishes an edit

1. Owner logs in at `/admin` via Supabase Auth; a JWT is issued and held client-side.
2. Owner edits an article, clicks Publish; the frontend sends `PUT /admin/articles/{id}` with the JWT as a bearer token.
3. FastAPI's `get_current_admin` dependency (`03`) verifies the JWT against Supabase's JWKS and confirms the user is in the `admins` table — reject with `401` otherwise.
4. Pydantic validates the body (`03`); e.g. a case study can't be set to `published` without `business_implication` filled in.
5. Supabase RLS additionally requires the write to come from a row in `admins` — a second, independent check, so a bug in the API auth logic alone can't grant a write.
6. On success, the public page's ISR cache picks up the change within 60 seconds — no manual redeploy needed for a content edit.

## Security model, summarized

| Layer | Mechanism |
|---|---|
| Admin identity | Supabase Auth (JWT), single owner account, no public sign-up |
| API-level authorization | `get_current_admin` FastAPI dependency, verified per-request |
| Database-level authorization | Postgres RLS — the real boundary; holds even if the API layer has a bug |
| Input validation | Pydantic schemas on every write; conditional required-field rules for publish state |
| Secret isolation | `SUPABASE_SERVICE_ROLE_KEY` lives only in the backend's Vercel env, never in a `NEXT_PUBLIC_*` variable or the frontend bundle |
| Storage | Public bucket for images; private bucket for gated datasets, served only via short-lived signed URLs |

This is a direct, deliberate reversal of the v1 site's model, where the admin password lived in client-side JavaScript.

## Performance strategy, summarized

Full detail in `04` — the headline points, for a reader here:
- Public content pages are statically generated with ISR; most requests never reach the backend.
- The illustrated/retro UI is code-split and only loads on the pages that use it.
- Images are served through `next/image` with explicit dimensions; fonts are self-hosted and non-blocking.
- Backend responses carry cache headers so even a cache-miss request resolves fast at the edge.

## Reliability on a free tier

- Both Vercel functions and the frontend are stateless — no server to keep alive in the traditional sense.
- The one real free-tier risk is Supabase pausing after inactivity; mitigated by a scheduled GitHub Action ping (`07`), not a paid always-on plan.
- RLS means that even if the FastAPI layer were temporarily misconfigured, unpublished content still can't leak — defense in depth, not a single point of failure.
