import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/site/ContentPage";
import { BlogPage } from "@/components/site/BlogPage";
import { contentRoutes, getContentPageCopy, getContentPagePath, type ContentSlug } from "@/lib/content-pages";
import { getPublicBlogPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";
import { getPageSeo } from "@/lib/seo/page-seo";

const category = "learn" as const;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return contentRoutes[category].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!contentRoutes[category].includes(slug as never)) {
    return {};
  }

  const typedSlug = slug as ContentSlug;
  const dictionary = getDictionary("en");
  const copy = getContentPageCopy(dictionary, "en", category, typedSlug);

  if (!copy) {
    return {};
  }

  const path = getContentPagePath(category, typedSlug);
  const seo = getPageSeo(path, "en");
  return createLocalizedPageMetadata("en", path, seo?.title ?? copy.title, seo?.description ?? copy.lead);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!contentRoutes[category].includes(slug as never)) {
    notFound();
  }

  const typedSlug = slug as ContentSlug;
  const dictionary = getDictionary("en");
  const copy = getContentPageCopy(dictionary, "en", category, typedSlug);

  if (!copy) {
    notFound();
  }

  const path = getContentPagePath(category, typedSlug);

  if (typedSlug === "blog") {
    const blog = await getPublicBlogPosts("en");
    if (blog) return <BlogPage locale="en" copy={copy} data={blog} />;
  }

  return <ContentPage locale="en" currentPath={path} {...copy} />;
}
