# Finoptiv — Project Blueprint (04: Frontend — Next.js)

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, deployed as its own Vercel project rooted at `frontend/`. Tailwind theme config encodes every token from `01-DESIGN-SYSTEM.md` directly — no component ever hardcodes a hex value.

## Route map

```
/                         Home — hero, featured case studies + recent posts, stat highlights (clean style)
/work                     Case-study list, methodology + category filters (clean style)
/work/[slug]              Case-study detail: 5-section layout + stat strip + contact sidebar + related content
/writing                  Blog list (clean style)
/writing/[slug]           Blog post detail: body + reading time + contact sidebar + related content
/system-design            Public architecture explainer (clean style, content sourced from 08-SYSTEM-DESIGN.md)
/about                    Illustrated retro-window page
/services                 Pricing/consulting packages — Phase 3 (clean style)
/predictions              Public prediction ledger — Phase 3 (clean style)
/admin                    Auth-gated CMS: login, article table, create/edit form
/api/og/[slug]            Dynamic OG image generation per article
404 / loading / empty     Illustrated retro-window style throughout
```

`/work` and `/writing` both read from the same `articles` table (filtered by `content_type`), so a shared `ArticleCard`/`CaseStudyLayout` component family covers both — see component inventory below.

## Component inventory

Core (clean dashboard style — the default bundle, always loaded):
- `Navbar` — logo, nav links, `HireMeButton`, admin login state
- `Hero` — home page, uses the primary gradient once
- `StatStrip` — renders `article_stats`, monospace tabular figures
- `MethodologyFilter` — pill/tag filter bar
- `ArticleCard` — list-view card, works for both content types
- `CaseStudyLayout` — the five-section case-study renderer
- `BlogPostLayout` — body renderer + reading-time badge for `/writing/[slug]`
- `ContactSidebar` — email + copy-email fallback + one-line services note, per `01`'s spec
- `HireMeButton` — nav/footer/mobile-sticky-bar variants of one component
- `RelatedContent` — bottom-of-page module, calls `/articles/{slug}/related`
- `ArchitectureDiagram` — renders the system-design diagram from structured data, not a static image (keeps it accessible and themeable)
- `PipelineStatusWidget` — Phase 2
- `ReproducibilityBadge` — Phase 2
- `RunItYourselfButton` — Phase 2
- `PredictionLedgerCard` — Phase 3

Illustrated (retro-window style, isolated in `components/retro/`, **dynamically imported so it never ships on core pages**):
- `RetroWindowFrame`
- `RetroSidebar`
- `HalftoneChart`
- `RetroIcon` set

## Data fetching & caching

- `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`, `/system-design` are statically generated at build time for known slugs and use **ISR** (`revalidate: 60`) — fast as static HTML, still picks up admin edits within a minute, no full redeploy needed per content change.
- The `/admin` area is client-rendered (needs the live Supabase session), using a thin client-side fetch wrapper with the admin's bearer token attached.
- No global state library — server data + local component state is enough at this scope.

## "No dead ends" rule (engagement)

Every page under `/work/[slug]` and `/writing/[slug]` ends with, in this order: `RelatedContent` (3 items), then the `ContactSidebar`'s Hire Me CTA restated once more inline. A visitor finishing a piece always has an obvious next click — never a hard stop.

## Hire Me behavior

```
mailto:{{OWNER_EMAIL}}?subject=Portfolio%20inquiry%20—%20{{PAGE_TITLE}}
```
`{{OWNER_EMAIL}}` is a build-time constant the owner fills in — never invent or guess an address. Pair every mailto link with a small "copy email" icon button (`navigator.clipboard.writeText`) as a fallback, since `mailto:` doesn't reliably open a configured client on every device.

## System Design page

Content sourced directly from `08-SYSTEM-DESIGN.md` — architecture diagram (via `ArchitectureDiagram`, data-driven, not a screenshot), request-lifecycle walkthrough, security model summary, performance strategy summary. This page is written for a technical reader; it is the site's most direct answer to "prove real engineering happened here."

## SEO

- Each `/work/[slug]` and `/writing/[slug]` page generates `<meta>` tags via `generateMetadata`.
- `/api/og/[slug]` generates a unique social-preview image per piece (title + tag on a branded background) — fixes the v1 issue where every shared link showed an identical preview.
- `sitemap.xml` and `robots.txt` generated from published content across both tracks.

## Performance — hard requirements, not aspirations

Targets (mobile, checked with Lighthouse/PageSpeed before every launch per `07`):
- LCP < 2.5s, CLS < 0.1, INP < 200ms, Performance score ≥ 90

How this bundle gets there by construction, not by later optimization:
- **ISR + static generation** for every public content page (above) — most requests never touch the backend at all.
- **Code-split the illustrated bundle** (`components/retro/*`) via `next/dynamic` — it only downloads on `/about`/`/404`/empty states, never on `/`, `/work/*`, `/writing/*`, `/system-design`.
- **`next/font`**, self-hosted and subsetted — no render-blocking third-party font request.
- **`next/image`** everywhere, explicit `width`/`height` on every image to prevent layout shift; Supabase Storage domain added to `images.remotePatterns` in `next.config.js`.
- **Glass/blur effects capped at one per page** (see `01`) — they're expensive to paint and easy to overuse.
- **JS budget per core page: ~150KB gzipped** — if a page exceeds this, that's a signal something (usually an unneeded client component) should move server-side or be dynamically imported.
- Backend responses are cache-headered (`03`), so even the rare non-static request resolves fast at the edge.

## Accessibility floor

Everything in `01-DESIGN-SYSTEM.md`'s accessibility section applies without exception: focus states, `prefers-reduced-motion`, real alt text on every retro icon and diagram node.
