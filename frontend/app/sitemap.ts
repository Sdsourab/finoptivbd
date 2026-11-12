import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/work", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/data-analysis", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/business-analysis", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/dashboard-analytics", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/forecasting", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/sql-python", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/ai-automation", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/writing", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/predictions", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/system-design", priority: 0.5, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: SITE_URL + path,
    priority,
    changeFrequency,
  }));
}
