"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getPredictions } from "@/lib/api";
import type { Prediction } from "@/lib/types";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = `${API_ORIGIN}/api/backend`;

async function authedPost(path: string, body: unknown) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(`${API_BASE}${path}`, {
    method: path.includes("resolve") ? "PUT" : "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const b = await res.json().catch(() => ({}) as { detail?: string });
    throw new Error(b.detail || "Request failed.");
  }
  return res.json();
}

export function PredictionAdmin() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [claim, setClaim] = useState("");
  const [predictedValue, setPredictedValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    getPredictions().then(setPredictions).catch(() => setPredictions([]));
  }

  useEffect(refresh, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await authedPost("/admin/predictions", { claim, predicted_value: predictedValue });
      setClaim("");
      setPredictedValue("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleResolve(id: string) {
    const actual = prompt("Actual outcome?");
    if (actual === null) return;
    const errorPctStr = prompt("Error % (optional, leave blank to skip)") || "";
    try {
      await authedPost(`/admin/predictions/${id}/resolve`, {
        actual_value: actual,
        error_pct: errorPctStr.trim() ? Number(errorPctStr) : null,
      });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to resolve.");
    }
  }

  const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-bg-card px-3 py-2 text-body text-text-primary";

  return (
    <div className="space-y-10">
      <form onSubmit={handleCreate} className="max-w-xl space-y-4">
        <h2 className="font-display text-display-4 font-medium">Log a new prediction</h2>
        <label className="block text-small text-text-secondary">
          Claim
          <input value={claim} onChange={(e) => setClaim(e.target.value)} required className={inputClass} />
        </label>
        <label className="block text-small text-text-secondary">
          Predicted value
          <input value={predictedValue} onChange={(e) => setPredictedValue(e.target.value)} required className={inputClass} />
        </label>
        {error && <p className="text-small text-error">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-lime-accent px-5 py-2.5 text-small font-semibold text-deep-forest-green disabled:opacity-60"
        >
          {saving ? "Saving…" : "Log prediction"}
        </button>
      </form>

      <div>
        <h2 className="font-display text-display-4 font-medium">All predictions</h2>
        <div className="mt-4 space-y-2">
          {predictions.length === 0 && <p className="text-small text-text-muted">None logged yet.</p>}
          {predictions.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 rounded-md border border-white/8 bg-bg-card px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-small text-text-primary">{p.claim}</p>
                <p className="text-caption text-text-muted">
                  Predicted {p.predicted_value} {p.resolved_at ? `· Actual ${p.actual_value}` : "· Open"}
                </p>
              </div>
              {!p.resolved_at && (
                <button type="button" onClick={() => handleResolve(p.id)} className="shrink-0 text-small text-lime-accent hover:underline">
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
