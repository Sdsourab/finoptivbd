import type { ArticleStat } from "@/lib/types";

// Monospace, tabular figures — this is the face that makes the
// "analyst terminal" narrative real (docs/01-DESIGN-SYSTEM.md).
export function StatStrip({ stats }: { stats: ArticleStat[] }) {
  if (!stats.length) return null;

  return (
    <dl className="grid grid-cols-2 gap-4 border-y border-white/5 py-6 sm:grid-cols-3">
      {stats
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((stat) => (
          <div key={stat.id}>
            <dd className="font-mono text-display-3 font-medium tabular-nums text-lime-accent">{stat.value}</dd>
            <dt className="mt-1 text-small text-text-muted">{stat.label}</dt>
          </div>
        ))}
    </dl>
  );
}
