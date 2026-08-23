import type { Article } from "@/lib/types";
import { StatStrip } from "./StatStrip";
import { ReproducibilityBadge } from "./ReproducibilityBadge";
import { RunItYourselfButton } from "./RunItYourselfButton";
import { DownloadRequestButton } from "./DownloadRequestButton";
import { ExternalArticleCTA } from "./ExternalArticleCTA";
import { formatDate } from "@/lib/utils";

const SECTIONS: { key: keyof Article; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "data_description", label: "Data" },
  { key: "method", label: "Method" },
  { key: "result", label: "Result" },
  { key: "business_implication", label: "Business Implication" },
];

export function CaseStudyLayout({ article }: { article: Article }) {
  return (
    <article>
      <header>
        <p className="font-mono text-small uppercase tracking-wide text-lime-accent">Case Study</p>
        <h1 className="mt-2 font-display text-display-2 font-semibold leading-tight">{article.title}</h1>
        <p className="mt-3 text-body text-text-secondary">{article.excerpt}</p>
        <p className="mt-2 text-caption text-text-muted">{formatDate(article.published_at)}</p>
      </header>

      {article.external_url && (
        <div className="mt-8">
          <ExternalArticleCTA url={article.external_url} />
        </div>
      )}

      {article.stats.length > 0 && (
        <div className="mt-8">
          <StatStrip stats={article.stats} />
        </div>
      )}

      <div className="mt-10 space-y-10">
        {SECTIONS.map(({ key, label }) => {
          const value = article[key];
          if (!value || typeof value !== "string") return null;
          return (
            <section key={key}>
              <h2 className="font-display text-display-4 font-medium text-lime-accent">{label}</h2>
              <p className="mt-3 whitespace-pre-line text-body leading-relaxed text-text-secondary">{value}</p>
            </section>
          );
        })}
      </div>

      {!article.external_url && (
        <>
          <div className="mt-10">
            <ReproducibilityBadge article={article} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <RunItYourselfButton article={article} />
            <DownloadRequestButton article={article} />
          </div>
        </>
      )}
    </article>
  );
}