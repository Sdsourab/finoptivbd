# Finoptiv — deployment guide

This repository deploys as **one Vercel project with two Vercel Services**: a Next.js frontend and a FastAPI backend on the same domain. Vercel Services is currently in Beta. Keep the project root at `./` and set the Vercel Framework Preset to **Services** if it is not selected automatically.

## 1. Create Supabase project

1. Open [Supabase](https://supabase.com) and create a project.
2. Choose a region close to your expected visitors (Singapore is a reasonable starting choice for Bangladesh).
3. Wait until the project is ready.

## 2. Create the database

Open **SQL Editor → New query** and run these files in this exact order, copying each complete file from this repository:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_phase2_phase3.sql`
3. `supabase/migrations/0003_external_link.sql`
4. `supabase/migrations/0004_gallery.sql`
5. `supabase/migrations/0005_admin_storage_security.sql`
6. `supabase/seed.sql`

Migration `0005` creates the `article-images` public bucket, keeps `datasets` private, fixes admin RLS checks, and grants image management only to signed-in Finoptiv admins. You do not need to create those two buckets manually when this migration succeeds.

## 3. Create the owner admin account

1. In Supabase, open **Authentication → Users → Add user → Create new user**.
2. Enter the owner's real email and a strong password. Keep the user ID (UUID) from the created user.
3. Open **SQL Editor → New query** and run this statement, replacing the UUID and display name:

```sql
insert into public.admins (id, display_name)
values ('PASTE-AUTH-USER-UUID-HERE', 'Finoptiv Admin');
```

4. In **Authentication settings**, disable public sign-ups after creating the owner account. The website has no public sign-up page.

## 4. Collect current Supabase API values

Open **Project Settings → API Keys** (or the project's **Connect** dialog):

| Vercel variable | Supabase value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`) |
| `SUPABASE_SECRET_KEY` | Secret key (`sb_secret_...`) |
| `NEXT_PUBLIC_OWNER_EMAIL` | Email address for the portfolio's Hire Me buttons |

`SUPABASE_SECRET_KEY` is server-only. Never add it to a `NEXT_PUBLIC_` variable, frontend code, or GitHub source files.

For existing projects that have not migrated yet, the code also supports the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` variable names. New projects should use the current publishable/secret keys. `SUPABASE_JWT_SECRET` is optional and only needed for projects still using legacy HS256 JWT signing; modern asymmetric signing keys are verified through Supabase JWKS.

## 5. Deploy using the Vercel button

Click the button in the repository README, or open this link:

[Deploy Finoptiv to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSdsourab%2Ffinoptivbd&project-name=finoptivbd&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,SUPABASE_SECRET_KEY,NEXT_PUBLIC_OWNER_EMAIL)

In the Vercel import flow:

1. Sign in with GitHub and import `Sdsourab/finoptivbd`.
2. Keep **Root Directory** as `./` (the repository root). Do not select `frontend/` or `backend/` as the project root.
3. Set **Framework Preset** to **Services** if Vercel has not selected it automatically.
4. Enter the four values collected in Step 4. The Supabase URL is the same project URL used by both services.
5. Click **Deploy**.

The root `vercel.json` routes `/api/backend/*` to FastAPI and all other paths to Next.js. `backend/main.py` is the Python service entrypoint. No separate frontend and backend Vercel projects are needed.

## 6. Verify the deployment

When Vercel finishes, open:

`https://YOUR-VERCEL-DOMAIN/api/backend/health`

Expected response:

```json
{"status":"ok","database":"ok"}
```

This checks database connectivity as well as the API process. If it returns `503`, inspect the backend logs and verify that all six SQL files were run in order and the Supabase URL/secret key are correct.

The sitemap and robots file automatically use Vercel's production-domain environment variable. You may set `NEXT_PUBLIC_SITE_URL` manually if you later add a custom domain.

## 7. Configure Supabase keep-alive

Supabase Free projects may pause after a week with too little database activity. This repository's workflow now makes three database-backed health requests per day.

After the first Vercel deployment:

1. Open the GitHub repository → **Settings → Secrets and variables → Actions → Variables**.
2. Add a repository variable named `SITE_URL`.
3. Set its value to the Vercel production URL, for example `https://your-project.vercel.app` (no trailing slash).
4. Open **Actions → keepalive** and run it once with **Run workflow** to verify the setting.

Supabase says a few database requests per day are usually enough, but inactivity pausing is not guaranteed to be prevented by a keep-alive workflow. Check the Supabase dashboard and restore the project if it has paused.

## 8. Add portfolio content

Open `https://YOUR-VERCEL-DOMAIN/admin` and sign in with the owner account created in Step 3. Add at least one real case study and one writing post. The seeded services are inactive until reviewed and enabled in the admin page.

## Troubleshooting

- **`/api/backend/health` returns 503:** check backend environment variables, the Supabase project status, and migrations `0001`–`0005`.
- **Admin login works but admin API says the account is not an admin:** verify that `public.admins.id` exactly matches the Supabase Auth user's UUID.
- **Image upload is denied:** verify that migration `0005_admin_storage_security.sql` succeeded and that the signed-in user has a row in `public.admins`.
- **Frontend has no public content:** create and publish at least one article. Draft articles are intentionally not visible publicly.
- **Hire Me buttons are not visible:** set `NEXT_PUBLIC_OWNER_EMAIL` in Vercel and redeploy.
- **Build says Vercel Services is not configured:** keep the repository root as `./` and choose the **Services** framework preset in Project Settings.
