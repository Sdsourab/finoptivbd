"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type { GalleryItem } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

export function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [relatedSlug, setRelatedSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    adminApi.listGallery().then(setItems).catch(() => setItems([]));
  }
  useEffect(refresh, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Upload or paste an image first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await adminApi.createGalleryItem({
        image_url: imageUrl.trim(),
        caption: caption.trim() || null,
        related_article_slug: relatedSlug.trim() || null,
        sort_order: items.length,
      });
      setImageUrl("");
      setCaption("");
      setRelatedSlug("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this image from the gallery?")) return;
    await adminApi.deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-bg-card px-3 py-2 text-body text-text-primary";

  return (
    <div className="space-y-10">
      <form onSubmit={handleAdd} className="max-w-xl space-y-4">
        <h2 className="font-display text-display-4 font-medium">Add an image</h2>
        <ImageUpload value={imageUrl} onChange={setImageUrl} label="Image" />
        <label className="block text-small text-text-secondary">
          Caption (optional)
          <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-small text-text-secondary">
          Related case study slug (optional)
          <input
            value={relatedSlug}
            onChange={(e) => setRelatedSlug(e.target.value)}
            placeholder="e.g. uni-sync"
            className={`${inputClass} font-mono`}
          />
        </label>
        {error && <p className="text-small text-error">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-lime-accent px-5 py-2.5 text-small font-semibold text-deep-forest-green disabled:opacity-60"
        >
          {saving ? "Adding…" : "Add to gallery"}
        </button>
      </form>

      <div>
        <h2 className="font-display text-display-4 font-medium">All images ({items.length})</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-md border border-white/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.caption || ""} className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="absolute inset-x-0 bottom-0 bg-bg-main/90 py-1.5 text-caption text-error opacity-0 transition-opacity group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}