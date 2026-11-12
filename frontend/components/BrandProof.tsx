import { PROOF_WALL } from "@/lib/proofWall";
const WORDMARK = "https://raw.githubusercontent.com/Sdsourab/finoptivbd/main/docs/brand-assets/29406.png";
const BRAND_01 = "https://raw.githubusercontent.com/Sdsourab/finoptivbd/main/docs/brand-assets/29407.png";
const BRAND_02 = "https://raw.githubusercontent.com/Sdsourab/finoptivbd/main/docs/brand-assets/29408.png";
export function BrandProof() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="max-w-2xl"><p className="font-mono text-caption uppercase tracking-[0.18em] text-lime-accent">Visual proof</p><h2 className="mt-3 font-display text-display-2 font-semibold text-white">A brand built around analysis, dashboards, and real business communication.</h2><p className="mt-4 text-body text-text-secondary">The visual system is designed to make complex work feel structured, credible, and easy to understand.</p></div>
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.875fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-signature md:p-10"><img src={WORDMARK} alt="Finoptiv wordmark" width={2243} height={701} className="w-full object-contain" loading="lazy" /></div>
        <div className="grid grid-cols-2 gap-5">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg-card p-4"><img src={BRAND_01} alt="Finoptiv branded visual system sample" width={1536} height={1024} className="h-full w-full object-cover" loading="lazy" /></div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg-card p-4"><img src={BRAND_02} alt="Finoptiv branded visual system sample" width={1536} height={1024} className="h-full w-full object-cover" loading="lazy" /></div>
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-bg-card p-2 shadow-signature">
        <img src={`data:image/webp;base64,${PROOF_WALL}`} alt="Finoptiv analytics dashboards, charts, research visuals, and business communication examples" width={600} height={210} className="h-auto w-full rounded-xl object-cover" loading="lazy" />
      </div>
    </section>
  );
}
