import { ArticleCard } from "@/components/ArticleCard";
import { getArticles } from "@/lib/api";

export const revalidate = 60;
export const metadata = { title: "Writing" };

export default async function WritingPage() {
  const articles = await getArticles({ content_type: "blog_post" }).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-2 font-semibold">Writing</h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Commentary, build notes, and method explainers — less structured than the case studies, still grounded
        in the same work.
      </p>

      {articles.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body text-text-muted">No posts yet — the first one&apos;s coming.</p>
      )}
    </div>
  );
}
