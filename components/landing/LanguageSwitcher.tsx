import Link from "next/link";
import { Globe2 } from "lucide-react";
import { localeLabels, localePath, locales, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  return (
    <details className="language-switcher">
      <summary aria-label="Choose language">
        <Globe2 aria-hidden="true" size={17} />
        <span>{localeLabels[currentLocale].nativeName}</span>
      </summary>
      <div className="language-menu">
        {locales.map((locale) => (
          <Link
            aria-current={locale === currentLocale ? "page" : undefined}
            href={localePath(locale)}
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
