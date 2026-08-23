# Finoptiv Project Blueprint (v2)

This folder is the complete backbone for rebuilding Finoptiv. Upload the whole folder to a new Claude session and ask it to build the project from these files.

**What's new in this revision:** a dedicated Writing/Blog track alongside Work/Case Studies, a global Hire Me path, an elegant per-post contact sidebar, a public System Design page, related-content on every piece so nothing dead-ends, and hard performance requirements checked before launch.

## Reading order

| File | Covers |
|---|---|
| `00-OVERVIEW.md` | Identity, quality bar, creative narrative, the two content tracks, Hire Me, System Design page, tech stack, scope roadmap — read this first |
| `01-DESIGN-SYSTEM.md` | Exact color/type tokens, where the illustrated style is/isn't allowed, contact sidebar + Hire Me visual spec, performance-relevant design rules, accessibility floor |
| `02-DATABASE-SCHEMA.md` | Full Supabase Postgres schema (SQL), the `content_type` split for case studies vs blog posts, RLS policies, storage buckets |
| `03-BACKEND-SPEC.md` | FastAPI folder layout, endpoint contract (including `/related`), auth flow, caching/performance notes, Vercel deployment config |
| `04-FRONTEND-SPEC.md` | Next.js route map (`/work`, `/writing`, `/system-design`, etc.), component inventory, Hire Me behavior, hard performance requirements |
| `05-CONTENT-AND-FEATURES.md` | Methodology taxonomy, real-project-to-case-study mapping, blog content strategy, contact content, phased feature list including monetization |
| `06-FILE-STRUCTURE.md` | The literal repo tree to produce |
| `07-DEPLOYMENT-SETUP.md` | Step-by-step GitHub + Supabase + Vercel setup, free-tier keep-alive fix, CI, performance verification, launch checklist |
| `08-SYSTEM-DESIGN.md` | Architecture diagram, request lifecycles, security and performance model — doubles as the content for the public `/system-design` page |

## Instructions for the build session

1. Read all 9 files before writing any code.
2. Build order: `02` → `03` → `04` → `05` (content seeding) → `08` (system-design page content) → `07` (deployment config).
3. MVP only, first pass — do not start Phase 2/3 features until the MVP launch checklist in `07` is fully checked, including the performance verification step.
4. Zero paid services anywhere. If a step seems to need a paid tier, stop and flag it instead of substituting a workaround that silently costs money.
5. `{{OWNER_EMAIL}}` and any social links are placeholders — get the real values from the owner rather than inventing them.
6. Where something is genuinely unspecified, make the most conservative choice consistent with `00`'s brand personality (Trustworthy, Professional) and list every such assumption explicitly in the final handoff message.
7. Deliver a working, deployable, fast project. A smaller thing that runs correctly and loads quickly beats a larger thing with gaps.
