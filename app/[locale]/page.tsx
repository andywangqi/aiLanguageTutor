import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/landing/HomePage";
import { JsonLd } from "@/components/landing/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { createFaqSchema, createPageMetadata, createSoftwareSchema } from "@/lib/seo/metadata";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return createPageMetadata(locale);
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale) || locale === "en") {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);

  return (
    <>
      <JsonLd data={createSoftwareSchema(typedLocale)} />
      <JsonLd data={createFaqSchema(typedLocale)} />
      <HomePage dictionary={dictionary} locale={typedLocale} />
    </>
  );
}
