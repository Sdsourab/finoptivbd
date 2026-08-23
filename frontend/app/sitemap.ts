import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles().catch(() => []);

    const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/work`, lastModified: new Date() },
    { url: `${SITE_URL}/gallery`, lastModified: new Date() },
    { url: `${SITE_URL}/writing`, lastModified: new Date() },
    { url: `${SITE_URL}/predictions`, lastModified: new Date() },
    { url: `${SITE_URL}/services`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/${a.content_type === "case_study" ? "work" : "writing"}/${a.slug}`,
    lastModified: a.updated_at,
  }));

  return [...staticRoutes, ...articleRoutes];
}
