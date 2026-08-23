-- Finoptiv — Phase 2/3 schema additions
-- Run this AFTER 0001_init.sql (Supabase SQL Editor -> New query -> paste -> Run).
-- Safe to run on a fresh project that already has 0001 applied.

-- Lets a service card link to the case study that proves it (e.g. the
-- "built this for myself, can build one for you" UniSync callout in
-- docs/05-CONTENT-AND-FEATURES.md). Nullable — most services won't set this.
alter table services add column if not exists related_case_study_slug text;

-- services had no unique column at all in 0001_init.sql, so a seed insert
-- had nothing for ON CONFLICT to target and wasn't actually safe to re-run.
-- This makes it so, the same way methodologies.slug already does.
create unique index if not exists services_name_unique_idx on services (name);

-- ============================================================
-- Search (Phase 3) — real trigram/full-text search, not embeddings-based
-- RAG. True RAG needs a paid embeddings API or a heavy self-hosted model,
-- which conflicts with this project's own "zero paid services" rule
-- (docs/00-OVERVIEW.md). pg_trgm (already enabled in 0001_init.sql) gives a
-- genuinely working, free substitute: fuzzy keyword search ranked by
-- similarity, not semantic/meaning-based match.
-- ============================================================

create index if not exists articles_title_trgm_idx on articles using gin (title gin_trgm_ops);
create index if not exists articles_excerpt_trgm_idx on articles using gin (excerpt gin_trgm_ops);

create or replace function search_articles(search_query text)
returns setof articles
language sql
stable
as $$
  select *
  from articles
  where status = 'published'
    and (
      title ilike '%' || search_query || '%'
      or excerpt ilike '%' || search_query || '%'
      or coalesce(body_markdown, '') ilike '%' || search_query || '%'
      or coalesce(problem, '') ilike '%' || search_query || '%'
      or coalesce(method, '') ilike '%' || search_query || '%'
      or coalesce(result, '') ilike '%' || search_query || '%'
    )
  order by similarity(title, search_query) desc, published_at desc nulls last
  limit 20;
$$;
