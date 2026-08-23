from app.main import app

# Vercel's Python runtime auto-detects an `app` variable in a root-level
# main.py (or app.py/server.py/index.py) as the Function entrypoint. The
# real FastAPI instance lives in app/main.py — this file just re-exports it
# at the location Vercel is guaranteed to find, without duplicating any
# logic. Local dev and tests still target app.main:app directly.
__all__ = ["app"]
