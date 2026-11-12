-- Finoptiv — seed data
-- Run after migrations 0001_init.sql through 0005_admin_storage_security.sql.
-- Safe to re-run.

insert into methodologies (name, slug) values
  ('Causal Inference', 'causal-inference'),
  ('NLP / Topic Modeling', 'nlp-topic-modeling'),
  ('Bibliometric Analysis', 'bibliometric-analysis'),
  ('Actuarial Modeling', 'actuarial-modeling'),
  ('Data Engineering', 'data-engineering')
on conflict (slug) do nothing;

-- Prices are deliberately left null until reviewed. Services are inactive
-- until the owner enables them from the admin page.
insert into services (name, description, starting_price_usd, related_case_study_slug, active, sort_order) values
  ('Literature review / bibliometric report', 'A structured review of a research area, or a full bibliometric analysis of a paper corpus — citation trends, topic clusters, influential authors.', null, null, false, 1),
  ('Data cleaning', 'Messy spreadsheets and exports turned into clean, analysis-ready datasets, using the same tooling behind RowSense.', null, null, false, 2),
  ('Causal-inference consulting', 'Framing and estimating a causal question properly — DAGs, identification strategy, and an honest read of what the data can and can''t support.', null, null, false, 3),
  ('Custom Colab pipeline build', 'A reproducible, documented analysis pipeline built in Google Colab, handed over ready to run.', null, null, false, 4)
on conflict (name) do nothing;
