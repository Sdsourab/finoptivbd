# Finoptiv — Project Blueprint (07: Deployment Setup — Free Tier Only)

## 1. GitHub

- Create one repo, push the monorepo structure from `06`.
- Protect `main`: require the CI workflow (below) to pass before merge, once the MVP is live.

## 2. Supabase

1. Create a new free project.
2. Run `supabase/migrations/0001_init.sql` (full content of `02-DATABASE-SCHEMA.md`) in the SQL editor.
3. Run `supabase/seed.sql` (methodology rows).
4. Storage → create buckets `article-images` (public) and `datasets` (private), per `02`.
5. Auth → create exactly one user (the owner) via the Supabase dashboard, then insert their `id` into the `admins` table manually — there is no public sign-up flow on this site.
6. Copy from Project Settings → API: `SUPABASE_URL`, `anon` key (frontend), `service_role` key (backend only), and the JWT secret.

## 3. Vercel — two projects, one repo

**Project A — frontend**
- Root directory: `frontend/`
- Framework preset: Next.js (auto-detected)
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_OWNER_EMAIL` (used to build the `mailto:` links — set once, referenced everywhere, never hardcoded per-component)
- `next.config.js`: add the Supabase project's storage domain to `images.remotePatterns` before first deploy, or every `next/image` call to a Supabase-hosted image will fail

**Project B — backend**
- Root directory: `backend/`
- Framework preset: Other (uses `vercel.json`'s `@vercel/python` builder)
- Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `ALLOWED_ORIGINS` (Project A's URL)

Both auto-deploy on every push to `main`. Free tier covers this comfortably at portfolio-scale traffic.

## 4. The Supabase-pause problem, solved for free

Free Supabase projects pause after ~7 days without API traffic. Fix with `.github/workflows/keepalive.yml`:

```yaml
name: keepalive
on:
  schedule:
    - cron: "0 6 */3 * *"   # every 3 days
  workflow_dispatch: {}
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl -f https://<backend-project>.vercel.app/health
```

Free (GitHub Actions minutes), and guarantees a recruiter never lands on a paused project.

## 5. CI — `.github/workflows/ci.yml`

```yaml
name: ci
on: [push, pull_request]
jobs:
  backend-test:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: backend } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest
  frontend-lint:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: frontend } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm run lint
```

## 6. Domain

Default `*.vercel.app` subdomains are fine — no cost requirement met either way. A custom domain can be added later on Vercel's free tier if the owner buys one separately.

## 7. Performance verification (new — required before calling launch done)

Run Lighthouse (Chrome DevTools) or PageSpeed Insights, mobile profile, against `/`, `/work/[slug]`, `/writing/[slug]`, and `/system-design`:
- Performance ≥ 90
- LCP < 2.5s, CLS < 0.1, INP < 200ms

If any page misses these, check first for: an illustrated component leaking into the core bundle (see `04`), a missing `width`/`height` on an image, or a render-blocking font — these three cover most regressions on a site this size.

## 8. Launch checklist (final gate before calling the MVP done)

- [ ] All MVP tables migrated, RLS verified (try reading a `draft` article as an anonymous request — must fail)
- [ ] Admin login works end-to-end with the real Supabase user, no hardcoded credentials anywhere in the codebase
- [ ] `/health` returns 200, keep-alive workflow enabled
- [ ] At least one case study (e.g. UniSync) and one blog post are seeded as real content, not lorem ipsum
- [ ] `/system-design` renders and accurately describes the deployed architecture
- [ ] Hire Me button and contact sidebar work on both `/work/[slug]` and `/writing/[slug]`, `mailto:` opens with the correct pre-filled subject, copy-email fallback works
- [ ] Every `/work/[slug]` and `/writing/[slug]` page ends with populated `RelatedContent` — no empty related-content sections at launch
- [ ] `/about` and `/404` render the illustrated style correctly with light-on-dark line art (contrast checked)
- [ ] Performance targets in step 7 are met on all four checked routes
- [ ] CI is green on `main`
