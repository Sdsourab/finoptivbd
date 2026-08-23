"use client";

import { useEffect, useState } from "react";
import { getPipelineStatus } from "@/lib/api";
import type { PipelineRun } from "@/lib/types";

const STATUS_COLOR: Record<PipelineRun["status"], string> = {
  ok: "text-success",
  running: "text-info",
  error: "text-error",
};

// Phase 2. Genuinely live — reads GET /pipeline-status, no fabricated runs.
// Empty state is honest rather than invented: nothing shows until a real
// pipeline actually posts to POST /admin/pipeline-runs.
export function PipelineStatusWidget() {
  const [runs, setRuns] = useState<PipelineRun[] | null>(null);

  useEffect(() => {
    getPipelineStatus()
      .then(setRuns)
      .catch(() => setRuns([]));
  }, []);

  if (runs === null) {
    return <div className="h-24 animate-pulse rounded-lg bg-bg-card" />;
  }

  if (runs.length === 0) {
    return (
      <div className="rounded-lg border border-white/8 bg-bg-card p-5 text-small text-text-muted">
        No pipeline runs logged yet — this fills in automatically once a pipeline starts posting to the API.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <div key={run.id} className="flex items-center justify-between rounded-lg border border-white/8 bg-bg-card p-4">
          <div>
            <p className="font-mono text-small text-text-primary">{run.pipeline_name}</p>
            <p className="text-caption text-text-muted">
              Last run {new Date(run.last_run_at).toLocaleString()} · {run.items_collected} items
            </p>
          </div>
          <span className={`font-mono text-caption uppercase ${STATUS_COLOR[run.status]}`}>{run.status}</span>
        </div>
      ))}
    </div>
  );
}
