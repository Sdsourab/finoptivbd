const BAR_HEIGHTS = [28, 52, 38, 74, 58];

// The signature element: a halftone-textured chart, used once on the About
// hero. Replaces the reference's photographic halftone with a chart in
// #B7E000 / #0B8E4C, per docs/01-DESIGN-SYSTEM.md.
export function HalftoneChart() {
  return (
    <svg viewBox="0 0 220 100" className="h-32 w-full max-w-xs" role="img" aria-label="Decorative halftone-textured bar chart">
      <defs>
        <pattern id="halftone-lime" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="#B7E000" />
        </pattern>
        <pattern id="halftone-emerald" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="#0B8E4C" />
        </pattern>
      </defs>
      {BAR_HEIGHTS.map((h, i) => (
        <rect
          key={i}
          x={i * 42 + 12}
          y={100 - h}
          width="26"
          height={h}
          rx="3"
          fill={i % 2 === 0 ? "url(#halftone-lime)" : "url(#halftone-emerald)"}
        />
      ))}
    </svg>
  );
}
