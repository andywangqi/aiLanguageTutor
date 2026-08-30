"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, localePath } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/analytics/client";
import { LanguageSwitcher } from "./LanguageSwitcher";

const labels: Record<Locale, { how: string; languages: string; pricing: string; blog: string; signIn: string; start: string }> = {
  en: { how: "How It Works", languages: "Languages", pricing: "Pricing", blog: "Blog", signIn: "Sign In", start: "Start Free" },
  ja: { how: "使い方", languages: "対応言語", pricing: "料金", blog: "ブログ", signIn: "ログイン", start: "無料で始める" },
  th: { how: "วิธีใช้งาน", languages: "ภาษา", pricing: "ราคา", blog: "บล็อก", signIn: "เข้าสู่ระบบ", start: "เริ่มใช้ฟรี" },
  ko: { how: "사용 방법", languages: "언어", pricing: "요금", blog: "블로그", signIn: "로그인", start: "무료로 시작" },
  "zh-CN": { how: "使用方法", languages: "语言", pricing: "价格", blog: "博客", signIn: "登录", start: "免费开始" },
  "zh-TW": { how: "使用方式", languages: "語言", pricing: "價格", blog: "部落格", signIn: "登入", start: "免費開始" },
  es: { how: "Cómo funciona", languages: "Idiomas", pricing: "Precios", blog: "Blog", signIn: "Iniciar sesión", start: "Empezar gratis" }
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const copy = labels[locale];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header home-v1-header">
      <div className="container home-v1-header-inner">
        <Link className="home-v1-brand" href={localePath(locale)} aria-label={`${dictionary.footer.brand} home`}>
          <span className="home-v1-brand-mark"><img src="/arno.svg" alt="" /></span>
          <span>AI Language Tutor</span>
        </Link>

        <nav className="home-v1-nav" aria-label={dictionary.nav.product}>
          <button type="button" onClick={() => scrollToSection("home-features")}>{copy.how}</button>
          <button type="button" onClick={() => scrollToSection("home-languages")}>{copy.languages}</button>
          <Link href={localizedPath(locale, "/pricing")}>{copy.pricing}</Link>
          <Link href={localizedPath(locale, "/learn/blog")}>{copy.blog}</Link>
        </nav>

        <div className="home-v1-header-actions">
          <LanguageSwitcher currentLocale={locale} />
          <Link
            className="home-v1-sign-in"
            href={localizedPath(locale, "/login")}
            onClick={() => void trackEvent("home_cta_clicked", { placement: "header", cta: "sign_in", destination: "login", locale })}
          >
            {copy.signIn}
          </Link>
          <Link
            className="home-v1-start"
            href={localizedPath(locale, "/login")}
            onClick={() => void trackEvent("home_cta_clicked", { placement: "header", cta: "start_free", destination: "login", locale })}
          >
            {copy.start}
          </Link>
          <button
            className="home-v1-menu"
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
          <button type="button" onClick={() => { scrollToSection("home-features"); setMobileMenuOpen(false); }}>{copy.how}</button>
          <button type="button" onClick={() => { scrollToSection("home-languages"); setMobileMenuOpen(false); }}>{copy.languages}</button>
          <Link href={localizedPath(locale, "/pricing")} onClick={() => setMobileMenuOpen(false)}>{copy.pricing}</Link>
          <Link href={localizedPath(locale, "/learn/blog")} onClick={() => setMobileMenuOpen(false)}>{copy.blog}</Link>
        </nav>

        <div className="home-v1-mobile-actions">
          <Link
            className="home-v1-sign-in"
            href={localizedPath(locale, "/login")}
            onClick={() => {
              void trackEvent("home_cta_clicked", { placement: "header_mobile", cta: "sign_in", destination: "login", locale });
              setMobileMenuOpen(false);
            }}
          >
            {copy.signIn}
          </Link>
          <Link
            className="home-v1-start"
            href={localizedPath(locale, "/login")}
            onClick={() => {
              void trackEvent("home_cta_clicked", { placement: "header_mobile", cta: "start_free", destination: "login", locale });
              setMobileMenuOpen(false);
            }}
          >
            {copy.start}
          </Link>
        </div>
      </div>
    </header>
  );
}
