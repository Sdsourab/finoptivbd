// "Channels" renamed to the owner's real methodology tags (docs/01-DESIGN-SYSTEM.md).
const CHANNELS = [
  "Causal Inference",
  "NLP / Topic Modeling",
  "Bibliometric Analysis",
  "Actuarial Modeling",
  "Data Engineering",
];

export function RetroSidebar() {
  return (
    <nav aria-label="Methodology channels" className="w-full shrink-0 border-b-2 border-pure-white/10 pb-4 md:w-44 md:border-b-0 md:border-r-2 md:pb-0 md:pr-4">
      <ul className="space-y-3 font-mono text-caption text-pure-white/70">
        {CHANNELS.map((c) => (
          <li key={c} className="truncate">
            # {c}
          </li>
        ))}
      </ul>
    </nav>
  );
}
