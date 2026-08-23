import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants";
import { AnimatedBackground } from "./AnimatedBackground";

// Uses the primary gradient once — signature moment, not a default background.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient">
      <AnimatedBackground />
      <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32">
        <p className="font-mono text-small uppercase tracking-widest text-white/80">{SITE_TAGLINE}</p>
        <h1 className="mt-4 max-w-2xl font-display text-display-1 font-semibold leading-[1.05] text-white">
          Real analytical work, engineered to be checked, not just believed.
        </h1>
        <p className="mt-6 max-w-xl text-body text-white/85">{SITE_DESCRIPTION}</p>
      </div>
    </section>
  );
}