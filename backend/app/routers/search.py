from fastapi import APIRouter, Depends, Query, Response
from supabase import Client

from app.db.helpers import attach_cache_headers, batch_attach_stats
from app.db.supabase_client import get_supabase
from app.schemas.article import ArticleOut

router = APIRouter(tags=["search"])


@router.get("/search", response_model=list[ArticleOut])
def search(
    response: Response,
    q: str = Query(..., min_length=2, description="search text"),
    supabase: Client = Depends(get_supabase),
):
    """Fuzzy keyword search (Postgres pg_trgm) over published articles —
    NOT embeddings-based semantic search. See migration 0002 for why.
    Calls the search_articles() SQL function via RPC since ranking by
    similarity() isn't expressible through the plain query builder.
    """
    result = supabase.rpc("search_articles", {"search_query": q.strip()}).execute()
    attach_cache_headers(response)
    return batch_attach_stats(supabase, result.data)
