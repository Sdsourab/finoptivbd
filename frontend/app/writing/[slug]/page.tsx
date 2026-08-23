import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { ContactSidebar } from "@/components/ContactSidebar";
import { RelatedContent } from "@/components/RelatedContent";
import { getArticle, getArticles, getRelatedArticles } from "@/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const articles = await getArticles({ content_type: "blog_post" });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await getArticle(params.slug);
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [`/api/og/${article.slug}`],
      },
    };
  } catch {
    return {};
  }
}

export default async function WritingPostPage({ params }: { params: { slug: string } }) {
  let article;
  try {
    article = await getArticle(params.slug);
  } catch {
    notFound();
  }
  if (!article || article.content_type !== "blog_post") notFound();

  const related = await getRelatedArticles(params.slug).catch(() => []);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-16">
        <BlogPostLayout article={article} />
        <RelatedContent articles={related} />
      </div>
      <div>
        <ContactSidebar pageTitle={article.title} />
      </div>
    </div>
  );
}
