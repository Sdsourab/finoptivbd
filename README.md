# Finoptiv

Finoptiv is a data-intelligence and research portfolio built with Next.js, FastAPI, and Supabase.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSdsourab%2Ffinoptivbd&project-name=finoptivbd&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,SUPABASE_SECRET_KEY,NEXT_PUBLIC_OWNER_EMAIL)

**Before deploying:** create a Supabase project, run the SQL migrations and seed file, and create the owner admin account. The Deploy Button then imports the repository into Vercel and asks for the required environment values. Follow [`DEPLOYMENT-GUIDE.md`](./DEPLOYMENT-GUIDE.md).

## Architecture

- `frontend/` — Next.js App Router and Tailwind CSS
- `backend/` — FastAPI API deployed as a Vercel Python service
- `supabase/` — ordered Postgres migrations, RLS policies, and seed data
- `vercel.json` — a single Vercel Services deployment and same-domain API routing

## Local development

For a production-like local run, install the Vercel CLI and run `vercel dev` from the repository root. For separate development servers, see the commands below.

Backend:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend (in a second terminal):

```bash
cd frontend
npm ci
npm run dev
```

Set the environment variables from `backend/.env.example` and `frontend/.env.example`. For separate local servers, set `NEXT_PUBLIC_API_URL=http://localhost:8000` in the frontend environment.

## Quality checks

GitHub Actions runs backend tests, frontend lint, and a production frontend build for every push and pull request.
