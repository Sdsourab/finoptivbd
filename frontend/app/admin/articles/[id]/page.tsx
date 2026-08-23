"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { useRequireAdmin } from "@/lib/useRequireAdmin";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Article } from "@/lib/types";

// Inherently per-visitor and auth-driven — never statically prerendered.
export const dynamic = "force-dynamic";

export default function EditArticlePage() {
  const { checked, session } = useRequireAdmin();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !session) return;
    adminApi
      .getArticle(params.id)
      .then(setArticle)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load article."))
      .finally(() => setLoading(false));
  }, [isNew, params.id, session]);

  if (!checked || !session) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-3 font-semibold">{isNew ? "New article" : "Edit article"}</h1>
      <div className="mt-8">
        {loading && <p className="text-small text-text-muted">Loading…</p>}
        {error && <p className="text-small text-error">{error}</p>}
        {!loading && !error && <ArticleForm initial={article ?? undefined} />}
      </div>
    </div>
  );
}
