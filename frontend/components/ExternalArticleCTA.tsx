import { ArrowUpRight } from "lucide-react";

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "the source";
  }
}

// the fist 
// more click, from a page that still has its own URL and OG preview.fibal sttsfg
export function ExternalArticleCTA({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-4 rounded-lg border border-lime-accent/40 bg-lime-accent/10 px-6 py-5 transition-colors hover:bg-lime-accent/15"
    >
      <span>
        <span className="block text-small text-text-muted">Full piece hosted at {hostnameOf(url)}</span>
        <span className="mt-1 block font-display text-display-4 font-medium text-lime-accent">
          Read the full article →
        </span>
      </span>
      <ArrowUpRight className="shrink-0 text-lime-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={28} aria-hidden />
    </a>
  );
}