"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type { Article, ContentType } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

type FormState = {
  content_type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  problem: string;
  data_description: string;
  method: string;
  result: string;
  business_implication: string;
  body_markdown: string;
  external_url: string;
  status: "draft" | "published";
};

function toFormState(a?: Article): FormState {
  return {
    content_type: a?.content_type ?? "case_study",
    title: a?.title ?? "",
    slug: a?.slug ?? "",
    excerpt: a?.excerpt ?? "",
    cover_image_url: a?.cover_image_url ?? "",
    problem: a?.problem ?? "",
    data_description: a?.data_description ?? "",
    method: a?.method ?? "",
    result: a?.result ?? "",
    business_implication: a?.business_implication ?? "",
    body_markdown: a?.body_markdown ?? "",
    external_url: a?.external_url ?? "",
    status: a?.status ?? "draft",
  };
}

export function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [isExternal, setIsExternal] = useState(Boolean(initial?.external_url));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        content_type: form.content_type,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        cover_image_url: form.cover_image_url.trim() || null,
        status: form.status,
        external_url: isExternal && form.external_url.trim() ? form.external_url.trim() : null,
      };
      if (!isExternal) {
        if (form.content_type === "case_study") {
          payload.problem = form.problem;
          payload.data_description = form.data_description;
          payload.method = form.method;
          payload.result = form.result;
          payload.business_implication = form.business_implication;
        } else {
          payload.body_markdown = form.body_markdown;
        }
      }

      if (initial) {
        await adminApi.updateArticle(initial.id, payload);
      } else {
        await adminApi.createArticle(payload);
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-bg-card px-3 py-2 text-body text-text-primary";
  const labelClass = "block text-small text-text-secondary";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="flex gap-4">
        <label className={`${labelClass} flex-1`}>
          Type
          <select
            value={form.content_type}
            onChange={(e) => set("content_type", e.target.value as ContentType)}
            className={inputClass}
          >
            <option value="case_study">Case study</option>
            <option value="blog_post">Blog post</option>
          </select>
        </label>
        <label className={`${labelClass} flex-1`}>
          Status
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as "draft" | "published")}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className={labelClass}>
        Title
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputClass} />
      </label>

      <label className={labelClass}>
        Slug
        <input
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          required
          className={`${inputClass} font-mono`}
        />
      </label>

      <label className={labelClass}>
        Excerpt
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          required
          rows={2}
          className={inputClass}
        />
      </label>

      <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} label="Cover image" />

      <div className="rounded-md border border-white/10 bg-bg-card p-4">
        <label className="flex items-center gap-2 text-small text-text-secondary">
          <input type="checkbox" checked={isExternal} onChange={(e) => setIsExternal(e.target.checked)} />
          This is written elsewhere — just link out to it
        </label>
        <p className="mt-1 text-caption text-text-muted">
          The full piece stays where you already wrote it (Medium, LinkedIn, a Colab notebook, GitHub...). This
          page still gets its own Finoptiv URL and a proper social-share preview, with a &quot;Read the full
          article →&quot; button pointing there.
        </p>
        {isExternal && (
          <label className={`${labelClass} mt-3 block`}>
            External URL
            <input
              type="url"
              value={form.external_url}
              onChange={(e) => set("external_url", e.target.value)}
              placeholder="https://..."
              required={isExternal}
              className={inputClass}
            />
          </label>
        )}
      </div>

      {!isExternal &&
        (form.content_type === "case_study" ? (
          <>
            <label className={labelClass}>
              Problem
              <textarea value={form.problem} onChange={(e) => set("problem", e.target.value)} rows={3} className={inputClass} />
            </label>
            <label className={labelClass}>
              Data
              <textarea
                value={form.data_description}
                onChange={(e) => set("data_description", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Method
              <textarea value={form.method} onChange={(e) => set("method", e.target.value)} rows={3} className={inputClass} />
            </label>
            <label className={labelClass}>
              Result
              <textarea value={form.result} onChange={(e) => set("result", e.target.value)} rows={3} className={inputClass} />
            </label>
            <label className={labelClass}>
              Business Implication
              <textarea
                value={form.business_implication}
                onChange={(e) => set("business_implication", e.target.value)}
                rows={3}
                className={inputClass}
              />
              <span className="text-caption text-text-muted">Required before this can be published.</span>
            </label>
          </>
        ) : (
          <label className={labelClass}>
            Body (markdown)
            <textarea
              value={form.body_markdown}
              onChange={(e) => set("body_markdown", e.target.value)}
              rows={12}
              className={`${inputClass} font-mono`}
            />
            <span className="text-caption text-text-muted">Required before this can be published.</span>
          </label>
        ))}

      {error && <p className="text-small text-error">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-lime-accent px-5 py-2.5 text-small font-semibold text-deep-forest-green disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
