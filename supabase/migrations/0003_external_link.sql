-- Finoptiv — external-link articles
-- Run after 0001_init.sql and 0002_phase2_phase3.sql.

-- When set, this article is a pointer to content published elsewhere. The
-- article still gets its own /work/[slug] or /writing/[slug] page (title,
-- excerpt, stats, cover image — so it has a real Finoptiv URL with a proper
-- social-share preview), but the page leads with a prominent link out to
-- the real thing instead of full Problem/Data/Method/Result sections.
alter table articles add column if not exists external_url text;
