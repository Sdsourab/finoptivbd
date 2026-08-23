// Deliberately NOT the illustrated bundle — loading states fire on every
// slow connection, so this stays in the lightweight core bundle.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="h-8 w-48 animate-pulse rounded bg-bg-card" />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-bg-card" />
        ))}
      </div>
    </div>
  );
}
