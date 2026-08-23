import { supabase } from "./supabaseClient";
import type { Article, GalleryItem, Service } from "./types";

// See lib/api.ts for why this is empty (same-origin) in production.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = `${API_ORIGIN}/api/backend`;

async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { detail?: string });
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const adminApi = {
  listArticles: () => authedFetch<Article[]>("/admin/articles"),
  getArticle: (id: string) => authedFetch<Article>(`/admin/articles/${id}`),
  createArticle: (payload: Record<string, unknown>) =>
    authedFetch<Article>("/admin/articles", { method: "POST", body: JSON.stringify(payload) }),
  updateArticle: (id: string, payload: Record<string, unknown>) =>
    authedFetch<Article>(`/admin/articles/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteArticle: (id: string) => authedFetch<void>(`/admin/articles/${id}`, { method: "DELETE" }),

  listServices: () => authedFetch<Service[]>("/admin/services"),
  createService: (payload: Record<string, unknown>) =>
    authedFetch<Service>("/admin/services", { method: "POST", body: JSON.stringify(payload) }),
  updateService: (id: string, payload: Record<string, unknown>) =>
    authedFetch<Service>(`/admin/services/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteService: (id: string) => authedFetch<void>(`/admin/services/${id}`, { method: "DELETE" }),

  listGallery: () => authedFetch<GalleryItem[]>("/admin/gallery"),
  createGalleryItem: (payload: Record<string, unknown>) =>
    authedFetch<GalleryItem>("/admin/gallery", { method: "POST", body: JSON.stringify(payload) }),
  updateGalleryItem: (id: string, payload: Record<string, unknown>) =>
    authedFetch<GalleryItem>(`/admin/gallery/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteGalleryItem: (id: string) => authedFetch<void>(`/admin/gallery/${id}`, { method: "DELETE" }),
};
