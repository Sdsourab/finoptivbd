# Finoptiv — Project Blueprint (05: Content & Features)

## Methodology taxonomy (matches `02`'s seed data)

- Causal Inference
- NLP / Topic Modeling
- Bibliometric Analysis
- Actuarial Modeling
- Data Engineering

## Work / Case-study seed mapping

Each real project becomes one `articles` row with `content_type = 'case_study'`, filled into the fixed Problem/Data/Method/Result/Business Implication structure:

| Project | Methodology tag | Notes |
|---|---|---|
| Causal inference HR/People Analytics research | Causal Inference | Frame the business implication in HR-decision terms, not just statistical significance |
| Delta Life Insurance Endowment Plan 401 pipeline | Actuarial Modeling | Strong candidate for the Phase 2 reproducibility badge and Phase 3 prediction ledger |
| HRM bibliometric analysis (~7,450 OpenAlex papers) | Bibliometric Analysis | "Papers analyzed" is a strong stat-strip entry |
| Indigenous energy justice LDA topic-modeling pipeline | NLP / Topic Modeling | Good candidate for a "run it yourself" Colab link |
| bd-news-collector (multi-source BD news pipeline) | Data Engineering | Powers the Phase 2 live pipeline-status widget — and is the natural source for recurring Writing posts (below) |
| UniSync (Flask/Supabase/Vercel academic portal) | Data Engineering | Proof of work behind the Phase 3 services page |
| RowSense (browser-based data cleaning tool) | Data Engineering | Candidate for its own micro-product page if Phase 3 selling is pursued |

## Writing / Blog content strategy (new track)

Blog posts (`content_type = 'blog_post'`) are lower-friction than case studies — no fixed five-section format, just `title`, `excerpt`, `body_markdown`, `reading_time_minutes`. Suggested starting categories, so the section isn't empty at launch:

- **Commentary on BD economic news** — short analysis pieces drawing directly on data the bd-news-collector pipeline already gathers. This is a genuine content flywheel: the pipeline that's a case study on its own also feeds the blog that keeps the site active.
- **"How I built this"** — a post about Finoptiv's own architecture and design decisions, in plain language. This reinforces the System Design page from the other direction (narrative instead of diagram) and is exactly the kind of self-aware, judgment-showing content that reads well to recruiters.
- **Method explainers** — short, applied explanations of a technique used in one of the case studies (e.g. "what a causal DAG actually buys you"), linked back to the relevant `/work/[slug]` via `RelatedContent`.

Every blog post must set `reading_time_minutes` at publish time (roughly 200 words/minute is a reasonable estimate to compute from `body_markdown` length) — it's a small UX signal that the site is considerate of the reader's time.

## Contact / Hire Me content

- Primary contact method: `{{OWNER_EMAIL}}`, via the `mailto:` pattern in `04`. The owner fills this in — it is not invented here.
- The `ContactSidebar`'s one-line "what I take on" note should be one sentence, plain, e.g.: *"Available for data-cleaning, causal-inference consulting, and small analytics pipeline builds."* Keep it consistent with whatever the Phase 3 services list (below) eventually says — don't let the two drift apart.
- Optional (owner-supplied, not invented): GitHub and/or LinkedIn links can sit beside the Hire Me button in the nav/footer if the owner wants them; leave the slot in the component but don't populate a URL that wasn't given.

## Feature roadmap (phased for a free-tier solo build)

**MVP**
- Work (case-study) track + Writing (blog) track, both independently shareable per slug
- Methodology + category filters
- Impact stat strip
- Related-content module (no dead ends)
- Contact sidebar + global Hire Me button
- Public System Design page
- Admin CRUD with real auth
- Illustrated About + 404
- Public FastAPI `/docs` linked from the footer
- Performance budget met (see `04`)

**Phase 2**
- "Run it yourself" Colab buttons
- Live pipeline-status widget (bd-news-collector)
- Reproducibility badge (dataset/notebook/deterministic checklist)
- Email-gated dataset/notebook download

**Phase 3 — includes the monetization surface**
- Public prediction ledger
- Small RAG search box over the owner's own research/blog text
- Services & pricing page:
  - Service cards: literature review / bibliometric report, data cleaning (RowSense-backed), causal-inference consulting, custom Colab pipeline build — each with a starting-price range and a link to the relevant case study
  - Dataset/notebook sales: paid variant of the Phase 2 gated-download flow (add a payment link only when this phase is actually reached — none is specified here)
  - "Built this for myself, can build one for you" callout linking the UniSync case study to an "academic portal" service card

## Content rules (apply to every piece, enforced by convention where the schema can't fully enforce prose quality)

- `excerpt` is one sentence.
- For case studies: `business_implication` is mandatory before `status = 'published'` (enforced at the schema/API level, see `02`/`03`) — it's the field that separates a portfolio case study from a lab report.
- For blog posts: `body_markdown` is mandatory before publish (same enforcement).
- Stat-strip numbers are always the true numbers from the actual run, never rounded up for effect.
