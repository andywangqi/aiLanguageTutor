import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/landing/JsonLd";
import { EnglishReadingPractice } from "@/components/site/EnglishReadingPractice";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { createReadingPageMetadata, createReadingSchema } from "@/lib/seo/reading-metadata";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale) || locale === "en") {
    return {};
  }

  return createReadingPageMetadata(locale);
}

export default async function LocaleReadingPracticePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale) || locale === "en") {
    notFound();
  }

  const typedLocale = locale as Locale;

  return (
    <>
      <JsonLd data={createReadingSchema(typedLocale)} />
      <EnglishReadingPractice locale={typedLocale} />
    </>
  );
}
