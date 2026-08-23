"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { useRequireAdmin } from "@/lib/useRequireAdmin";
import { ServiceForm } from "@/components/admin/ServiceForm";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function EditServicePage() {
  const { checked, session } = useRequireAdmin();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !session) return;
    adminApi
      .listServices()
      .then((all) => {
        const found = all.find((s) => s.id === params.id);
        if (!found) throw new Error("Service not found.");
        setService(found);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load service."))
      .finally(() => setLoading(false));
  }, [isNew, params.id, session]);

  if (!checked || !session) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-3 font-semibold">{isNew ? "New service" : "Edit service"}</h1>
      <div className="mt-8">
        {loading && <p className="text-small text-text-muted">Loading…</p>}
        {error && <p className="text-small text-error">{error}</p>}
        {!loading && !error && <ServiceForm initial={service ?? undefined} />}
      </div>
    </div>
  );
}
