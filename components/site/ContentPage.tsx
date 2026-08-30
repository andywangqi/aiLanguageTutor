import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { InfoSections } from "@/components/site/InfoSections";
import { getInfoCopy } from "@/lib/i18n/info-copy";
import type { Locale } from "@/lib/i18n/config";
import type { ContentPageCopy } from "@/lib/content-pages";

export function ContentPage({
  locale,
  eyebrow,
  title,
  lead,
  updated,
  sections,
  cards,
  callout
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  updated: string;
  sections: ContentPageCopy["sections"];
  cards?: ContentPageCopy["cards"];
  callout?: ContentPageCopy["callout"];
}) {
  const shell = getInfoCopy(locale);

  return (
    <InfoPage locale={locale} copy={shell} eyebrow={eyebrow} title={title} lead={lead} updated={updated}>
      {cards?.length ? (
        <section className="info-section">
          <div className="info-card-grid">
            {cards.map((card) => (
              <article className="info-card" key={`${card.title}-${card.body}`}>
                {card.label ? <p className="info-card-label">{card.label}</p> : null}
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                {card.href ? (
                  <Link className="info-card-link" href={card.href}>
                    {card.cta ?? "Open"}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <InfoSections sections={sections} />

      {callout ? (
        <section className="info-callout">
          <strong>{callout.title}</strong>
          <p>
            {callout.body}{" "}
            <Link href={callout.href}>{callout.cta}</Link>
          </p>
        </section>
      ) : null}


    </InfoPage>
  );
}



