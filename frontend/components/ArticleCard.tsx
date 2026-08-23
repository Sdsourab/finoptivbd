import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: Article }) {
  const href = `/${article.content_type === "case_study" ? "work" : "writing"}/${article.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-white/8 bg-bg-card transition-colors hover:bg-bg-hover"
    >
      {article.external_url && (
        <span
          title="Full piece hosted elsewhere"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-bg-main/80 text-lime-accent backdrop-blur-glass"
        >
          <ExternalLink size={14} aria-hidden />
          <span className="sr-only">Links to an external site</span>
        </span>
      )}
      {article.cover_image_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-main">
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="font-mono text-caption uppercase tracking-wide text-text-muted">
          {article.content_type === "case_study" ? "Case Study" : "Writing"}
          {article.reading_time_minutes ? ` · ${article.reading_time_minutes} min read` : ""}
        </span>
        <h3 className="font-display text-display-4 font-medium leading-snug text-text-primary group-hover:text-lime-accent">
          {article.title}
        </h3>
        <p className="text-small text-text-secondary">{article.excerpt}</p>
        <span className="mt-auto pt-2 text-caption text-text-muted">{formatDate(article.published_at)}</span>
      </div>
    </Link>
  );
}