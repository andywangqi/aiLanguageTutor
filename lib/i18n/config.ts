export const defaultLocale = "en";

export const locales = ["en", "ja", "th", "ko", "zh-CN", "zh-TW", "es"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, { label: string; nativeName: string; hreflang: string }> = {
  en: { label: "English", nativeName: "English", hreflang: "en" },
  ja: { label: "Japanese", nativeName: "日本語", hreflang: "ja" },
  th: { label: "Thai", nativeName: "ไทย", hreflang: "th" },
  ko: { label: "Korean", nativeName: "한국어", hreflang: "ko" },
  "zh-CN": { label: "Chinese Simplified", nativeName: "简体中文", hreflang: "zh-CN" },
  "zh-TW": { label: "Chinese Traditional", nativeName: "繁體中文", hreflang: "zh-TW" },
  es: { label: "Spanish", nativeName: "Español", hreflang: "es" }
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

export function localeUrl(baseUrl: string, locale: Locale): string {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}${localePath(locale)}`;
}
