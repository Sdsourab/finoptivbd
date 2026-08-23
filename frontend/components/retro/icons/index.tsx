interface IconProps {
  className?: string;
}

// Internally consistent set: 1.5px stroke, rounded caps/joins, 24x24 grid —
// per docs/01-DESIGN-SYSTEM.md's icon-consistency rule.
const shared = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...shared} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3" />
      <path d="M13 15h4" />
    </svg>
  );
}

export function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...shared} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5l-2 5-5 2 2-5z" />
    </svg>
  );
}

export function SignalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...shared} aria-hidden="true">
      <path d="M5 19v-4M10 19v-8M15 19V7M20 19V4" />
    </svg>
  );
}
