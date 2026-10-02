import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/site/ContentPage";
import { contentRoutes, getContentPageCopy, getContentPagePath, type ContentSlug } from "@/lib/content-pages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";
import { getPageSeo } from "@/lib/seo/page-seo";

const category = "practice" as const;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "en")
    .flatMap((locale) => contentRoutes[category].map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale) || locale === "en" || !contentRoutes[category].includes(slug as never)) {
    return {};
  }

  const typedLocale = locale as Locale;
  const typedSlug = slug as ContentSlug;
  const dictionary = getDictionary(typedLocale);
  const copy = getContentPageCopy(dictionary, typedLocale, category, typedSlug);

  if (!copy) {
    return {};
  }

  const path = getContentPagePath(category, typedSlug);
  const seo = getPageSeo(path, typedLocale);
  return createLocalizedPageMetadata(typedLocale, path, seo?.title ?? copy.title, seo?.description ?? copy.lead);
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale) || locale === "en" || !contentRoutes[category].includes(slug as never)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const typedSlug = slug as ContentSlug;
  const dictionary = getDictionary(typedLocale);
  const copy = getContentPageCopy(dictionary, typedLocale, category, typedSlug);

  if (!copy) {
    notFound();
  }

  const path = getContentPagePath(category, typedSlug);
  return <ContentPage locale={typedLocale} currentPath={path} {...copy} />;
}
