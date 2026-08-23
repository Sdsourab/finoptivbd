import type { Article, Category, ContentType, GalleryItem, Methodology, PipelineRun, Prediction, Service } from "./types";

// Deployed as a Vercel Service (see /vercel.json at the repo root), sharing
// one domain with the backend — so in production this is relative ("",
// same origin) and every call below is prefixed with /api/backend, which is
// the only path the root vercel.json routes to the backend service. Set
// NEXT_PUBLIC_API_URL only for local dev when running the backend as its
// own process on another port (e.g. http://localhost:8000) instead of via
// `vercel dev`.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = `${API_ORIGIN}/api/backend`;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    // Page-level ISR (revalidate: 60) already governs freshness for public
    // content pages; this just keeps Next's own fetch cache in step with it
    // rather than layering a second, different cache policy on top.
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getArticles(params?: {
  content_type?: ContentType;
  category?: string;
  methodology?: string;
  page?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.content_type) qs.set("content_type", params.content_type);
  if (params?.category) qs.set("category", params.category);
  if (params?.methodology) qs.set("methodology", params.methodology);
  if (params?.page) qs.set("page", String(params.page));
  const query = qs.toString();
  return apiFetch<Article[]>(`/articles${query ? `?${query}` : ""}`);
}

export function getArticle(slug: string) {
  return apiFetch<Article>(`/articles/${slug}`);
}

export function getRelatedArticles(slug: string) {
  return apiFetch<Article[]>(`/articles/${slug}/related`);
}

export function getCategories() {
  return apiFetch<Category[]>("/categories");
}

export function getMethodologies() {
  return apiFetch<Methodology[]>("/methodologies");
}

export function getServices() {
  return apiFetch<Service[]>("/services");
}

export function getPredictions() {
  return apiFetch<Prediction[]>("/predictions");
}

export function getPipelineStatus() {
  return apiFetch<PipelineRun[]>("/pipeline-status");
}

export function getGallery() {
  return apiFetch<GalleryItem[]>("/gallery");
}

export function searchArticles(q: string) {
  if (q.trim().length < 2) return Promise.resolve<Article[]>([]);
  return apiFetch<Article[]>(`/search?q=${encodeURIComponent(q.trim())}`);
}

export async function requestDownload(articleId: string, email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/download-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article_id: articleId, requester_email: email }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { detail?: string });
    throw new Error(body.detail || "Request failed.");
  }
}
