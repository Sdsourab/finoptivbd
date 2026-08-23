import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SearchBox } from "@/components/SearchBox";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticles } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const [caseStudies, posts] = await Promise.all([
    getArticles({ content_type: "case_study" }).catch(() => []),
    getArticles({ content_type: "blog_post" }).catch(() => []),
  ]);

  const featured = caseStudies.slice(0, 3);
  const recent = posts.slice(0, 3);

  return (
    <>
      <Hero />

      <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6">
        <SearchBox />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-display-3 font-medium">Featured case studies</h2>
          <Link href="/work" className="text-small text-lime-accent hover:underline">
            View all work →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-body text-text-muted">No case studies published yet — check back soon.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-display-3 font-medium">Recent writing</h2>
          <Link href="/writing" className="text-small text-lime-accent hover:underline">
            View all writing →
          </Link>
        </div>
        {recent.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {recent.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-body text-text-muted">No posts yet — the first one&apos;s coming.</p>
        )}
      </section>
    </>
  );
}
