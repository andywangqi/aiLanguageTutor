import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/app/BrandMark";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getInfoCopy } from "@/lib/i18n/info-copy";
import type { InfoCopy } from "@/lib/i18n/info-types";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  updated?: string;
  locale?: Locale;
  copy?: InfoCopy;
  children: ReactNode;
};

export function InfoPage({ eyebrow, title, lead, updated, locale = "en", copy, children }: InfoPageProps) {
  const shell = (copy ?? getInfoCopy(locale)).shell;
  const resolvedUpdated = updated ?? "August 24, 2026";

  return (
    <div className="info-page">
      <header className="info-header">
        <div className="container info-header-inner">
          <BrandMark href={localizedPath(locale, "/")} />
          <div className="info-header-actions">
            <LanguageSwitcher currentLocale={locale} />
            <Link className="info-home-link" href={localizedPath(locale, "/")}>
              <ArrowLeft aria-hidden="true" size={16} />
              {shell.back}
            </Link>
          </div>
        </div>
      </header>

      <main className="info-main">
        <div className="container info-layout">
          <header className="info-intro">
            <p className="info-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="info-lead">{lead}</p>
            <p className="info-updated">{shell.updatedLabel}: {resolvedUpdated}</p>
          </header>

          <article className="info-article">{children}</article>
        </div>
      </main>

      <footer className="info-footer">
        <div className="container info-footer-inner">
          <span>{shell.footerBrand}</span>
          <nav aria-label={shell.policyNavigation}>
            <Link href={localizedPath(locale, "/contact")}>{shell.navigation.contact}</Link>
            <Link href={localizedPath(locale, "/privacy")}>{shell.navigation.privacy}</Link>
            <Link href={localizedPath(locale, "/terms")}>{shell.navigation.terms}</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
