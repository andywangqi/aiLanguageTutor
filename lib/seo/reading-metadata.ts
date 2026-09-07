import type { Metadata } from "next";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { readingCopy } from "@/lib/i18n/reading-copy";
import { createLocalizedPageMetadata, siteUrl } from "@/lib/seo/metadata";

const readingPath = "/english-reading-practice";

export function createReadingPageMetadata(locale: Locale): Metadata {
  const copy = readingCopy[locale];
  return createLocalizedPageMetadata(locale, readingPath, copy.metadata.title, copy.metadata.description);
}

export function createReadingSchema(locale: Locale) {
  const copy = readingCopy[locale];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Language Tutor English Reading Practice",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: `${siteUrl}${localizedPath(locale, readingPath)}`,
    description: copy.metadata.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["English reading practice", "Vocabulary review", "Comprehension questions", "Study notes", "Text-to-speech reading"]
  };
}
