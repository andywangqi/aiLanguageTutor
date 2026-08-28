import type { InfoSectionCopy } from "@/lib/i18n/info-types";

export function InfoSections({ sections }: { sections: InfoSectionCopy[] }) {
  return (
    <>
      {sections.map((section) => (
        <section className="info-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph, index) => <p key={`${section.title}-paragraph-${index}`}>{paragraph}</p>)}
          {section.bullets ? (
            <ul className="info-list">
              {section.bullets.map((bullet, index) => <li key={`${section.title}-bullet-${index}`}>{bullet}</li>)}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  );
}
