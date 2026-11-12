import Link from "next/link";
import { HireMeButton } from "./HireMeButton";
import { AnimatedBackground } from "./AnimatedBackground";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants";
const HERO_IMAGE = "https://raw.githubusercontent.com/Sdsourab/finoptivbd/main/docs/brand-assets/29409.png";
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-bg-main">
      <div className="absolute inset-0">
        <img src={HERO_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover object-center opacity-30" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/95 to-bg-main/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-main/15 to-bg-main" />
      </div>
      <AnimatedBackground />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <div>
          <div className="inline-flex items-center rounded-full border border-lime-accent/30 bg-lime-accent/10 px-3 py-1.5 font-mono text-caption uppercase tracking-[0.16em] text-lime-accent">Finoptiv • {SITE_TAGLINE}</div>
          <h1 className="mt-6 max-w-3xl font-display text-display-1 font-semibold leading-[1.02] text-white">Turn business data into <span className="text-lime-accent">better decisions.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">{SITE_DESCRIPTION}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <HireMeButton pageTitle="Homepage" />
            <Link href="/work" className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-small font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10">View case studies</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-caption uppercase tracking-wide text-white/55">
            <span>SQL</span><span>Python</span><span>Business Analysis</span><span>BI</span><span>Forecasting</span><span>AI</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-3xl bg-lime-accent/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-bg-card/80 shadow-signature backdrop-blur-sm">
            <img src={HERO_IMAGE} alt="Finoptiv analytics workspace" width={1942} height={809} className="h-auto w-full object-cover" loading="eager" decoding="async" />
            <div className="grid grid-cols-3 border-t border-white/10 bg-bg-main/90">
              <div className="p-4"><div className="font-mono text-caption uppercase tracking-wide text-text-muted">Focus</div><div className="mt-1 text-small font-semibold text-white">Business Insight</div></div>
              <div className="border-l border-white/10 p-4"><div className="font-mono text-caption uppercase tracking-wide text-text-muted">Output</div><div className="mt-1 text-small font-semibold text-white">Decision-ready</div></div>
              <div className="border-l border-white/10 p-4"><div className="font-mono text-caption uppercase tracking-wide text-text-muted">Approach</div><div className="mt-1 text-small font-semibold text-white">Evidence-led</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
