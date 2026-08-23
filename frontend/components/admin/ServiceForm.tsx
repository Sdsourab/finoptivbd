"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type { Service } from "@/lib/types";

export function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.starting_price_usd?.toString() ?? "");
  const [relatedSlug, setRelatedSlug] = useState(initial?.related_case_study_slug ?? "");
  const [active, setActive] = useState(initial?.active ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-bg-card px-3 py-2 text-body text-text-primary";
  const labelClass = "block text-small text-text-secondary";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        description,
        starting_price_usd: price.trim() ? Number(price) : null,
        related_case_study_slug: relatedSlug.trim() || null,
        active,
      };
      if (initial) {
        await adminApi.updateService(initial.id, payload);
      } else {
        await adminApi.createService(payload);
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <label className={labelClass}>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className={inputClass} />
      </label>
      <label className={labelClass}>
        Starting price (USD, leave blank to show &quot;Contact for pricing&quot;)
        <input
          type="number"
          min="0"
          step="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Related case study slug (optional)
        <input
          value={relatedSlug}
          onChange={(e) => setRelatedSlug(e.target.value)}
          placeholder="e.g. uni-sync"
          className={`${inputClass} font-mono`}
        />
      </label>
      <label className="flex items-center gap-2 text-small text-text-secondary">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active (visible on the public /services page)
      </label>

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
