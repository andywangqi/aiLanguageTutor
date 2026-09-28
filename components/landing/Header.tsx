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

const labels: Record<Locale, { home: string; languages: string; practice: string; pricing: string; blog: string; signIn: string; start: string; signedIn: string }> = {
  en: { home: "Home", languages: "Languages", practice: "Practice", pricing: "Pricing", blog: "Blog", signIn: "Sign in", start: "Start Speaking Free", signedIn: "Open Tutor" },
  ja: { home: "ホーム", languages: "対応言語", practice: "練習", pricing: "料金", blog: "ブログ", signIn: "ログイン", start: "無料で話し始める", signedIn: "Tutorを開く" },
  th: { home: "หน้าหลัก", languages: "ภาษา", practice: "ฝึกพูด", pricing: "ราคา", blog: "บล็อก", signIn: "เข้าสู่ระบบ", start: "เริ่มพูดฟรี", signedIn: "เปิด Tutor" },
  ko: { home: "홈", languages: "언어", practice: "연습", pricing: "요금", blog: "블로그", signIn: "로그인", start: "무료로 말하기 시작", signedIn: "Tutor 열기" },
  "zh-CN": { home: "首页", languages: "语言", practice: "练习", pricing: "价格", blog: "博客", signIn: "登录", start: "免费开始开口练", signedIn: "进入 Tutor" },
  "zh-TW": { home: "首頁", languages: "語言", practice: "練習", pricing: "價格", blog: "部落格", signIn: "登入", start: "免費開始開口練", signedIn: "進入 Tutor" },
  es: { home: "Inicio", languages: "Idiomas", practice: "Practicar", pricing: "Precios", blog: "Blog", signIn: "Iniciar sesión", start: "Empieza a hablar gratis", signedIn: "Abrir Tutor" }
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
          <Link href={localePath(locale)}>{copy.home}</Link>
          <button type="button" onClick={() => scrollToSection("home-languages", locale)}>{copy.languages}</button>
          <button type="button" onClick={() => scrollToSection("home-practice", locale)}>{copy.practice}</button>
          <Link href={localizedPath(locale, "/pricing")}>{copy.pricing}</Link>
          <Link href={localizedPath(locale, "/learn/blog")}>{copy.blog}</Link>
        </nav>

        <div className="home-v1-header-actions">
          <LanguageSwitcher currentLocale={locale} />
          <Link className="home-v1-sign-in" href={localizedPath(locale, "/login")}>{copy.signIn}</Link>
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
          <Link href={localePath(locale)} onClick={() => setMobileMenuOpen(false)}>{copy.home}</Link>
          <button type="button" onClick={() => { scrollToSection("home-languages", locale); setMobileMenuOpen(false); }}>{copy.languages}</button>
          <button type="button" onClick={() => { scrollToSection("home-practice", locale); setMobileMenuOpen(false); }}>{copy.practice}</button>
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
