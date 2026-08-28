import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkbenchPage } from "@/components/app/WorkbenchPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

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
  return {
    title: `${dictionary.product.workbench.title} | AI Language Tutor`,
    description: dictionary.product.workbench.subtitle,
    robots: { index: false, follow: false }
  };
}

export default async function LocaleWorkbenchPage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  const typedLocale = locale as Locale;
  return <WorkbenchPage dictionary={getDictionary(typedLocale)} locale={typedLocale} />;
}
