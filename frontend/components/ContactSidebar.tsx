import { HireMeButton } from "./HireMeButton";
import { WHAT_I_TAKE_ON } from "@/lib/constants";

// Sticky within the content column on desktop; collapses to a plain block
// above the footer on mobile (the persistent bottom bar already covers the
// "always reachable" job there). No glass/glow — reads as trustworthy and
// calm, not decorative.
export function ContactSidebar({ pageTitle }: { pageTitle: string }) {
  return (
    <aside className="rounded-lg border border-white/8 bg-bg-card p-6 lg:sticky lg:top-24">
      <p className="text-small text-text-secondary">Finoptiv — data &amp; analytics</p>
      <div className="mt-4">
        <HireMeButton pageTitle={pageTitle} fullWidth />
      </div>
      <p className="mt-4 text-small leading-relaxed text-text-muted">{WHAT_I_TAKE_ON}</p>
    </aside>
  );
}
