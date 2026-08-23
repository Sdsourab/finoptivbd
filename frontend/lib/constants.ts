// Single source of truth for the owner's contact email — referenced from
// every Hire Me / mailto link, never hardcoded per-component.
// {{OWNER_EMAIL}} is a placeholder (see docs/00-OVERVIEW.md) — set the real
// value via NEXT_PUBLIC_OWNER_EMAIL before deploying. Never invent one.
export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "soptom.7@gmail.com";

export const SITE_NAME = "Finoptiv";
export const SITE_TAGLINE = "Data Driven. Insight Focused. Future Ready.";
export const SITE_DESCRIPTION =
  "Finoptiv is a data intelligence and analytics driven fintech brand committed to transforming complex data into actionable insights for a smarter, future-ready world.";

// Optional, owner-supplied — stays undefined (and unrendered) until given a real URL.
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || undefined;
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || undefined;

export const WHAT_I_TAKE_ON =
  "Available for data-cleaning, causal-inference consulting, and small analytics pipeline builds.";
