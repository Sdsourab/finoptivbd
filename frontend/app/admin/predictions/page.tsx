"use client";

import Link from "next/link";
import { useRequireAdmin } from "@/lib/useRequireAdmin";
import { PredictionAdmin } from "@/components/admin/PredictionAdmin";

export const dynamic = "force-dynamic";

export default function AdminPredictionsPage() {
  const { checked, session } = useRequireAdmin();
  if (!checked || !session) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-3 font-semibold">Predictions</h1>
        <Link href="/admin" className="text-small text-text-muted hover:text-text-primary">Back to admin</Link>
      </div>
      <div className="mt-8">
        <PredictionAdmin />
      </div>
    </div>
  );
}
