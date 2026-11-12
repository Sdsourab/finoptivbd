import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/api";

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const deploymentHost = process.env.VERCEL_URL;
  const origin =
    configured ||
    (productionHost ? `https://${productionHost}` : "") ||
    (deploymentHost ? `https://${deploymentHost}` : "") ||
    "http://localhost:3000";
  return origin.replace(/\/+$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const articles = await getArticles().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/work`, lastModified: new Date() },
    { url: `${siteUrl}/gallery`, lastModified: new Date() },
    { url: `${siteUrl}/writing`, lastModified: new Date() },
    { url: `${siteUrl}/predictions`, lastModified: new Date() },
    { url: `${siteUrl}/services`, lastModified: new Date() },
    { url: `${siteUrl}/system-design`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/${article.content_type === "case_study" ? "work" : "writing"}/${article.slug}`,
    lastModified: article.updated_at,
  }));

  return [...staticRoutes, ...articleRoutes];
}
