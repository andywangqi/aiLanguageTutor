import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingPage } from "@/components/app/PricingPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return createLocalizedPageMetadata(locale, "/pricing", `${dictionary.product.pricing.title} | AI Language Tutor`, dictionary.product.pricing.lead);
}

export default async function LocalePricingPage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  const typedLocale = locale as Locale;
  return <PricingPage dictionary={getDictionary(typedLocale)} locale={typedLocale} />;
}
