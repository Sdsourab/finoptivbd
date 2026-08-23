-- Finoptiv — Gallery
-- Run after 0001, 0002, 0003.

create table gallery_items (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  caption text,
  related_article_slug text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_items enable row level security;

create policy "public read gallery_items" on gallery_items
  for select using (true);

create policy "admin full access gallery_items" on gallery_items
  for all using (exists (select 1 from admins a where a.id = auth.uid()))
  with check (exists (select 1 from admins a where a.id = auth.uid()));
