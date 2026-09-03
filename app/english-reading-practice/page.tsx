import type { Metadata } from "next";
import { JsonLd } from "@/components/landing/JsonLd";
import { EnglishReadingPractice } from "@/components/site/EnglishReadingPractice";
import { siteUrl } from "@/lib/seo/metadata";

const title = "English Reading Practice with AI | AI Language Tutor";
const description = "Practice English reading with vocabulary, comprehension checks, study notes, and browser listening. Bring real material into your reading routine.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/english-reading-practice`, languages: { "x-default": `${siteUrl}/english-reading-practice`, en: `${siteUrl}/english-reading-practice` } },
  openGraph: { type: "website", url: `${siteUrl}/english-reading-practice`, title, description, siteName: "AI Language Tutor" },
  robots: { index: true, follow: true }
};

const readingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Language Tutor English Reading Practice",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: `${siteUrl}/english-reading-practice`,
  description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: ["English reading practice", "Vocabulary review", "Comprehension questions", "Study notes", "Text-to-speech reading"]
};

export default function Page() {
  return <><JsonLd data={readingSchema} /><EnglishReadingPractice /></>;
}
