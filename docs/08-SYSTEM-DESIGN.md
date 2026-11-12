# Finoptiv — System Design (current implementation)

This document describes the architecture configured in the repository. The public `/system-design` route renders a visitor-friendly version.

## High-level architecture

```text
Visitor browser
      |
Vercel Edge / CDN
      |
One Vercel project (`vercel.json`)
      |-- `frontend/`: Next.js App Router service
      `-- `backend/`: FastAPI Python service at `/api/backend/*`
                    |
              Supabase: Postgres + Auth + Storage
```

The frontend and backend are independent services in one Vercel project and share one public domain. Top-level rewrites send `/api/backend/*` requests to FastAPI and all other routes to Next.js. This differs from the original plan's two-project deployment model.

## Public read lifecycle

1. A visitor requests `/work/{slug}` or `/writing/{slug}`.
2. Next.js serves the cached page when available; public content routes revalidate every 60 seconds.
3. On a cache miss, the server calls the matching FastAPI route under `/api/backend/`.
4. FastAPI reads published content from Supabase and returns typed JSON.
5. The page is rendered and cached for subsequent visitors.

## Admin write lifecycle

1. The owner signs in with Supabase Auth.
2. The browser obtains an access token and sends it as a Bearer token to `/api/backend/admin/*`.
3. FastAPI verifies Supabase's asymmetric JWKS token, or legacy HS256 signing where configured, and checks the user ID against `public.admins` using a backend-only secret key.
4. Pydantic validates write payloads.
5. The backend uses a privileged secret key that bypasses Postgres RLS. Therefore, FastAPI JWT verification and the `public.admins` membership check are the authorization gate for these API writes. The secret key is never exposed to the browser.

## Security

- Supabase public publishable key is for the browser; the secret key is backend-only and bypasses RLS.
- The backend public-read queries explicitly filter to published rows. Postgres RLS also restricts requests made with the browser publishable key; the backend secret key bypasses RLS by design.
- User-scoped admin write policies call `public.is_finoptiv_admin()`, a narrowly scoped `SECURITY DEFINER` function that can read the otherwise private `admins` table. FastAPI admin endpoints enforce their own JWT and membership checks because their server-side secret key bypasses RLS.
- The `article-images` bucket is public for image reads, while upload/update/delete are admin-only. The `datasets` bucket stays private.
- Public sign-up should be disabled after the owner account is created.

## Performance and reliability

- Public article pages use Next.js ISR with a 60-second revalidation window.
- FastAPI public responses include cache headers; article stats are batch-fetched rather than queried once per article.
- `next/font` serves the configured fonts without an external render-blocking font request.
- The `/api/backend/health` endpoint verifies a real Supabase read, not only that the API process is alive.
- A scheduled GitHub Action can invoke the health endpoint several times daily. Supabase says a few daily database requests are usually enough to avoid inactivity pausing, but this is not guaranteed.

## Runtime endpoints

- API health: `/api/backend/health`
- OpenAPI JSON: `/api/backend/openapi.json`
- Interactive API docs: `/api/backend/docs`
