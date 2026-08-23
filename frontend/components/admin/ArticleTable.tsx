"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type { Article } from "@/lib/types";

export function ArticleTable() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listArticles()
      .then(setArticles)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load articles."));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this article? This can't be undone.")) return;
    try {
      await adminApi.deleteArticle(id);
      setArticles((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  if (error) return <p className="text-small text-error">{error}</p>;
  if (!articles) return <p className="text-small text-text-muted">Loading…</p>;

  return (
    <div className="space-y-2">
      {articles.length === 0 && (
        <p className="text-small text-text-muted">No articles yet — create the first one.</p>
      )}
      {articles.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between gap-4 rounded-md border border-white/8 bg-bg-card px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-body text-text-primary">{a.title || "(untitled)"}</p>
            <p className="text-caption text-text-muted">
              {a.content_type} · {a.status} · {a.slug}
            </p>
          </div>
          <div className="flex shrink-0 gap-3 text-small">
            <Link href={`/admin/articles/${a.id}`} className="text-lime-accent hover:underline">
              Edit
            </Link>
            <button type="button" onClick={() => handleDelete(a.id)} className="text-error hover:underline">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
