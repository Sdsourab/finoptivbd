# Finoptiv — Project Blueprint (02: Database Schema — Supabase/Postgres)

> Run this as a single migration in the Supabase SQL editor, in this order. Every table has RLS enabled — never disable RLS to "make it work faster."

## Extensions

```sql
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for search on article/post body later
```

## Core tables

```sql
-- Admin/editor identity, one row per Supabase Auth user who is allowed to write.
create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- Methodology tags: fixed vocabulary, matches the owner's real project types.
create table methodologies (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,          -- e.g. "Causal Inference"
  slug text not null unique,          -- e.g. "causal-inference"
  description text
);

-- Content categories (normalized — replaces the old free-text tag field
-- that caused duplicate/typo'd tags in the v1 site).
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique
);

-- Core content table — holds BOTH content tracks:
--   content_type = 'case_study' -> uses the structured problem/data/method/result fields
--   content_type = 'blog_post'  -> uses body_markdown, structured fields stay null
-- One table, one slug namespace, one related-content query — simpler than
-- splitting into two tables, and both tracks share every other column.
create table articles (
  id uuid primary key default uuid_generate_v4(),
  content_type text not null default 'case_study'
    check (content_type in ('case_study','blog_post')),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  cover_image_url text,
  category_id uuid references categories(id) on delete set null,
  methodology_id uuid references methodologies(id) on delete set null,

  -- case-study structure (case_study only; leave null for blog_post)
  problem text,
  data_description text,
  method text,
  result text,
  business_implication text,

  -- blog structure (blog_post only; leave null for case_study)
  body_markdown text,
  reading_time_minutes int,

  -- reproducibility signal (Phase 2, case_study only)
  colab_url text,
  dataset_available boolean not null default false,
  notebook_available boolean not null default false,
  deterministic boolean not null default false,

  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_status_published_idx on articles (status, published_at desc);
create index articles_content_type_idx on articles (content_type);
create index articles_category_idx on articles (category_id);
create index articles_methodology_idx on articles (methodology_id);

-- Impact stat strip: 2-3 short stat/label pairs per article (case studies mainly).
create table article_stats (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  label text not null,        -- e.g. "Papers analyzed"
  value text not null,        -- e.g. "7,450"
  sort_order int not null default 0
);
create index article_stats_article_idx on article_stats (article_id);
```

**Related content:** deliberately *not* a stored column/table. Related items are computed at query time — same `methodology_id` or `category_id`, excluding the current slug, most recent first, capped at 3. A stored `related_article_ids` array goes stale the moment content changes; a query never does. See `03-BACKEND-SPEC.md` for the endpoint.

## Phase 2 tables

```sql
-- Live status for the bd-news-collector pipeline (or any future pipeline).
create table pipeline_runs (
  id uuid primary key default uuid_generate_v4(),
  pipeline_name text not null,
  last_run_at timestamptz not null default now(),
  items_collected int not null default 0,
  status text not null default 'ok' check (status in ('ok','error','running')),
  note text
);

-- Gated dataset/notebook download requests.
create table download_requests (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid references articles(id) on delete set null,
  requester_email text not null,
  requested_at timestamptz not null default now(),
  fulfilled boolean not null default false
);
```

## Phase 3 tables

```sql
-- Public prediction ledger.
create table predictions (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid references articles(id) on delete set null,
  claim text not null,
  predicted_value text not null,
  predicted_at timestamptz not null default now(),
  actual_value text,
  resolved_at timestamptz,
  error_pct numeric
);

-- Service/consulting offerings for the selling page.
create table services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  starting_price_usd numeric,
  active boolean not null default true,
  sort_order int not null default 0
);
```

## Row Level Security

```sql
alter table admins enable row level security;
alter table methodologies enable row level security;
alter table categories enable row level security;
alter table articles enable row level security;
alter table article_stats enable row level security;
alter table pipeline_runs enable row level security;
alter table download_requests enable row level security;
alter table predictions enable row level security;
alter table services enable row level security;

-- Public read: published content only.
create policy "public read published articles" on articles
  for select using (status = 'published');
create policy "public read categories" on categories for select using (true);
create policy "public read methodologies" on methodologies for select using (true);
create policy "public read article_stats of published articles" on article_stats
  for select using (
    exists (select 1 from articles a where a.id = article_stats.article_id and a.status = 'published')
  );
create policy "public read pipeline_runs" on pipeline_runs for select using (true);
create policy "public read predictions" on predictions for select using (true);
create policy "public read active services" on services for select using (active = true);

-- Admin write: only rows where auth.uid() exists in admins.
create policy "admin full access articles" on articles
  for all using (exists (select 1 from admins a where a.id = auth.uid()))
  with check (exists (select 1 from admins a where a.id = auth.uid()));
-- Repeat the same admin-full-access pattern for categories, methodologies,
-- article_stats, pipeline_runs, predictions, services.

-- download_requests: anyone can insert (submit a request), only admins can read.
create policy "anyone can request a download" on download_requests
  for insert with check (true);
create policy "admin read download_requests" on download_requests
  for select using (exists (select 1 from admins a where a.id = auth.uid()));
```

## Storage buckets

| Bucket | Public? | Purpose |
|---|---|---|
| `article-images` | Public read | Cover images, in-article charts, system-design diagram assets |
| `datasets` | **Private** | Gated dataset/notebook files — served via short-lived signed URLs only |

## Seed data note

```sql
insert into methodologies (name, slug) values
  ('Causal Inference', 'causal-inference'),
  ('NLP / Topic Modeling', 'nlp-topic-modeling'),
  ('Bibliometric Analysis', 'bibliometric-analysis'),
  ('Actuarial Modeling', 'actuarial-modeling'),
  ('Data Engineering', 'data-engineering');
```
