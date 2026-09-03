import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginPage } from "@/components/app/LoginPage";
import { HomePage } from "@/components/landing/HomePage";
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
    title: `${dictionary.product.auth.title} | AI Language Tutor`,
    description: dictionary.product.auth.lead,
    robots: { index: false, follow: false }
  };
}

export default async function LocaleLoginPage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);

  return (
    <>
      <HomePage dictionary={dictionary} locale={typedLocale} />
      <LoginPage dictionary={dictionary} locale={typedLocale} />
    </>
  );
}
