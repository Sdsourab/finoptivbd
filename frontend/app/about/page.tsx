"use client";

import dynamic from "next/dynamic";
import { PipelineStatusWidget } from "@/components/PipelineStatusWidget";

const RetroWindowFrame = dynamic(() =>
  import("@/components/retro/RetroWindowFrame").then((m) => m.RetroWindowFrame)
);
const RetroSidebar = dynamic(() => import("@/components/retro/RetroSidebar").then((m) => m.RetroSidebar));
const HalftoneChart = dynamic(() => import("@/components/retro/HalftoneChart").then((m) => m.HalftoneChart));

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <RetroWindowFrame title="~/about">
        <div className="flex flex-col gap-8 md:flex-row">
          <RetroSidebar />
          <div className="flex-1">
            <HalftoneChart />
            <h1 className="mt-6 font-display text-display-2 font-semibold">About</h1>
            <p className="mt-4 text-body leading-relaxed text-pure-white/85">
              Finoptiv is one person&apos;s applied-analytics practice: causal inference, bibliometric analysis,
              actuarial modeling, NLP topic modeling, and a live news-collection pipeline — real projects,
              documented the way they actually happened, not cleaned up for a highlight reel.
            </p>
            <p className="mt-4 text-body leading-relaxed text-pure-white/85">
              The bet behind this site is simple: showing the work — problem, data, method, result, and what
              it meant — says more than a list of skills ever could.
            </p>
          </div>
        </div>
      </RetroWindowFrame>

      <div className="mt-10">
        <h2 className="font-display text-display-4 font-medium">Live systems</h2>
        <p className="mt-2 text-small text-text-muted">
          Real status from data-collection pipelines behind the site&apos;s content — not a mockup.
        </p>
        <div className="mt-6">
          <PipelineStatusWidget />
        </div>
      </div>
    </div>
  );
}