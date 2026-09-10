import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/site/BlogPage";
import { getPublicBlogPost } from "@/lib/blog";
import { getContentPageCopy, getContentPagePath } from "@/lib/content-pages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; postSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, postSlug } = await params;
  if (!isLocale(locale) || locale === "en") return {};

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const copy = getContentPageCopy(dictionary, typedLocale, "learn", "blog");
  const result = await getPublicBlogPost(postSlug, typedLocale);
  const post = result?.post;
  if (!copy || !post) return {};

  return createLocalizedPageMetadata(
    typedLocale,
    `${getContentPagePath("learn", "blog")}/${postSlug}`,
    post.seo?.title || post.title,
    post.seo?.description || post.excerpt || copy.lead
  );
}

export default async function Page({ params }: PageProps) {
  const { locale, postSlug } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const copy = getContentPageCopy(dictionary, typedLocale, "learn", "blog");
  const result = await getPublicBlogPost(postSlug, typedLocale);
  if (!copy || !result?.post) notFound();

  return <BlogArticlePage locale={typedLocale} copy={copy} post={result.post} />;
}
