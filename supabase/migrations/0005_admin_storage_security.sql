-- Finoptiv — admin RLS and storage upload hardening
-- Run AFTER 0001_init.sql through 0004_gallery.sql.
-- This migration replaces policies that queried the RLS-protected admins
-- table directly, and gives authenticated admins permission to manage the
-- public article-images bucket. It does not expose the private datasets bucket.

create or replace function public.is_finoptiv_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins a
    where a.id = (select auth.uid())
  );
$$;

revoke all on function public.is_finoptiv_admin() from public;
grant execute on function public.is_finoptiv_admin() to authenticated;

-- Rebuild admin policies so the SECURITY DEFINER function can safely read
-- the admins table even though that table intentionally has no public policy.
drop policy if exists "admin full access articles" on public.articles;
create policy "admin full access articles" on public.articles
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access categories" on public.categories;
create policy "admin full access categories" on public.categories
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access methodologies" on public.methodologies;
create policy "admin full access methodologies" on public.methodologies
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access article_stats" on public.article_stats;
create policy "admin full access article_stats" on public.article_stats
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access pipeline_runs" on public.pipeline_runs;
create policy "admin full access pipeline_runs" on public.pipeline_runs
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access predictions" on public.predictions;
create policy "admin full access predictions" on public.predictions
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access services" on public.services;
create policy "admin full access services" on public.services
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

drop policy if exists "admin read download_requests" on public.download_requests;
create policy "admin read download_requests" on public.download_requests
  for select to authenticated
  using ((select public.is_finoptiv_admin()));

drop policy if exists "admin full access gallery_items" on public.gallery_items;
create policy "admin full access gallery_items" on public.gallery_items
  for all to authenticated
  using ((select public.is_finoptiv_admin()))
  with check ((select public.is_finoptiv_admin()));

-- Create/update the image bucket from SQL so first-time setup does not depend
-- on a separate dashboard click. Public means reads are public; writes remain
-- protected by the policy below.
insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'article-images',
  'article-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Keep the datasets bucket private for future gated downloads.
insert into storage.buckets (id, name, public)
values ('datasets', 'datasets', false)
on conflict (id) do nothing;

-- Public buckets bypass RLS for file reads only. Upload/update/delete still
-- require a policy, so only authenticated Finoptiv admins can manage images.
drop policy if exists "Finoptiv admins manage article images" on storage.objects;
create policy "Finoptiv admins manage article images" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'article-images'
    and (select public.is_finoptiv_admin())
  )
  with check (
    bucket_id = 'article-images'
    and (select public.is_finoptiv_admin())
  );

-- Ensure article timestamps stay accurate for admin sorting and the sitemap.
create or replace function public.set_article_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_article_updated_at();
