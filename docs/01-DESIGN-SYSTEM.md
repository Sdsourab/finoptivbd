# Finoptiv — Project Blueprint (01: Design System)

> Source of truth for every color, type choice, and UI state. All values below are taken directly from the owner's brand kit — do not substitute or "improve" them.

## Color tokens

### Primary brand
| Token | Hex | Use |
|---|---|---|
| `deep-forest-green` | `#062E27` | Primary background |
| `emerald-green` | `#0B8E4C` | Secondary brand color |
| `lime-accent` | `#B7E000` | CTAs, highlights, key elements |
| `pure-white` | `#FFFFFF` | Primary text / light surfaces |
| `light-gray` | `#F4F7F6` | Section background |
| `graphite` | `#1E2525` | Secondary text |

### Primary gradient
`#062E27 → #0B8E4C → #B7E000` (left to right). Hero backgrounds and signature moments only, never on body-text sections.

### Background surfaces (UI)
| Token | Hex |
|---|---|
| Main background | `#041F1A` |
| Card background | `#08362D` |
| Hover state | `#0C4B3D` |
| Active state | `#136F57` |

### Accent / status colors
| Token | Hex |
|---|---|
| Success | `#16C784` |
| Warning | `#FFC857` |
| Error | `#FF4D5A` |
| Info | `#3AA8FF` |

### Typography colors
| Token | Hex |
|---|---|
| Primary text | `#FFFFFF` |
| Secondary text | `#C9D6D3` |
| Muted text | `#8EA6A0` |

**Action item before build:** run `#8EA6A0` on `#041F1A` through a contrast checker. If it fails WCAG AA for body-size text, darken the surface under muted text or lighten the token slightly — flag this rather than silently changing brand colors.

### Buttons
- Primary: default `#B7E000` bg / `#062E27` text → hover `#D2FF2A` bg
- Secondary: `#0B8E4C` border / `#FFFFFF` text → hover bg `rgba(183,224,0,0.12)`

### Chart colors (in order of use)
`#B7E000, #0B8E4C, #16C784, #3AA8FF, #FFC857, #FFFFFF`

### Glass / shadow / glow (use only on the hero and one signature element per page — never as a default card style)
- Glass: background `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.08)`, blur `20px`
- Shadow: `0 20px 60px rgba(0,0,0,0.35)`
- Glow: `0 0 30px rgba(183,224,0,0.28)`

## Typography

| Role | Purpose | Direction |
|---|---|---|
| Display | Headlines, hero, section titles | A geometric/grotesk sans with real presence at large sizes — avoid an overused default. |
| Body | Paragraphs, UI labels, blog-post copy | A humanist sans, high legibility at small sizes. |
| Data / mono | Stat strips, tables, code blocks, the FastAPI docs link, system-design diagram labels | A monospace with **tabular figures**. This is the face that makes the "analyst terminal" narrative real. |

Type scale (px, desktop): 64 / 40 / 28 / 20 / 16 / 14 / 12. Mobile: same scale at ~80% for the top three sizes only.

## Where the illustrated/retro style is allowed

**Allowed:** `/about`, empty states, loading skeletons, `/404`, `/500`.

**Not allowed:** home, `/work` (list + detail), `/writing` (list + detail), `/system-design`, admin, services/predictions (Phase 3). These use the clean dark dashboard language only — including the pages a first-time technical visitor is most likely to land on.

This split is also a **performance rule, not just a style rule**: the illustrated component tree (icon set, halftone renderer, retro window chrome) must be code-split so it never ships in the JS bundle for `/`, `/work/*`, `/writing/*`, or `/system-design`. See `04-FRONTEND-SPEC.md`.

When building the illustrated pages:
- Invert the reference's black-on-cream line art to **light-on-dark**: line art in `#FFFFFF` or `#B7E000` on the `#062E27` canvas, window chrome surface in `#F4F7F6`.
- Keep the classic three-dot macOS-style window chrome.
- Replace the reference's photographic halftone image with a halftone-textured chart, in `#B7E000` / `#0B8E4C`.
- Sidebar "channels" renamed to the owner's real methodology tags.
- Icon set must be internally consistent (stroke width, corner radius) across every illustrated page.

## Contact sidebar (new — the "elegant contact" element)

Appears on `/work/[slug]` and `/writing/[slug]`, sticky within the content column on desktop, collapses to a single sticky bar above the footer on mobile. Clean dashboard style, not illustrated.

- Card on `#08362D`, `1px` border `rgba(255,255,255,0.08)`, generous internal padding from the spacing scale.
- Owner's name/role line in Secondary text (`#C9D6D3`).
- One primary action: **Hire Me** — lime-accent (`#B7E000`) button, `mailto:` link with a pre-filled subject (e.g. `Portfolio inquiry — <post title>`).
- One quiet secondary action beside it: a small "copy email" icon button (mailto doesn't reliably open a mail client on every device/browser — this is the fallback, not decoration).
- Below that, a short 1–2 line "what I take on" note pulling from the services list in `05` (kept to a sentence — this is a sidebar, not a pitch page).
- No glass/glow effect here — this element needs to read as trustworthy and calm, not decorative.

## Hire Me button (nav + footer)

Same lime-accent primary-button style, same `mailto:` behavior, present in the nav bar (desktop: top right; mobile: a persistent bottom bar) and the footer. One visual language, one behavior, everywhere it appears — a visitor should never wonder if two "Hire Me" buttons do different things.

## System Design page styling

Treat `/system-design` as a **core dashboard page**, not a special page — same background/card system as `/work`. The one exception: the architecture diagram itself leans on the mono/data typeface and the chart-color palette (`#B7E000, #0B8E4C, #16C784, #3AA8FF`) to distinguish system components, since this page's entire job is to read as precise and engineered.

## Signature element

The **halftone-textured live chart inside the retro window frame**, used once on the About page hero. Everywhere else, restraint.

## Spacing scale

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96` px. No arbitrary values outside this scale.

## Performance-relevant design constraints

- No web font may block first paint — self-host via `next/font`, subset to the characters actually used.
- Glass/blur effects are expensive to render — cap at one per page (the hero), never inside a scrolling list.
- Illustrated SVG icon set stays under a defined size budget (flag if the whole set exceeds ~50KB) since it's still downloaded on the pages where it is allowed.

## Accessibility floor (non-negotiable)

- Visible keyboard focus states on every interactive element
- Respect `prefers-reduced-motion`
- Color is never the only signal (status pairs with an icon or label)
- Every retro icon and diagram node has real `alt`/`aria-label` text

## Writing voice (for UI copy, not marketing copy)

- Active voice, plain verbs: the button that says "Publish" produces a toast that says "Published" — same verb through the flow.
- Name things by what the visitor recognizes: "Filter by method," not "Query taxonomy."
- Empty states invite action: "No posts tagged Causal Inference yet — here's what's coming" beats "No results found."
- Errors state what happened and what to do next. No "Oops!," no exclamation marks.
