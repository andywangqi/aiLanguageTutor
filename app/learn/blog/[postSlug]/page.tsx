import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/site/BlogPage";
import { getPublicBlogPost } from "@/lib/blog";
import { getContentPageCopy } from "@/lib/content-pages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createBlogPostMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ postSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const dictionary = getDictionary("en");
  const copy = getContentPageCopy(dictionary, "en", "learn", "blog");
  const result = await getPublicBlogPost(postSlug, "en");
  const post = result?.post;
  if (!copy || !post) return {};

  return createBlogPostMetadata("en", postSlug, post);
}

export default async function Page({ params }: PageProps) {
  const { postSlug } = await params;
  const dictionary = getDictionary("en");
  const copy = getContentPageCopy(dictionary, "en", "learn", "blog");
  const result = await getPublicBlogPost(postSlug, "en");
  if (!copy || !result?.post) notFound();

  return <BlogArticlePage locale="en" copy={copy} post={result.post} />;
}
