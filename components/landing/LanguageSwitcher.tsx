"use client";

import Link from "next/link";
import { Globe2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { localeLabels, localePath, locales, type Locale } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/analytics/client";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() || localePath(currentLocale);
  const localizedPagePath = pathname.replace(/^\/(ja|th|ko|zh-CN|zh-TW|es)(?=\/|$)/, "") || "/";
  const labels: Record<Locale, string> = {
    en: "Choose language",
    ja: "言語を選択",
    th: "เลือกภาษา",
    ko: "언어 선택",
    "zh-CN": "选择语言",
    "zh-TW": "選擇語言",
    es: "Elegir idioma"
  };

  return (
    <details className="language-switcher">
      <summary aria-label={labels[currentLocale]}>
        <Globe2 aria-hidden="true" size={17} />
        <span>{localeLabels[currentLocale].nativeName}</span>
      </summary>
      <div className="language-menu">
        {locales.map((locale) => (
          <Link
            aria-current={locale === currentLocale ? "page" : undefined}
            href={locale === "en" ? localizedPagePath : `/${locale}${localizedPagePath === "/" ? "" : localizedPagePath}`}
            onClick={() => {
              if (locale !== currentLocale) {
                void trackEvent("language_switched", {
                  from_locale: currentLocale,
                  to_locale: locale,
                  from_path: pathname,
                  to_path: locale === "en" ? localizedPagePath : `/${locale}${localizedPagePath === "/" ? "" : localizedPagePath}`
                });
              }
            }}
            key={locale}
          >
            <span>{localeLabels[locale].nativeName}</span>
            <small>{localeLabels[locale].label}</small>
          </Link>
        ))}
      </div>
    </details>
  );
}
