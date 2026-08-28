import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/site/InfoPage";
import { getInfoCopy } from "@/lib/i18n/info-copy";
import { isLocale, locales, localizedPath, type Locale } from "@/lib/i18n/config";

type LocalePageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const copy = getInfoCopy(locale);
  return { title: `${copy.contact.title} | AI Language Tutor`, description: copy.contact.lead };
}

export default async function LocaleContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  const typedLocale = locale as Locale;
  const copy = getInfoCopy(typedLocale);

  return (
    <InfoPage locale={typedLocale} copy={copy} eyebrow={copy.contact.eyebrow} title={copy.contact.title} lead={copy.contact.lead} updated={copy.contact.updated}>
      <section className="info-section">
        <h2>{copy.contact.chooseTitle}</h2>
        <div className="info-card-grid">
          {copy.contact.cards.map((card) => (
            <article className="info-card" key={card.email}>
              <p className="info-card-label">{card.label}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <a className="info-card-link" href={`mailto:${card.email}`}>{card.email}</a>
            </article>
          ))}
        </div>
      </section>
      <section className="info-section">
        <h2>{copy.contact.supportTitle}</h2>
        <p>{copy.contact.supportLead}</p>
        <ul className="info-list">{copy.contact.supportBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
      </section>
      <section className="info-callout">
        <strong>{copy.contact.calloutTitle}</strong>
        <p>{copy.contact.calloutBody}</p>
      </section>
      <p className="info-inline-note">
        {copy.contact.privacyNote} <Link href={localizedPath(typedLocale, "/privacy")}>{copy.contact.privacyLink}</Link>
      </p>
    </InfoPage>
  );
}
