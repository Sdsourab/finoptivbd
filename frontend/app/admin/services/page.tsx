"use client";

import Link from "next/link";
import { useRequireAdmin } from "@/lib/useRequireAdmin";
import { ServiceTable } from "@/components/admin/ServiceTable";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  const { checked, session } = useRequireAdmin();
  if (!checked || !session) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-3 font-semibold">Services</h1>
        <div className="flex items-center gap-4 text-small">
          <Link href="/admin/services/new" className="rounded-md bg-lime-accent px-4 py-2 font-semibold text-deep-forest-green">
            New service
          </Link>
          <Link href="/admin" className="text-text-muted hover:text-text-primary">Back to admin</Link>
        </div>
      </div>
      <div className="mt-8">
        <ServiceTable />
      </div>
    </div>
  );
}
