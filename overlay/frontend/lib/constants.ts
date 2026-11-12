// Set NEXT_PUBLIC_OWNER_EMAIL in Vercel before launch. An empty fallback
// prevents a personal or placeholder email from being published accidentally.
export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim() || "";

export const SITE_NAME = "Finoptiv";
export const SITE_TAGLINE = "Data Driven. Insight Focused. Future Ready.";
export const SITE_DESCRIPTION =
  "Finoptiv is a data intelligence and analytics driven fintech brand committed to transforming complex data into actionable insights for a smarter, future-ready world.";

export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || undefined;
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || undefined;

export const WHAT_I_TAKE_ON =
  "Available for data-cleaning, causal-inference consulting, and small analytics pipeline builds.";
