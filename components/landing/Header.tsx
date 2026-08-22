import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href={localePath(locale)} aria-label="AI Language Tutor home">
          <Image src="/arno.svg" width={42} height={42} alt="" priority />
          <span className="brand-text">AI Language Tutor</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          <a href="#method">{dictionary.nav.method}</a>
          <a href="#languages">{dictionary.nav.languages}</a>
          <a href="#faq">{dictionary.nav.faq}</a>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher currentLocale={locale} />
          <Link className="app-link" href="/login">
            {dictionary.nav.app}
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
