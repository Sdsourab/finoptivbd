from fastapi import Response
from supabase import Client


def attach_cache_headers(response: Response) -> None:
    """Public GET endpoints: content changes rarely, so aggressive edge
    caching is safe and keeps response times low with no paid caching layer.
    """
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"


def batch_attach_stats(supabase: Client, articles: list[dict]) -> list[dict]:
    """Batch-fetch article_stats for a list of articles in ONE query
    (`where article_id = any(...)`) instead of one query per article — the
    classic N+1 mistake, and the one most likely to make /articles feel
    slow as content grows.
    """
    if not articles:
        return articles
    ids = [a["id"] for a in articles]
    stats_res = (
        supabase.table("article_stats")
        .select("*")
        .in_("article_id", ids)
        .order("sort_order")
        .execute()
    )
    stats_by_article: dict[str, list[dict]] = {}
    for s in stats_res.data:
        stats_by_article.setdefault(s["article_id"], []).append(s)
    for a in articles:
        a["stats"] = stats_by_article.get(a["id"], [])
    return articles
