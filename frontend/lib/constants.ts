export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim() || "sourabdey.vii@gmail.com";
export const SITE_NAME = "Finoptiv";
export const SITE_TAGLINE = "Business & Data Analytics • Insight Driven • Future Ready";
export const SITE_DESCRIPTION = "Finoptiv helps businesses turn complex data into clear insights, dashboards, forecasts, and practical decisions using business analysis, data analytics, SQL, Python, BI, and AI.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, "")}` : "https://frontend-ruddy-three-g1ao4268s9.vercel.app");
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Sdsourab/finoptivbd";
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || undefined;
export const WHAT_I_TAKE_ON = "Available for business analysis, data analysis, dashboards, forecasting, SQL/Python work, and practical AI-enabled analytics projects.";
export const SERVICES = [
  { title: "Data Analysis", short: "Clean, explore, segment, and explain business data.", href: "/services/data-analysis" },
  { title: "Business Analysis", short: "Turn business questions into structured decisions and requirements.", href: "/services/business-analysis" },
  { title: "Dashboards & BI", short: "Build KPI dashboards and reporting that decision-makers can use.", href: "/services/dashboard-analytics" },
  { title: "Forecasting", short: "Estimate demand, sales, revenue, and scenarios from historical data.", href: "/services/forecasting" },
  { title: "SQL & Python", short: "Extract, transform, analyze, and automate repeatable data workflows.", href: "/services/sql-python" },
  { title: "AI & Automation", short: "Add practical AI, predictive models, and automation to business workflows.", href: "/services/ai-automation" },
] as const;
