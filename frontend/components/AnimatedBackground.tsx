// Subtle animated SVG backdrop for the Hero. CSS-only (no JS animation
// loop, no canvas) to protect the performance budget — the global
// prefers-reduced-motion rule in globals.css already freezes all of this
// for anyone who's asked for reduced motion. Purely decorative: aria-hidden,
// sits behind real content, never the only carrier of information.
export function AnimatedBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow-lime" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B7E000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#B7E000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-emerald" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B8E4C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B8E4C" stopOpacity="0" />
        </radialGradient>
        <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#FFFFFF" />
        </pattern>
      </defs>

      <rect width="1200" height="600" fill="url(#dot-grid)" opacity="0.12" />

      <circle cx="220" cy="150" r="220" fill="url(#glow-emerald)" style={{ animation: "float-a 16s ease-in-out infinite" }} />
      <circle cx="980" cy="420" r="260" fill="url(#glow-lime)" style={{ animation: "float-b 20s ease-in-out infinite" }} />

      {/* data-flow lines, echoing the wordmark's connecting curve */}
      <path
        d="M -50 480 C 250 380, 450 520, 700 380 S 1150 300, 1260 340"
        fill="none"
        stroke="#B7E000"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        style={{ animation: "dash-flow 14s linear infinite" }}
      />
      <path
        d="M -50 120 C 300 220, 500 60, 760 160 S 1100 260, 1260 180"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.14"
        strokeWidth="1"
        strokeDasharray="4 12"
        style={{ animation: "dash-flow 20s linear infinite reverse" }}
      />

      <circle cx="700" cy="380" r="4" fill="#B7E000" style={{ animation: "dot-pulse 3.5s ease-in-out infinite" }} />
      <circle cx="450" cy="520" r="3" fill="#FFFFFF" style={{ animation: "dot-pulse 4.2s ease-in-out infinite 0.6s" }} />
      <circle cx="980" cy="220" r="3" fill="#B7E000" style={{ animation: "dot-pulse 3.8s ease-in-out infinite 1.1s" }} />
    </svg>
  );
}