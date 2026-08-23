import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Article } from "@/lib/types";
import { ExternalArticleCTA } from "./ExternalArticleCTA";
import { formatDate } from "@/lib/utils";

export function BlogPostLayout({ article }: { article: Article }) {
  return (
    <article>
      <header>
        <p className="font-mono text-small uppercase tracking-wide text-lime-accent">Writing</p>
        <h1 className="mt-2 font-display text-display-2 font-semibold leading-tight">{article.title}</h1>
        <p className="mt-3 text-body text-text-secondary">{article.excerpt}</p>
        <p className="mt-2 text-caption text-text-muted">
          {formatDate(article.published_at)}
          {article.reading_time_minutes ? ` · ${article.reading_time_minutes} min read` : ""}
        </p>
      </header>

      {article.external_url ? (
        <div className="mt-8">
          <ExternalArticleCTA url={article.external_url} />
        </div>
      ) : (
        <div className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-lime-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-code:rounded prose-code:bg-bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-lime-accent prose-code:before:content-none prose-code:after:content-none prose-pre:bg-bg-card prose-pre:text-text-secondary prose-blockquote:border-lime-accent prose-blockquote:text-text-muted prose-li:text-text-secondary prose-hr:border-white/10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body_markdown || ""}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}