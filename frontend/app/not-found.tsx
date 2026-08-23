"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const RetroWindowFrame = dynamic(() =>
  import("@/components/retro/RetroWindowFrame").then((m) => m.RetroWindowFrame)
);
const CompassIcon = dynamic(() => import("@/components/retro/icons").then((m) => m.CompassIcon));

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <RetroWindowFrame title="404">
        <div className="flex flex-col items-center py-12 text-center">
          <CompassIcon className="h-12 w-12 text-lime-accent" />
          <h1 className="mt-6 font-display text-display-3 font-semibold">This page didn&apos;t make it in.</h1>
          <p className="mt-3 max-w-sm text-body text-pure-white/80">
            The link might be old, or the page might not exist yet. Here&apos;s where to go instead:
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-md bg-lime-accent px-5 py-2.5 text-small font-semibold text-deep-forest-green">
              Home
            </Link>
            <Link href="/work" className="rounded-md border border-pure-white/20 px-5 py-2.5 text-small text-pure-white">
              Work
            </Link>
          </div>
        </div>
      </RetroWindowFrame>
    </div>
  );
}
