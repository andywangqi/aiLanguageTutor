import type { Metadata } from "next";
import { localeLabels, localizedPath, localeUrl, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const defaultSiteUrl = "https://ailanguagetutor.online";

function resolveSiteUrl(value: string | undefined) {
  const candidate = value?.trim();

  if (!candidate) {
    return defaultSiteUrl;
  }

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return defaultSiteUrl;
    }

    return candidate.replace(/\/+$/, "");
  } catch {
    return defaultSiteUrl;
  }
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  ja: "ja_JP",
  th: "th_TH",
  ko: "ko_KR",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  es: "es_ES"
};
const localeKeywords: Record<Locale, string[]> = {
  en: ["AI language tutor", "English speaking practice", "AI conversation practice", "pronunciation practice"],
  ja: ["AI英会話", "英会話練習", "英語スピーキング練習", "発音練習"],
  th: ["ฝึกพูดภาษาอังกฤษ", "ฝึกสนทนาภาษาอังกฤษ", "ติวเตอร์ภาษา AI", "ฝึกออกเสียงภาษาอังกฤษ"],
  ko: ["AI 영어 회화", "영어 회화 연습", "영어 말하기 연습", "영어 발음 연습"],
  "zh-CN": ["AI英语口语练习", "AI英语陪练", "英语对话练习", "英语发音纠正"],
  "zh-TW": ["AI英語口說練習", "AI英語陪練", "英語會話練習", "英語發音練習"],
  es: ["practicar inglés", "conversación en inglés", "práctica de speaking", "pronunciación en inglés"]
};

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
    keywords: localeKeywords[locale],
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
      locale: openGraphLocale[locale]
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


export function createLocalizedPageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const canonicalPath = localizedPath(locale, path);
  const canonical = `${siteUrl}${canonicalPath}`;
  const languages = Object.fromEntries(
    locales.map((item) => [localeLabels[item].hreflang, `${siteUrl}${localizedPath(item, path)}`])
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: localeKeywords[locale],
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": `${siteUrl}${path}`
      }
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "AI Language Tutor",
      locale: openGraphLocale[locale]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
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

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Language Tutor",
    url: siteUrl,
    logo: `${siteUrl}/arno.svg`,
    email: "scottthornton815@gmail.com"
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Language Tutor",
    url: siteUrl,
    inLanguage: locales.map((locale) => localeLabels[locale].hreflang)
  };
}
