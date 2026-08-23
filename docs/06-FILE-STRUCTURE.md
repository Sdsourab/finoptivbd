# Finoptiv — Project Blueprint (06: Repository File Structure)

Single GitHub monorepo, two Vercel projects pointing at the two subfolders.

```
finoptiv/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # /
│   │   ├── work/
│   │   │   ├── page.tsx                # /work
│   │   │   └── [slug]/page.tsx         # /work/[slug]
│   │   ├── writing/
│   │   │   ├── page.tsx                # /writing
│   │   │   └── [slug]/page.tsx         # /writing/[slug]
│   │   ├── system-design/page.tsx      # /system-design
│   │   ├── about/page.tsx              # illustrated style
│   │   ├── services/page.tsx           # phase 3
│   │   ├── predictions/page.tsx        # phase 3
│   │   ├── admin/
│   │   │   ├── page.tsx                # login + article table
│   │   │   └── articles/[id]/page.tsx  # edit form
│   │   ├── api/og/[slug]/route.tsx
│   │   ├── not-found.tsx               # illustrated 404
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── StatStrip.tsx
│   │   ├── MethodologyFilter.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── CaseStudyLayout.tsx
│   │   ├── BlogPostLayout.tsx
│   │   ├── ContactSidebar.tsx
│   │   ├── HireMeButton.tsx
│   │   ├── RelatedContent.tsx
│   │   ├── ArchitectureDiagram.tsx
│   │   ├── PipelineStatusWidget.tsx
│   │   ├── ReproducibilityBadge.tsx
│   │   ├── RunItYourselfButton.tsx
│   │   ├── PredictionLedgerCard.tsx
│   │   └── retro/                      # dynamically imported only, never in core bundle
│   │       ├── RetroWindowFrame.tsx
│   │       ├── RetroSidebar.tsx
│   │       ├── HalftoneChart.tsx
│   │       └── icons/
│   ├── lib/
│   │   ├── api.ts                      # fetch wrapper for the FastAPI backend
│   │   ├── constants.ts                # {{OWNER_EMAIL}} and other build-time constants
│   │   └── supabaseClient.ts           # frontend-side Supabase Auth only
│   ├── styles/globals.css
│   ├── tailwind.config.ts              # every token from 01-DESIGN-SYSTEM.md
│   ├── public/
│   ├── next.config.js                  # images.remotePatterns for Supabase Storage
│   ├── package.json
│   └── vercel.json (if needed for redirects)
│
├── backend/
│   ├── api/index.py
│   ├── app/
│   │   ├── main.py
│   │   ├── core/{config.py, security.py}
│   │   ├── db/supabase_client.py
│   │   ├── schemas/{article.py, category.py, pipeline.py, prediction.py}
│   │   └── routers/{articles.py, categories.py, methodologies.py, pipeline.py, predictions.py, services.py, admin.py}
│   ├── tests/test_articles.py
│   ├── requirements.txt
│   └── vercel.json
│
├── supabase/
│   ├── migrations/
│   │   └── 0001_init.sql               # everything from 02-DATABASE-SCHEMA.md
│   └── seed.sql                        # methodology rows + any sample content
│
├── .github/
│   └── workflows/
│       ├── ci.yml                      # lint + pytest on push/PR
│       └── keepalive.yml               # scheduled ping to /health
│
├── docs/
│   └── (this blueprint bundle, kept in-repo for future reference)
│
├── .gitignore
└── README.md                            # project intro + link to /docs
```

## Naming conventions

- Files: `kebab-case` for routes/folders, `PascalCase` for React components, `snake_case` for Python.
- Branches: `main` (production, auto-deploys both Vercel projects), feature branches `feat/<short-name>`, no direct commits to `main` once the MVP is live.
- Commits: imperative mood ("Add related-content endpoint," not "Added" or "Adding") — small, consistent commit history is itself a portfolio signal.
