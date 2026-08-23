import type { Config } from "tailwindcss";

// Every value here is transcribed from docs/01-DESIGN-SYSTEM.md — no
// component should ever hardcode a hex value outside this file.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-forest-green": "#062E27",
        "emerald-green": "#0B8E4C",
        "lime-accent": "#B7E000",
        "lime-accent-hover": "#D2FF2A",
        "pure-white": "#FFFFFF",
        "light-gray": "#F4F7F6",
        graphite: "#1E2525",

        "bg-main": "#041F1A",
        "bg-card": "#08362D",
        "bg-hover": "#0C4B3D",
        "bg-active": "#136F57",

        success: "#16C784",
        warning: "#FFC857",
        error: "#FF4D5A",
        info: "#3AA8FF",

        "text-primary": "#FFFFFF",
        "text-secondary": "#C9D6D3",
        "text-muted": "#8EA6A0",
      },
      backgroundImage: {
        // Hero backgrounds and signature moments only — never body-text sections.
        "brand-gradient": "linear-gradient(90deg, #062E27 0%, #0B8E4C 50%, #B7E000 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      // Desktop scale: 64/40/28/20/16/14/12px. Spec: mobile is the same
      // scale at ~80% for the TOP THREE sizes only (display-1/2/3) — done
      // here with clamp() so it's one fluid token instead of two classes.
      fontSize: {
        "display-1": ["clamp(2.75rem, 2rem + 3vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(1.85rem, 1.5rem + 1.5vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-3": ["clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)", { lineHeight: "1.2" }],
        "display-4": ["1.25rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      // Spacing scale 4/8/12/16/24/32/48/64/96px maps exactly onto
      // Tailwind's default keys 1/2/3/4/6/8/12/16/24 — use only those,
      // no arbitrary values.
      boxShadow: {
        signature: "0 20px 60px rgba(0,0,0,0.35)",
        glow: "0 0 30px rgba(183,224,0,0.28)",
      },
      backdropBlur: { glass: "20px" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
