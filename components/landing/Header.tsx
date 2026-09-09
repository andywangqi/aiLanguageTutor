"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, localePath } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/analytics/client";
import { homeUiCopy } from "@/lib/i18n/home-ui-copy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LanguageSwitcher } from "./LanguageSwitcher";

const labels: Record<Locale, { how: string; languages: string; reading: string; pricing: string; blog: string; start: string; signedIn: string }> = {
  en: { how: "How It Works", languages: "Languages", reading: "English Reading", pricing: "Pricing", blog: "Blog", start: "Start Free", signedIn: "Open Tutor" },
  ja: { how: "使い方", languages: "対応言語", reading: "英語リーディング", pricing: "料金", blog: "ブログ", start: "無料で始める", signedIn: "Tutorを開く" },
  th: { how: "วิธีใช้งาน", languages: "ภาษา", reading: "ฝึกอ่านภาษาอังกฤษ", pricing: "ราคา", blog: "บล็อก", start: "เริ่มใช้ฟรี", signedIn: "เปิด Tutor" },
  ko: { how: "사용 방법", languages: "언어", reading: "영어 읽기", pricing: "요금", blog: "블로그", start: "무료로 시작", signedIn: "Tutor 열기" },
  "zh-CN": { how: "使用方法", languages: "语言", reading: "英语阅读", pricing: "价格", blog: "博客", start: "免费开始", signedIn: "进入 Tutor" },
  "zh-TW": { how: "使用方式", languages: "語言", reading: "英語閱讀", pricing: "價格", blog: "部落格", start: "免費開始", signedIn: "進入 Tutor" },
  es: { how: "Cómo funciona", languages: "Idiomas", reading: "Lectura en inglés", pricing: "Precios", blog: "Blog", start: "Empezar gratis", signedIn: "Abrir Tutor" }
};

function scrollToSection(id: string, locale: Locale) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.location.assign(`${localePath(locale)}#${id}`);
}

export function Header({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const copy = labels[locale];
  const ui = homeUiCopy[locale];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setIsAuthenticated(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const startHref = isAuthenticated
    ? localizedPath(locale, "/app")
    : `${localizedPath(locale, "/login")}?next=${encodeURIComponent(localizedPath(locale, "/app"))}`;
  const startLabel = isAuthenticated ? copy.signedIn : copy.start;
  const startEvent = isAuthenticated ? "open_tutor" : "start_free";

  return (
    <header className="site-header home-v1-header">
      <div className="container home-v1-header-inner">
        <Link className="home-v1-brand" href={localePath(locale)} aria-label={ui.brandHome}>
          <span className="home-v1-brand-mark"><img src="/arno.svg" alt="" /></span>
          <span>AI Language Tutor</span>
        </Link>

        <nav className="home-v1-nav" aria-label={dictionary.nav.product}>
          <button type="button" onClick={() => scrollToSection("home-features", locale)}>{copy.how}</button>
          <button type="button" onClick={() => scrollToSection("home-languages", locale)}>{copy.languages}</button>
          <Link href={localizedPath(locale, "/english-reading-practice")}>{copy.reading}</Link>
          <Link href={localizedPath(locale, "/pricing")}>{copy.pricing}</Link>
          <Link href={localizedPath(locale, "/learn/blog")}>{copy.blog}</Link>
        </nav>

        <div className="home-v1-header-actions">
          <LanguageSwitcher currentLocale={locale} />
          <Link
            className="home-v1-start"
            href={startHref}
            onClick={() => void trackEvent("home_cta_clicked", { placement: "header", cta: startEvent, destination: isAuthenticated ? "app" : "login", locale })}
          >
            {startLabel}
          </Link>
          <button
            className="home-v1-menu"
            type="button"
            aria-label={mobileMenuOpen ? ui.closeMenu : ui.openMenu}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className={`home-v1-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} hidden={!mobileMenuOpen}>
        <div className="home-v1-mobile-menu-section">
          <LanguageSwitcher currentLocale={locale} />
        </div>

        <nav className="home-v1-mobile-nav" aria-label={dictionary.nav.product}>
          <button type="button" onClick={() => { scrollToSection("home-features", locale); setMobileMenuOpen(false); }}>{copy.how}</button>
          <button type="button" onClick={() => { scrollToSection("home-languages", locale); setMobileMenuOpen(false); }}>{copy.languages}</button>
          <Link href={localizedPath(locale, "/english-reading-practice")} onClick={() => setMobileMenuOpen(false)}>{copy.reading}</Link>
          <Link href={localizedPath(locale, "/pricing")} onClick={() => setMobileMenuOpen(false)}>{copy.pricing}</Link>
          <Link href={localizedPath(locale, "/learn/blog")} onClick={() => setMobileMenuOpen(false)}>{copy.blog}</Link>
        </nav>

        <div className="home-v1-mobile-actions">
          <Link
            className="home-v1-start"
            href={startHref}
            onClick={() => {
              void trackEvent("home_cta_clicked", { placement: "header_mobile", cta: startEvent, destination: isAuthenticated ? "app" : "login", locale });
              setMobileMenuOpen(false);
            }}
          >
            {startLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
