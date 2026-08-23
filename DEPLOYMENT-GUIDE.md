# Deployment Guide

Written against the actual code in this repo — exact file names, exact env
var names, exact menu paths, as of this build. Follow it in order; each step
says which earlier step it depends on.

Everything used here (Supabase, Vercel, GitHub) is free-tier. Total time:
roughly 45–60 minutes the first time.

You will need: a GitHub account, a Supabase account, a Vercel account (Vercel
can sign up directly with GitHub — do that, it saves a step).

---

## Step 1 — Create the Supabase project

1. Go to https://supabase.com → **Sign in** (or create an account) → **New project**.
2. Pick an organization (create one if you don't have one).
3. Fill in:
   - **Name**: `finoptiv` (or anything you like)
   - **Database password**: generate a strong one and **save it somewhere** —
     you won't need it for anything in this guide, but Supabase asks for it
     and it's good to have on file.
   - **Region**: closest to where you expect most visitors (Singapore is a
     reasonable default for a Bangladesh-based audience).
4. Click **Create new project**. Wait 1–2 minutes for provisioning.

## Step 2 — Run the database migrations

1. In the Supabase dashboard, open the **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `supabase/migrations/0001_init.sql` from this repo, copy its entire
   contents, paste into the SQL editor, and click **Run**.
   - You should see "Success. No rows returned."
4. Click **New query** again. Open `supabase/migrations/0002_phase2_phase3.sql`,
   copy its entire contents, paste, **Run**.
   - This adds the search function and a couple of Phase 2/3 columns —
     needed even if you're not using those pages yet, since `seed.sql`
     (next step) depends on it.
5. Click **New query** again. Open `supabase/migrations/0003_external_link.sql`,
   copy its entire contents, paste, **Run**.
   - Adds one column (`external_url`) so an article can point at content
     you've already written elsewhere instead of being written on the site.
6. Click **New query** again. Open `supabase/migrations/0004_gallery.sql`,
   copy its entire contents, paste, **Run**.
   - Adds the `gallery_items` table behind the `/gallery` page.
7. Click **New query** again.
8. Open `supabase/seed.sql`, copy its contents, paste, **Run**.
   - This adds the 5 methodology tags (Causal Inference, NLP / Topic
     Modeling, etc.) the site's filters use, plus 4 starter service rows
     (inactive, no price set — see Step 12).

If any query errors, stop and re-check you copied the *entire* file, and
that you ran them in order (0001, then 0002, then 0003, then 0004, then
seed.sql last — seed.sql depends on the earlier ones).

## Step 3 — Create your admin login

This is the account you'll use to sign in at `/admin` and write content.

1. In Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your real email and a password you'll remember. Un-check "Auto
   Confirm User" is fine to leave checked (so it doesn't require an email
   confirmation step).
3. Click **Create user**. Click into the user you just created and **copy
   their User UID** (a long uuid, e.g. `a1b2c3d4-...`) — you need it in the
   next step.
4. Back in **SQL Editor** → **New query**, run (replacing both placeholders):

   ```sql
   insert into admins (id, display_name)
   values ('PASTE-THE-USER-UID-HERE', 'Sourav');
   ```

   This is what makes that login an *admin* — without this row, the account
   can sign in but every write will be rejected (both by the backend and by
   RLS).

5. **Recommended, optional hardening**: Authentication → Settings (or
   Providers, depending on the dashboard version) → find "Allow new users to
   sign up" and turn it **off**. Nothing in this app has a public sign-up
   form, but Supabase's own API does by default — turning this off means the
   *only* way an account can ever exist is one you create by hand, same as
   step 3.

## Step 4 — Create storage buckets

1. **Storage** (left sidebar) → **New bucket**.
2. Create `article-images` — toggle **Public bucket** ON.
3. Create `datasets` — leave **Public bucket** OFF (private; this is for
   Phase 2 gated downloads, not used yet, but create it now so it's not a
   later surprise).

## Step 5 — Collect your Supabase keys

**Settings** (gear icon) → **API**. You'll need three values from this page
for later steps — copy them into a scratch note now:

| What the page calls it | You'll paste it as |
|---|---|
| Project URL | `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` — **never put this in the frontend, ever** |

Also on this page (or under **Settings → API → JWT Settings**): the **JWT
Secret** → this becomes `SUPABASE_JWT_SECRET`.

## Step 6 — Push this code to GitHub

From the unzipped `finoptiv/` folder:

```bash
cd finoptiv
git init
git add .
git commit -m "Initial commit"
```

Then on GitHub: **New repository** (don't initialize with a README — you
already have one), copy the commands it shows you under "…or push an
existing repository", something like:

```bash
git remote add origin https://github.com/<your-username>/finoptiv.git
git branch -M main
git push -u origin main
```

## Step 7 — Decide your real values

Before deploying, know these two things — you'll paste them in the next steps:

- **Your real contact email**, for `NEXT_PUBLIC_OWNER_EMAIL`. This is what
  every "Hire Me" button on the site links to. Do not skip this — without
  it, the button is literally addressed to `{{OWNER_EMAIL}}`.
- Optionally, your GitHub profile URL and LinkedIn URL, for
  `NEXT_PUBLIC_GITHUB_URL` / `NEXT_PUBLIC_LINKEDIN_URL` (footer links —
  leave blank to hide them).

## Step 8 — Deploy to Vercel

This repo deploys as **one Vercel project with two Vercel Services** —
frontend and backend build and ship together, on one shared domain. This is
Vercel's current recommended way to deploy a JS frontend + Python backend
from one repo (it replaced the older pattern of importing the same repo
twice as two separate projects). The root-level `vercel.json` in this repo
already defines both services and the routing between them — you don't need
to write or edit it.

