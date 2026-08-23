import { PredictionLedgerCard } from "@/components/PredictionLedgerCard";
import { getPredictions } from "@/lib/api";

export const revalidate = 60;
export const metadata = { title: "Predictions" };

// Phase 3: public prediction ledger. Genuinely reads live data — no
// fabricated predictions ship with this build.
export default async function PredictionsPage() {
  const predictions = await getPredictions().catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-2 font-semibold">Predictions</h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        A public, timestamped ledger — a claim goes up before the outcome is known, and gets marked resolved
        against what actually happened. No editing a prediction after the fact.
      </p>

      {predictions.length > 0 ? (
        <div className="mt-10 space-y-4">
          {predictions.map((p) => (
            <PredictionLedgerCard key={p.id} prediction={p} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body text-text-muted">
          No predictions logged yet — the first one will appear here the moment it&apos;s made.
        </p>
      )}
    </div>
  );
}
