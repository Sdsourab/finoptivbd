-- Finoptiv — seed data
-- Run after BOTH 0001_init.sql and 0002_phase2_phase3.sql (the services
-- insert below relies on the unique index 0002 adds). Safe to re-run.

insert into methodologies (name, slug) values
  ('Causal Inference', 'causal-inference'),
  ('NLP / Topic Modeling', 'nlp-topic-modeling'),
  ('Bibliometric Analysis', 'bibliometric-analysis'),
  ('Actuarial Modeling', 'actuarial-modeling'),
  ('Data Engineering', 'data-engineering')
on conflict (slug) do nothing;

-- Service names are verbatim from docs/05-CONTENT-AND-FEATURES.md — pricing
-- was never specified there (deliberately not invented here either), so
-- starting_price_usd is left null (the /services page shows "Contact for
-- pricing" for any card without one) and active=false so nothing appears
-- live until you've reviewed it in /admin and turned it on.
insert into services (name, description, starting_price_usd, related_case_study_slug, active, sort_order) values
  ('Literature review / bibliometric report', 'A structured review of a research area, or a full bibliometric analysis of a paper corpus — citation trends, topic clusters, influential authors.', null, null, false, 1),
  ('Data cleaning', 'Messy spreadsheets and exports turned into clean, analysis-ready datasets, using the same tooling behind RowSense.', null, null, false, 2),
  ('Causal-inference consulting', 'Framing and estimating a causal question properly — DAGs, identification strategy, and an honest read of what the data can and can''t support.', null, null, false, 3),
  ('Custom Colab pipeline build', 'A reproducible, documented analysis pipeline built in Google Colab, handed over ready to run.', null, null, false, 4)
on conflict (name) do nothing;

