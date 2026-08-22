import type { Metadata } from "next";
import { localeLabels, localeUrl, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ailanguagetutor.com";

export function createPageMetadata(locale: Locale): Metadata {
  const dictionary = getDictionary(locale);
  const canonical = localeUrl(siteUrl, locale);
  const languages = Object.fromEntries(
    locales.map((item) => [localeLabels[item].hreflang, localeUrl(siteUrl, item)])
  );

  return {
    metadataBase: new URL(siteUrl),
    title: dictionary.seo.title,
    description: dictionary.seo.description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": localeUrl(siteUrl, "en")
      }
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: dictionary.seo.title,
      description: dictionary.seo.description,
      siteName: "AI Language Tutor",
      locale
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.seo.title,
      description: dictionary.seo.description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}

export function createFaqSchema(locale: Locale) {
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dictionary.sections.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function createSoftwareSchema(locale: Locale) {
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Language Tutor",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: localeUrl(siteUrl, locale),
    description: dictionary.seo.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}
