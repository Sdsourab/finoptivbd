import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
const routes=["/","/work","/services","/services/data-analysis","/services/business-analysis","/services/dashboard-analytics","/services/forecasting","/services/sql-python","/services/ai-automation","/gallery","/writing","/predictions","/about","/system-design"];
export default function sitemap(): MetadataRoute.Sitemap(){return routes.map(path=>({url:`${SITE_URL}${path}`,changeFrequency:path==="/"?"weekly":"monthly",priority:path==="/" ? 1 : path.startsWith("/services") ? 0.9 : 0.7}));}
