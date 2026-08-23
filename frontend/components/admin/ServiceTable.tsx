"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type { Service } from "@/lib/types";

export function ServiceTable() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listServices()
      .then(setServices)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load services."));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await adminApi.deleteService(id);
      setServices((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  if (error) return <p className="text-small text-error">{error}</p>;
  if (!services) return <p className="text-small text-text-muted">Loading…</p>;

  return (
    <div className="space-y-2">
      {services.length === 0 && <p className="text-small text-text-muted">No services yet.</p>}
      {services.map((s) => (
        <div key={s.id} className="flex items-center justify-between gap-4 rounded-md border border-white/8 bg-bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-body text-text-primary">{s.name}</p>
            <p className="text-caption text-text-muted">
              {s.active ? "Active" : "Inactive"} · {s.starting_price_usd != null ? `$${s.starting_price_usd}` : "no price set"}
            </p>
          </div>
          <div className="flex shrink-0 gap-3 text-small">
            <Link href={`/admin/services/${s.id}`} className="text-lime-accent hover:underline">Edit</Link>
            <button type="button" onClick={() => handleDelete(s.id)} className="text-error hover:underline">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
