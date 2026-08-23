import { ExternalLink } from "lucide-react";
import type { Article } from "@/lib/types";

// Phase 2. Renders nothing if no colab_url is set — never a dead/fake link.
export function RunItYourselfButton({ article }: { article: Article }) {
  if (!article.colab_url) return null;

  return (
    <a
      href={article.colab_url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-lime-accent/40 px-4 py-2 text-small font-medium text-lime-accent transition-colors hover:bg-lime-accent/10"
    >
      Run it yourself <ExternalLink size={14} aria-hidden />
    </a>
  );
}
