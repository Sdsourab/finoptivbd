import type { Prediction } from "@/lib/types";
import { formatDate } from "@/lib/utils";

// Phase 3. One row of the public prediction ledger.
export function PredictionLedgerCard({ prediction }: { prediction: Prediction }) {
  const resolved = Boolean(prediction.resolved_at);

  return (
    <div className="rounded-lg border border-white/8 bg-bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-body text-text-primary">{prediction.claim}</p>
        <span
          className={`shrink-0 rounded-full px-3 py-1 font-mono text-caption uppercase ${
            resolved ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
          }`}
        >
          {resolved ? "Resolved" : "Open"}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 font-mono text-small sm:grid-cols-4">
        <div>
          <dt className="text-caption text-text-muted">Predicted</dt>
          <dd className="tabular-nums text-text-secondary">{prediction.predicted_value}</dd>
        </div>
        <div>
          <dt className="text-caption text-text-muted">On</dt>
          <dd className="text-text-secondary">{formatDate(prediction.predicted_at)}</dd>
        </div>
        {resolved && (
          <>
            <div>
              <dt className="text-caption text-text-muted">Actual</dt>
              <dd className="tabular-nums text-text-secondary">{prediction.actual_value}</dd>
            </div>
            {prediction.error_pct !== null && (
              <div>
                <dt className="text-caption text-text-muted">Error</dt>
                <dd className="tabular-nums text-text-secondary">{prediction.error_pct}%</dd>
              </div>
            )}
          </>
        )}
      </dl>
    </div>
  );
}
