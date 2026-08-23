import { Check, X } from "lucide-react";
import type { Article } from "@/lib/types";

const CHECKS: { key: keyof Article; label: string }[] = [
  { key: "dataset_available", label: "Dataset available" },
  { key: "notebook_available", label: "Notebook available" },
  { key: "deterministic", label: "Deterministic (same input -> same output)" },
];

// Phase 2. Always renders — an honest "not yet" is more trustworthy on a
// site built around real, checkable work than hiding the checklist until
// every box is true.
export function ReproducibilityBadge({ article }: { article: Article }) {
  return (
    <div className="rounded-lg border border-white/8 bg-bg-card p-5">
      <p className="font-mono text-caption uppercase tracking-wide text-text-muted">Reproducibility</p>
      <ul className="mt-3 space-y-2">
        {CHECKS.map(({ key, label }) => {
          const ok = Boolean(article[key]);
          return (
            <li key={key} className="flex items-center gap-2 text-small">
              {ok ? (
                <Check size={16} className="shrink-0 text-success" aria-hidden />
              ) : (
                <X size={16} className="shrink-0 text-text-muted" aria-hidden />
              )}
              <span className={ok ? "text-text-secondary" : "text-text-muted"}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
