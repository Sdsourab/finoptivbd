# Finoptiv

Personal data-intelligence and research portfolio — case studies, writing, and
a public system-design page, built on Next.js, FastAPI, and Supabase (all
free-tier).

**Deploying for the first time? Start at [`DEPLOYMENT-GUIDE.md`](./DEPLOYMENT-GUIDE.md)
— it's the exact, ordered checklist, written against this actual codebase.**

Full specification bundle: [`docs/`](./docs) (planning docs — DEPLOYMENT-GUIDE.md
supersedes `docs/07-DEPLOYMENT-SETUP.md` now that the code exists).

## Status

- [x] `supabase/` — database schema (MVP + Phase 2/3, across two migrations)
      + seed data
- [x] `backend/` — FastAPI service: public reads, search, JWT-gated admin
      CRUD (articles, services, predictions, pipeline runs) — 9 passing tests
- [x] `frontend/` — Next.js app: all MVP routes + Phase 2 (reproducibility
      badge, run-it-yourself, gated download, pipeline widget) + Phase 3
      (predictions ledger, services page, trigram search) + admin CMS.
      Builds and lints clean.
- [ ] Deployment — needs your Supabase/GitHub/Vercel accounts; see
      `DEPLOYMENT-GUIDE.md`
- [ ] Real content — no case studies/posts exist yet; add them via `/admin`
      after deploying. 4 service rows are seeded but inactive — review and
      turn on the ones you want live.

## What's genuinely done vs. what's still on you

Done and verified in this repo: schema, backend (tested), frontend (builds +
lints clean), CI config, keep-alive config.

Only you can do these — they need your own accounts/credentials, which this
environment has no access to:
- Create the Supabase project and run the migrations
- Push this code to your GitHub
- Connect your Vercel project (one project, two services — see
  `DEPLOYMENT-GUIDE.md`) and set its environment variables
- Set your real contact email (`NEXT_PUBLIC_OWNER_EMAIL` — currently a
  placeholder, see `DEPLOYMENT-GUIDE.md` step 7)

`DEPLOYMENT-GUIDE.md` walks through every one of those, in order, with exact
values to paste.

## Local development

**Option A — matches production exactly** (needs the Vercel CLI:
`npm i -g vercel`, then `vercel link` once inside the repo to connect it to
your Vercel project):
```bash
vercel dev
```
This runs both services together with the same `/api/backend/*` routing
used in production.

**Option B — run them separately** (no Vercel CLI needed):

Backend:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # or: .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env   # fill in real Supabase values
uvicorn app.main:app --reload   # serves at http://localhost:8000/api/backend/...
```

Frontend (separate terminal):
```bash
cd frontend
npm install
cp .env.example .env.local
# also set: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

If `npm run dev` is slow or unstable on a low-RAM machine, you don't strictly
need it day to day — Vercel builds and previews every push in the cloud, so
small edits can go straight to a git commit + push instead of a local server.