How the routing works, in one sentence: everything under `/api/backend/*`
goes to the FastAPI backend; every other path goes to the Next.js frontend.
That's why the backend's own routes, health check, and docs all live under
`/api/backend/...` in this codebase, not at the root.

1. Vercel dashboard → **Add New** → **Project** → import your `finoptiv` repo.
2. Vercel should detect the root `vercel.json` and list both `frontend` and
   `backend` as services. **Leave Root Directory as `./`** (repo root) —
   don't scope it down to one folder, or Vercel won't see the services
   config at all.
3. Check **Project Settings → General → Framework Preset** is set to
   **Services**. It's usually auto-selected once `vercel.json` has a
   `services` key; if not, set it manually before deploying.
4. **Environment Variables** — add all of these (one shared pool for the
   whole project; no need to scope any of them to a single service):

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | from Step 5 |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Step 5 |
   | `SUPABASE_JWT_SECRET` | from Step 5 |
   | `NEXT_PUBLIC_SUPABASE_URL` | from Step 5 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Step 5 |
   | `NEXT_PUBLIC_OWNER_EMAIL` | your real email, from Step 7 |
   | `NEXT_PUBLIC_GITHUB_URL` | optional, from Step 7 |
   | `NEXT_PUBLIC_LINKEDIN_URL` | optional, from Step 7 |
   | `NEXT_PUBLIC_SITE_URL` | leave blank for now — see the note right after this table |
   | `NEXT_PUBLIC_API_URL` | leave **blank** — frontend and backend share a domain now, so this is only ever needed for local dev without `vercel dev` |
   | `ALLOWED_ORIGINS` | leave **blank** — same reason |

5. Click **Deploy**. Vercel builds both services; this takes a bit longer
   than a single-service deploy the first time.
6. Once it's live, copy the URL Vercel gives you (e.g.
   `https://finoptiv.vercel.app`). Visit
   `<that-url>/api/backend/health` — you should see `{"status":"ok"}`. If
   not, open the deployment and check the **backend** service's logs
   specifically (each service has its own build/runtime logs).
7. Come back to **Settings → Environment Variables**, add
   `NEXT_PUBLIC_SITE_URL` with that same URL, then **Deployments** → ⋯ on
   the latest one → **Redeploy** (this is the only reason you need a second
   deploy — everything else is correct on the first pass).

## Step 9 — Turn on the keep-alive

Open `.github/workflows/keepalive.yml` in your repo, replace
`<your-project>` with your real Vercel domain from Step 8, commit, push.
This is what stops Supabase from pausing your database after 7 days of no
traffic — without it, your first visitor after a quiet week would hit a
cold, paused database.

## Step 10 — Add your first content

Visit `https://<your-project>.vercel.app/admin`, sign in with the account
from Step 3. From here:

- **Articles** (the main dashboard): click **New article** for your first
  case study or post. Set **Status** to **Published** when ready — case
  studies need a *Business Implication*, blog posts need a *Body*, or the
  save is rejected with a clear error telling you which one.
- **Services**: 4 starter rows were seeded in Step 2 (Literature review,
  Data cleaning, Causal-inference consulting, Custom Colab pipeline build) —
  all inactive, no price set. Open **Services** from the admin dashboard,
  edit each one (set a real price or leave blank for "Contact for
  pricing"), and check **Active** when you want it live on `/services`.
- **Predictions**: open **Predictions** from the admin dashboard to log a
  claim, and to mark existing ones resolved once the outcome is known.

Give it up to 60 seconds after saving for public pages to catch up (the ISR
cache window).

## Optional — custom domain

Vercel → your project → **Settings → Domains** → add your domain and follow
its DNS instructions. Both services move to the new domain automatically
(they share one project). Afterward, update `NEXT_PUBLIC_SITE_URL` to the
new domain and redeploy.

---

## Troubleshooting

**Vercel shows "vercel.json required to deploy projects with multiple services" and won't let you pick a Root Directory**
This means it detected `frontend/` and `backend/` as two separate apps
before finding the root `vercel.json` — usually because Root Directory got
scoped to a subfolder first. Leave Root Directory at `./` (repo root); the
root `vercel.json` already in this repo is exactly what resolves this
message.

**Vercel build log says "Build output contains no 'functions' or 'static' directory"**
This means the backend service built (dependencies installed fine) but
Vercel couldn't find a Python entrypoint to turn into a Function. This repo
now ships `backend/main.py` (root-level, auto-detected) and
`backend/pyproject.toml` (`tool.vercel.entrypoint`) specifically so this
doesn't happen — if you still hit this after pulling the latest version,
check that both of those files exist in your repo and were actually
committed.

**`/api/backend/health` shows an error, not `{"status":"ok"}`**
Open the deployment → the **backend** service's logs specifically (not the
frontend's). Re-check the 3 Supabase-related env vars for typos, especially
`SUPABASE_JWT_SECRET` — it's easy to copy the wrong "secret"-looking value
from the Supabase API page. Redeploy after fixing.

**Frontend loads but shows no content anywhere**
Confirm you've published at least one article (Step 10), and that
`NEXT_PUBLIC_API_URL` is **blank** in your Vercel env vars (a leftover value
here would override the same-origin default and point at nothing).

**Signing in at `/admin` fails**
Confirm the `admins` table actually has a row with that user's UID (Step 3.4)
— an account can authenticate successfully and still be correctly rejected
if it isn't in that table.

**"Hire Me" opens an email to `{{OWNER_EMAIL}}`**
`NEXT_PUBLIC_OWNER_EMAIL` wasn't set in Vercel's env vars — add it (Step 8)
and redeploy.
