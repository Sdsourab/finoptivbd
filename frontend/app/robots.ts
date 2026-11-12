import type { MetadataRoute } from "next";

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
