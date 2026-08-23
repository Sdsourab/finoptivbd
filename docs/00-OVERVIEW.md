# Finoptiv — Project Blueprint (00: Overview)

> This is file 1 of a multi-file specification bundle. Read all files in order (00 → 08) before writing any code. Every file inherits the identity, tech stack, and constraints defined here — do not deviate from them in later files without flagging it.
>
> **Revision note:** this is the v2 pass of the bundle. It adds a dedicated Writing/Blog track, a global Hire Me path, an elegant contact sidebar, a public System Design page, and hard performance/engagement requirements. Where this file says something different from a first read of the others, this file wins.

## What Finoptiv is

Finoptiv is a personal data-intelligence and research portfolio, built by a BBA (Management) student who runs real applied-analytics projects (causal inference, bibliometric analysis, actuarial modeling, NLP topic modeling, a live news-collection pipeline). It is **not** a generic "curated links" blog — it is evidence that the owner can scope, build, and communicate real analytical work, and it is built to a production quality bar, not a demo quality bar.

**Primary audience, in priority order:**
1. Technical/analytical recruiters (fintech, research, data roles)
2. Fellow researchers / potential co-authors
3. Potential freelance/consulting clients

**Brand essence (verbatim from the owner's brand kit — do not rephrase):**
> "Finoptiv is a data intelligence and analytics driven fintech brand committed to transforming complex data into actionable insights for a smarter, future-ready world."

Tagline: **Data Driven. Insight Focused. Future Ready.**

Brand personality: Premium, Intelligent, Trustworthy, Innovative, Modern, Professional.

## Quality bar for this build

Explicit, so it doesn't get diluted at implementation time:
- **Production-level, not a demo.** Every path a visitor can take must work, not just the happy path shown in a walkthrough.
- **A technical visitor should recognize real engineering within the first minute** — real auth, a real typed API with public docs, a visible system-design explanation, sane data modeling. This is a goal the site actively works toward, not a side effect.
- **Nobody should bounce.** Every content page ends with a clear next step (related content, or a way to contact the owner) — never a dead end.
- **Fast, everywhere.** Performance is a hard requirement, detailed in `04-FRONTEND-SPEC.md` and checked before launch in `07-DEPLOYMENT-SETUP.md`. A slow or janky site undercuts every other engineering signal on it.

## The governing creative narrative

Every design and copy decision in this bundle should trace back to one sentence:

> **"An analyst's terminal, hand-drawn."** Serious data, presented through a warm, personal, slightly nostalgic computing frame — never a generic dark-glow SaaS dashboard, never a purely whimsical illustrated toy site.

Concretely, this means a **split by page type**, not a single look for the whole site:
- **Core pages** (home, work/case-studies, writing/blog, system design, admin) → the clean dark-green/lime dashboard language from the brand kit. This is what a recruiter or engineer sees first and judges the work by.
- **Personality pages** (About, empty states, loading states, 404) → the hand-drawn/halftone retro-window illustration style, recolored into the brand palette.

Do not blend the two styles on the same screen. See `01-DESIGN-SYSTEM.md` for exactly where the line sits, and note that this split also serves performance — the heavier illustrated assets never load on the pages a recruiter is most likely to land on first.

## Two content tracks (new in this revision)

Finoptiv now has two distinct content types, both stored as `articles` rows (see `02`) but presented through separate sections:

1. **Work / Case Studies** (`/work`) — the structured Problem → Data → Method → Result → Business Implication format, one per real project. This is proof of work, aimed at recruiters.
2. **Writing / Blog** (`/writing`) — longer-form, less rigidly structured posts: commentary, tutorials, "how I built this," analysis pieces (including ones that draw on the live bd-news-collector pipeline). This is aimed at sustained engagement and SEO, and every post is independently shareable via its own link.

Every `/writing/[slug]` (and `/work/[slug]`) page carries an **elegant contact sidebar** — see `01` for the visual spec and `05` for its contents — so a reader never has to hunt for a way to reach the owner.

## Hire Me (new in this revision)

A single, consistent path to contact the owner, reachable from anywhere on the site: nav bar, footer, and the contact sidebar on content pages. It is a `mailto:` link with a pre-filled subject, paired with a "copy email" fallback (mailto doesn't reliably open a client on every device). No contact form, no backend endpoint, no new database table — this is deliberately zero-infrastructure. Full spec in `04` and `05`.

## System Design page (new in this revision)

A public `/system-design` page that explains, for a technical reader, exactly how the site is built: architecture diagram, request lifecycle, security model, performance strategy. This is the single most direct answer to "a tech person should be impressed" — it turns the engineering work itself into content. Full spec in the new `08-SYSTEM-DESIGN.md`, which is both internal documentation and the literal source content for that page.

## Tech stack (locked — free tier only, no paid services anywhere)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS | Native Vercel support, free tier is generous, SSR/ISR gives per-page SEO and speed |
| Backend | FastAPI, deployed as Vercel Python serverless functions | Owner already chose this; auto-generated OpenAPI docs double as a portfolio artifact |
| Database / Auth / Storage | Supabase (Postgres + Auth + Storage), free project | Owner has prior experience with it from UniSync |
| Hosting | Vercel (two projects from one GitHub monorepo: `frontend/`, `backend/`) | Free tier, auto-deploy on push |
| CI | GitHub Actions (lint + test only, free minutes) | Signals maintainability to technical reviewers |
| Repo | Single GitHub monorepo | Owner explicitly wants GitHub + Vercel + Supabase, zero cost |

No paid add-ons, no custom domain requirement, no paid Supabase compute.

## Known free-tier constraint to design around

Supabase free projects pause after ~7 days with no API activity. This bundle assumes a **free** keep-alive (a scheduled GitHub Action hitting a `/health` endpoint every few days) rather than any paid always-on plan — specified in `07-DEPLOYMENT-SETUP.md`.

## Scope roadmap (so nothing discussed gets lost, but the MVP stays buildable for free)

**MVP — build this first, fully working:**
- Work/Case-study format (schema-enforced) + Writing/Blog track, both independently shareable per slug
- Methodology + category filters
- Impact stat strip
- Related-content module at the bottom of every content page (no dead ends)
- Elegant contact sidebar + global Hire Me path
- Public System Design page
- Admin CRUD with real Supabase Auth (no hardcoded password anywhere)
- Illustrated About + 404
- Public FastAPI `/docs` linked from the footer
- Performance budget met (see `04`) and verified before launch (see `07`)

**Phase 2 — add once MVP is deployed and stable:**
- "Run it yourself" buttons linking to public Colab notebooks
- Live pipeline-health widget for the news-collector project
- Reproducibility checklist badge per case study
- Email-gated dataset/notebook download

**Phase 3 — optional, higher effort:**
- Public prediction ledger
- Small RAG search box over the owner's own research text
- Services/pricing page (consulting packages, dataset sales, API access tier)

Every later file marks which phase each feature belongs to. **Build and ship the MVP completely before starting Phase 2.**

## How to use this bundle (instructions for whichever Claude session builds this)

1. Read all 9 files before writing anything.
2. Build in this order: `02` (DB schema) → `03` (backend) → `04` (frontend) → `05` (seed content) → `08` (system design content) → `07` (deployment config), using `01` (design system) throughout `04`.
3. If two files ever seem to conflict, this file (`00`) wins.
4. Where a decision genuinely isn't specified, make the most conservative choice that fits the brand personality (Trustworthy, Professional) and state the assumption in the final handoff notes.
5. Deliver a working project, not a maximal one. Completeness, correctness, and speed of the MVP matter more than lines of code or feature count.
