import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/site/ContentPage";
import { contentRoutes, getContentPageCopy, getContentPagePath, type ContentSlug } from "@/lib/content-pages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

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

  return createLocalizedPageMetadata(typedLocale, getContentPagePath(category, typedSlug), copy.title, copy.lead);
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

  return <ContentPage locale={typedLocale} {...copy} />;
}
