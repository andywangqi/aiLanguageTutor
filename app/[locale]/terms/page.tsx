import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/site/InfoPage";
import { InfoSections } from "@/components/site/InfoSections";
import { getInfoCopy } from "@/lib/i18n/info-copy";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

type LocalePageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const copy = getInfoCopy(locale);
  return createLocalizedPageMetadata(locale, "/terms", `${copy.terms.title} | AI Language Tutor`, copy.terms.lead);
}

export default async function LocaleTermsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  const typedLocale = locale as Locale;
  const copy = getInfoCopy(typedLocale);
  return (
    <InfoPage locale={typedLocale} copy={copy} eyebrow={copy.terms.eyebrow} title={copy.terms.title} lead={copy.terms.lead} updated={copy.terms.updated}>
      <InfoSections sections={copy.terms.sections} />
    </InfoPage>
  );
}
