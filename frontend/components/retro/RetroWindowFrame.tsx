interface RetroWindowFrameProps {
  title: string;
  children: React.ReactNode;
}

// Illustrated style: inverted to light-on-dark per docs/01-DESIGN-SYSTEM.md
// — chrome surface in light-gray, canvas in deep-forest-green with white/lime
// line art. Classic three-dot window chrome, recolored into brand palette.
export function RetroWindowFrame({ title, children }: RetroWindowFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-graphite/10 bg-light-gray shadow-signature">
      <div className="flex items-center gap-2 border-b-2 border-graphite/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-error" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-warning" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-success" aria-hidden="true" />
        <span className="ml-2 font-mono text-caption text-graphite/60">{title}</span>
      </div>
      <div className="bg-deep-forest-green p-6 text-pure-white md:p-10">{children}</div>
    </div>
  );
}
