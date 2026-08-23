import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/lib/types";

// Bottom-of-page module — the "no dead ends" rule. Computed at request/ISR
// time by the backend (GET /articles/{slug}/related), not stored.
export function RelatedContent({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="related-heading" className="border-t border-white/5 pt-10">
      <h2 id="related-heading" className="font-display text-display-4 font-medium">
        Related
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
