import { MethodologyFilter } from "@/components/MethodologyFilter";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticles, getCategories, getMethodologies } from "@/lib/api";

export const revalidate = 60;
export const metadata = { title: "Work" };

export default async function WorkPage({
  searchParams,
}: {
  searchParams: { methodology?: string; category?: string };
}) {
  const [articles, methodologies, categories] = await Promise.all([
    getArticles({
      content_type: "case_study",
      methodology: searchParams.methodology,
      category: searchParams.category,
    }).catch(() => []),
    getMethodologies().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="font-display text-display-2 font-semibold">Work</h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Structured case studies — problem, data, method, result, and what it meant for the business.
      </p>

      <div className="mt-8 space-y-4">
        <MethodologyFilter options={methodologies} paramName="methodology" label="Filter by method" />
        <MethodologyFilter options={categories} paramName="category" label="Filter by category" />
      </div>

      {articles.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body text-text-muted">
          No case studies match that filter yet — try &quot;All&quot;, or check back soon.
        </p>
      )}
    </div>
  );
}
