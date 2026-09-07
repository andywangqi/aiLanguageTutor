"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Headphones,
  Lightbulb,
  MessageCircle,
  Mic,
  Play,
  Sparkles,
  Target,
  Volume2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getFooterCopy } from "@/lib/i18n/footer-copy";
import { homeUiCopy, type HomeUiCopy } from "@/lib/i18n/home-ui-copy";
import { trackEvent } from "@/lib/analytics/client";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Header } from "./Header";
import { InteractiveDemo } from "./InteractiveDemo";
const featureIcons: LucideIcon[] = [MessageCircle, Lightbulb, Target];
const benefitIcons: LucideIcon[] = [MessageCircle, Lightbulb, Check, Sparkles];
type LanguageCardKey = "english" | "spanish" | "japanese" | "french" | "german" | "korean" | "chinese";

type LanguageDetail = {
  key: LanguageCardKey;
  code: string;
  className: string;
  imageSrc: string;
};

const languageDetails: LanguageDetail[] = [
  { key: "english", code: "EN", className: "language-english", imageSrc: "/images/languages/english-speaking-practice-v2.webp" },
  { key: "spanish", code: "ES", className: "language-spanish", imageSrc: "/images/languages/spanish-speaking-practice-v2.webp" },
  { key: "japanese", code: "JP", className: "language-japanese", imageSrc: "/images/languages/japanese-speaking-practice-v2.webp" },
  { key: "french", code: "FR", className: "language-french", imageSrc: "/images/languages/french-speaking-practice-v2.webp" },
  { key: "german", code: "DE", className: "language-german", imageSrc: "/images/languages/german-speaking-practice-v2.webp" },
  { key: "korean", code: "KR", className: "language-korean", imageSrc: "/images/languages/korean-speaking-practice-v2.webp" },
  { key: "chinese", code: "ZH", className: "language-chinese", imageSrc: "/images/languages/chinese-speaking-practice-v2.webp" }
];

const languageCardCopy: Record<Locale, Record<LanguageCardKey, { name: string; description: string }>> = {
  en: {
    english: { name: "English", description: "Practice English speaking" },
    spanish: { name: "Spanish", description: "Practice Spanish speaking" },
    japanese: { name: "Japanese", description: "Practice Japanese speaking" },
    french: { name: "French", description: "Practice French speaking" },
    german: { name: "German", description: "Practice German speaking" },
    korean: { name: "Korean", description: "Practice Korean speaking" },
    chinese: { name: "Chinese", description: "Practice Chinese speaking" }
  },
  ja: {
    english: { name: "英語", description: "英語で自然に話す練習" },
    spanish: { name: "スペイン語", description: "スペイン語の会話を練習" },
    japanese: { name: "日本語", description: "日本語で自然な会話を練習" },
    french: { name: "フランス語", description: "旅行や日常で使うフランス語" },
    german: { name: "ドイツ語", description: "実用的なドイツ語会話" },
    korean: { name: "韓国語", description: "韓国語の話し方を練習" },
    chinese: { name: "中国語", description: "中国語で伝える練習" }
  },
  th: {
    english: { name: "ภาษาอังกฤษ", description: "ฝึกพูดอังกฤษในบทสนทนาจริง" },
    spanish: { name: "ภาษาสเปน", description: "ฝึกสนทนาภาษาสเปน" },
    japanese: { name: "ภาษาญี่ปุ่น", description: "ฝึกพูดญี่ปุ่นให้เป็นธรรมชาติ" },
    french: { name: "ภาษาฝรั่งเศส", description: "ฝึกฝรั่งเศสสำหรับชีวิตจริง" },
    german: { name: "ภาษาเยอรมัน", description: "ฝึกบทสนทนาเยอรมัน" },
    korean: { name: "ภาษาเกาหลี", description: "ฝึกพูดเกาหลีในสถานการณ์จริง" },
    chinese: { name: "ภาษาจีน", description: "ฝึกสื่อสารภาษาจีน" }
  },
  ko: {
    english: { name: "영어", description: "실제 대화로 영어 말하기 연습" },
    spanish: { name: "스페인어", description: "스페인어 회화 연습" },
    japanese: { name: "일본어", description: "자연스러운 일본어 말하기" },
    french: { name: "프랑스어", description: "일상에서 쓰는 프랑스어" },
    german: { name: "독일어", description: "실용적인 독일어 대화" },
    korean: { name: "한국어", description: "한국어 말하기 연습" },
    chinese: { name: "중국어", description: "중국어로 표현하는 연습" }
  },
  "zh-CN": {
    english: { name: "英语", description: "练习真实场景里的英语口语" },
    spanish: { name: "西班牙语", description: "练习西班牙语日常会话" },
    japanese: { name: "日语", description: "练习自然的日语表达" },
    french: { name: "法语", description: "练习旅行和生活中的法语" },
    german: { name: "德语", description: "练习实用德语会话" },
    korean: { name: "韩语", description: "练习真实情境里的韩语" },
    chinese: { name: "中文", description: "练习自然中文表达" }
  },
  "zh-TW": {
    english: { name: "英語", description: "練習真實情境中的英語口說" },
    spanish: { name: "西班牙語", description: "練習西班牙語日常會話" },
    japanese: { name: "日語", description: "練習自然的日語表達" },
    french: { name: "法語", description: "練習旅行和生活中的法語" },
    german: { name: "德語", description: "練習實用德語會話" },
    korean: { name: "韓語", description: "練習真實情境裡的韓語" },
    chinese: { name: "中文", description: "練習自然中文表達" }
  },
  es: {
    english: { name: "Inglés", description: "Practica conversaciones reales en inglés" },
    spanish: { name: "Español", description: "Mejora tu conversación en español" },
    japanese: { name: "Japonés", description: "Practica japonés para situaciones reales" },
    french: { name: "Francés", description: "Habla francés de forma más natural" },
    german: { name: "Alemán", description: "Practica conversaciones útiles en alemán" },
    korean: { name: "Coreano", description: "Practica coreano con situaciones reales" },
    chinese: { name: "Chino", description: "Practica cómo expresarte en chino" }
  }
};

const languageImageAltCopy: Record<Locale, Record<LanguageCardKey, string>> = {
  en: {
    english: "Learner practicing English speaking with AI Language Tutor on a laptop in a cafe",
    spanish: "Learner practicing Spanish speaking with a phone at a Barcelona cafe",
    japanese: "Learner practicing Japanese speaking with a phone in a modern cafe",
    french: "Learner practicing French speaking with a phone in a Paris cafe",
    german: "Learner practicing German speaking with a phone in a modern cafe",
    korean: "Learner practicing Korean speaking with a phone in a modern cafe",
    chinese: "Learner practicing Mandarin Chinese speaking with a phone in a Shanghai cafe"
  },
  ja: {
    english: "カフェでノートパソコンを使い、AI Language Tutorで英会話を練習する学習者",
    spanish: "バルセロナのカフェでスマートフォンを使い、スペイン語会話を練習する学習者",
    japanese: "モダンなカフェでスマートフォンを使い、日本語会話を練習する学習者",
    french: "パリのカフェでスマートフォンを使い、フランス語会話を練習する学習者",
    german: "モダンなカフェでスマートフォンを使い、ドイツ語会話を練習する学習者",
    korean: "モダンなカフェでスマートフォンを使い、韓国語会話を練習する学習者",
    chinese: "上海のカフェでスマートフォンを使い、中国語会話を練習する学習者"
  },
  th: {
    english: "ผู้เรียนฝึกพูดภาษาอังกฤษกับ AI Language Tutor บนแล็ปท็อปในคาเฟ่",
    spanish: "ผู้เรียนฝึกพูดภาษาสเปนด้วยโทรศัพท์ในคาเฟ่สไตล์บาร์เซโลนา",
    japanese: "ผู้เรียนฝึกพูดภาษาญี่ปุ่นด้วยโทรศัพท์ในคาเฟ่สมัยใหม่",
    french: "ผู้เรียนฝึกพูดภาษาฝรั่งเศสด้วยโทรศัพท์ในคาเฟ่สไตล์ปารีส",
    german: "ผู้เรียนฝึกพูดภาษาเยอรมันพร้อมโทรศัพท์ในคาเฟ่สมัยใหม่",
    korean: "ผู้เรียนฝึกพูดภาษาเกาหลีด้วยโทรศัพท์ในคาเฟ่สมัยใหม่",
    chinese: "ผู้เรียนฝึกพูดภาษาจีนกลางด้วยโทรศัพท์ในคาเฟ่สไตล์เซี่ยงไฮ้"
  },
  ko: {
    english: "카페에서 노트북으로 AI Language Tutor와 영어 말하기를 연습하는 학습자",
    spanish: "바르셀로나 카페에서 휴대전화로 스페인어 말하기를 연습하는 학습자",
    japanese: "모던한 카페에서 휴대전화로 일본어 말하기를 연습하는 학습자",
    french: "파리 카페에서 휴대전화로 프랑스어 말하기를 연습하는 학습자",
    german: "모던한 카페에서 휴대전화로 독일어 말하기를 연습하는 학습자",
    korean: "모던한 카페에서 휴대전화로 한국어 말하기를 연습하는 학습자",
    chinese: "상하이 분위기의 카페에서 휴대전화로 중국어 말하기를 연습하는 학습자"
  },
  "zh-CN": {
    english: "学习者在咖啡馆用笔记本电脑跟 AI Language Tutor 练习英语口语",
    spanish: "学习者在巴塞罗那风格的咖啡馆用手机练习西班牙语口语",
    japanese: "学习者在现代咖啡馆用手机练习日语口语",
    french: "学习者在巴黎风格的咖啡馆用手机练习法语口语",
    german: "学习者在现代咖啡馆用手机练习德语口语",
    korean: "学习者在现代咖啡馆用手机练习韩语口语",
    chinese: "学习者在上海风格的咖啡馆用手机练习中文口语"
  },
  "zh-TW": {
    english: "學習者在咖啡館用筆記型電腦跟 AI Language Tutor 練習英語口說",
    spanish: "學習者在巴塞隆納風格的咖啡館用手機練習西班牙語口說",
    japanese: "學習者在現代咖啡館用手機練習日語口說",
    french: "學習者在巴黎風格的咖啡館用手機練習法語口說",
    german: "學習者在現代咖啡館用手機練習德語口說",
    korean: "學習者在現代咖啡館用手機練習韓語口說",
    chinese: "學習者在上海風格的咖啡館用手機練習中文口說"
  },
  es: {
    english: "Persona practicando conversación en inglés con AI Language Tutor en una laptop dentro de una cafetería",
    spanish: "Persona practicando conversación en español con un teléfono en una cafetería de estilo Barcelona",
    japanese: "Persona practicando conversación en japonés con un teléfono en una cafetería moderna",
    french: "Persona practicando conversación en francés con un teléfono en una cafetería de estilo París",
    german: "Persona practicando conversación en alemán con un teléfono en una cafetería moderna",
    korean: "Persona practicando conversación en coreano en una cafetería moderna",
    chinese: "Persona practicando conversación en chino mandarín con un teléfono en una cafetería de estilo Shanghái"
  }
};

const viewAllLanguagesCopy: Record<Locale, string> = {
  en: "View all languages",
  ja: "対応言語を見る",
  th: "ดูภาษาทั้งหมด",
  ko: "모든 언어 보기",
  "zh-CN": "查看全部语言",
  "zh-TW": "查看全部語言",
  es: "Ver todos los idiomas"
};
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const { sections, product } = dictionary;
  const ui = homeUiCopy[locale];

  return (
    <div className="home-v1-page">
      <Header dictionary={dictionary} locale={locale} />
      <main>
        <section className="home-v1-hero">
          <div className="home-v1-container home-v1-hero-grid">
            <div className="home-v1-hero-copy">
              <p className="home-v1-eyebrow"><Sparkles size={13} aria-hidden="true" />{dictionary.hero.eyebrow}</p>
              <h1>{dictionary.hero.h1}</h1>
              <p className="home-v1-lead">{dictionary.hero.lead}</p>
              <div className="home-v1-hero-actions">
                <ButtonLink href={localizedPath(locale, "/login")} eventName="home_cta_clicked" eventProperties={{ placement: "hero", cta: "primary", destination: "login", locale }}>
                  {dictionary.hero.primaryCta}<ArrowRight size={16} aria-hidden="true" />
                </ButtonLink>
                <button className="home-v1-outline-cta" type="button" onClick={() => scrollToSection("home-features")}>{dictionary.hero.secondaryCta}</button>
              </div>
              <div className="home-v1-proof" aria-label={ui.learnerTrust}>
                <div className="home-v1-avatars" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>R</span></div>
                <div><div className="home-v1-stars" aria-label={ui.fiveStarRating}>★★★★★</div><small>{ui.trustedBy}</small></div>
              </div>
            </div>
            <InteractiveDemo dictionary={dictionary} />
          </div>
        </section>

        <section className="home-v1-benefits" aria-label={ui.productBenefits}>
          <div className="home-v1-container home-v1-benefits-grid">
            {[
              [sections.learn.cards[0]?.title ?? "Talk Naturally", sections.learn.cards[0]?.description ?? "Speak in the language you are learning."],
              [sections.learn.cards[1]?.title ?? "Get Help Instantly", sections.learn.cards[1]?.description ?? "Get help when you get stuck."],
              [ui.speakingBenefit.title, ui.speakingBenefit.description],
              [ui.progressBenefit.title, ui.progressBenefit.description]
            ].map(([title, text], index) => {
              const Icon = benefitIcons[index];
              return <div className="home-v1-benefit" key={title}><span className={`home-v1-benefit-icon benefit-${index}`}><Icon size={17} aria-hidden="true" /></span><div><strong>{title}</strong><span>{text}</span></div></div>;
            })}
          </div>
        </section>

        <section className="home-v1-section home-v1-white" id="home-features">
          <div className="home-v1-container">
            <HomeSectionHeading eyebrow={ui.coreFeatures} title={sections.learn.h2} lead={sections.learn.lead} />
            <div className="home-v1-feature-grid">
              {sections.learn.cards.map((card, index) => {
                const Icon = featureIcons[index] ?? MessageCircle;
                const sample = product.home.storySamples[index] ?? product.home.storySamples[0];
                return <article className="home-v1-feature-card" key={card.title}>
                  <span className={`home-v1-card-icon card-icon-${index}`}><Icon size={18} aria-hidden="true" /></span>
                  <h3>{card.title}</h3><p>{card.description}</p>
                  <div className={`home-v1-mini-dialogue mini-${index}`}><span>{product.demo.tutorLabel}</span><strong>{sample?.response ?? ui.conversationFallback}</strong></div>
                  <button type="button" onClick={() => scrollToSection("home-help")} className="home-v1-text-link">{ui.featureActions[index] ?? ui.featureActions[2]}<ArrowRight size={14} aria-hidden="true" /></button>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="home-v1-section home-v1-warm" id="home-help">
          <div className="home-v1-container home-v1-help-grid">
            <div className="home-v1-section-copy"><p className="home-v1-kicker">{ui.helpKicker}</p><h2>{sections.modes.h2}</h2><p>{sections.modes.lead}</p><div className="home-v1-small-actions">{ui.helpActions.map((action) => <span key={action}>{action}</span>)}</div></div>
            <div className="home-v1-chat-preview" aria-label={ui.helpExample}>
              <div className="home-v1-chat-line home-v1-chat-user"><span>{ui.you}</span><strong>I want to book a table for tomorrow at 2 PM.</strong></div>
              <div className="home-v1-chat-line home-v1-chat-ai"><span>AI Tutor · {ui.english}</span><strong>{ui.suggestionLead} <em>I&apos;d like to book a table for tomorrow at 2 PM.</em></strong><div className="home-v1-chat-actions"><span><Volume2 size={12} />{ui.listen}</span><span><BookOpen size={12} />{ui.practice}</span></div></div>
              <div className="home-v1-chat-line home-v1-chat-user compact"><span>{ui.you}</span><strong>I&apos;d like to book a table for tomorrow at 2 PM.</strong></div><div className="home-v1-chat-line home-v1-chat-ai compact"><span>AI Tutor</span><strong>Great! How many people will be in your party?</strong></div>
            </div>
          </div>
        </section>

        <section className="home-v1-section home-v1-blue"><div className="home-v1-container home-v1-three-feature-grid"><HomeFeaturePanel icon={Headphones} title={sections.corrections.h2} copy={sections.corrections.lead} points={sections.corrections.points} color="blue" ui={ui} /><HomeFeaturePanel icon={Volume2} title={sections.stuck.h2} copy={sections.stuck.lead} points={sections.stuck.points} color="orange" ui={ui} /><HomeFeaturePanel icon={BookOpen} title={sections.lesson.h2} copy={sections.lesson.lead} points={sections.lesson.steps} color="green" ui={ui} /></div></section>

        <section className="home-v1-section home-v1-white" id="home-languages">
          <div className="home-v1-container">
            <HomeSectionHeading eyebrow={sections.languages.eyebrow} title={sections.languages.h2} lead={sections.languages.lead} />
            <div className="home-v1-language-grid">
              {languageDetails.map((language) => {
                const copy = languageCardCopy[locale][language.key];
                const imageAlt = languageImageAltCopy[locale][language.key];

                return (
                  <button
                    type="button"
                    className="home-v1-language-card"
                    key={language.key}
                    onClick={() => void trackEvent("home_language_interest_clicked", { language: copy.name, locale })}
                  >
                    <span className={`home-v1-language-visual ${language.className} has-image`}>
                      <img src={language.imageSrc} alt={imageAlt} width={960} height={720} loading="lazy" />
                      <strong>{language.code}</strong>
                    </span>
                    <span className="home-v1-language-copy">
                      <strong>{copy.name}</strong>
                      <small>{copy.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="home-v1-centered-link" onClick={() => scrollToSection("home-faq")}>{viewAllLanguagesCopy[locale]} <ArrowRight size={14} aria-hidden="true" /></button>
          </div>
        </section>

        <section className="home-v1-section home-v1-soft-warm"><div className="home-v1-container"><HomeSectionHeading eyebrow={ui.whyChooseUs} title={sections.why.h2} lead={sections.why.lead} /><div className="home-v1-why-grid">{sections.why.cards.map((card, index) => <article className="home-v1-why-card" key={card.title}><span className={`home-v1-why-icon why-${index}`}><Sparkles size={17} /></span><div><h3>{card.title}</h3><p>{card.description}</p></div></article>)}</div></div></section>

        <section className="home-v1-section home-v1-white" id="home-faq"><div className="home-v1-container"><HomeSectionHeading eyebrow={ui.faq} title={sections.faq.h2} lead={sections.faq.lead} /><div className="home-v1-faq-grid">{sections.faq.items.slice(0, 8).map((item) => <details className="home-v1-faq" key={item.question}><summary>{item.question}<ChevronDown size={16} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className="home-v1-cta-section"><div className="home-v1-container"><div className="home-v1-cta-panel"><div><h2>{sections.cta.h2}</h2><p>{sections.cta.lead}</p><div className="home-v1-cta-actions"><ButtonLink href={localizedPath(locale, "/login")} variant="secondary" eventName="home_cta_clicked" eventProperties={{ placement: "final", cta: "primary", destination: "login", locale }}>{sections.cta.primaryCta}<ArrowRight size={15} /></ButtonLink><ButtonLink href={localizedPath(locale, "/pricing")} variant="ghost" eventName="home_cta_clicked" eventProperties={{ placement: "final", cta: "secondary", destination: "pricing", locale }}>{sections.cta.secondaryCta}</ButtonLink></div></div><div className="home-v1-student-visual" aria-hidden="true"><div className="home-v1-speech speech-one">Hello!<br />Nice to meet you.</div><div className="home-v1-student-head" /><div className="home-v1-student-body" /><div className="home-v1-phone" /><div className="home-v1-speech speech-two">I&apos;d love to<br />learn more!</div></div></div></div></section>
      </main>
      <HomeFooter dictionary={dictionary} locale={locale} />
    </div>
  );
}

function HomeSectionHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return <div className="home-v1-heading"><p className="home-v1-kicker">{eyebrow}</p><h2>{title}</h2>{lead ? <p>{lead}</p> : null}</div>;
}

function HomeFeaturePanel({ icon: Icon, title, copy, points, color, ui }: { icon: LucideIcon; title: string; copy: string; points: string[]; color: string; ui: HomeUiCopy }) {
  return <article className={`home-v1-feature-panel panel-${color}`}><div className="home-v1-feature-panel-copy"><span className="home-v1-panel-icon"><Icon size={18} /></span><h2>{title}</h2><p>{copy}</p><ul>{points.slice(0, 3).map((point) => <li key={point}><Check size={13} />{point}</li>)}</ul></div><div className="home-v1-panel-mock"><span>AI Tutor</span><strong>{points[0] ?? ui.personalizedPractice}</strong><div className="home-v1-wave"><i /><i /><i /><i /><i /><i /><i /><i /></div><small><Play size={11} fill="currentColor" /> {ui.tryAgain}</small></div></article>;
}

function HomeFooter({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const footer = getFooterCopy(locale);
  const ui = homeUiCopy[locale];

  return (
    <footer className="home-v1-footer">
      <div className="home-v1-container home-v1-footer-grid">
        <div className="home-v1-footer-brand">
          <Link href={localizedPath(locale, "/")}>
            <span className="home-v1-brand-mark"><img src="/arno.svg" alt="" /></span>
            <strong>AI Language Tutor</strong>
          </Link>
          <p>{dictionary.footer.rights}</p>
          <p>{ui.footerDescription}</p>
        </div>
        {footer.columns.map((column) => (
          <FooterColumn key={column.title} title={column.title} items={column.links} locale={locale} />
        ))}
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  locale
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
  locale: Locale;
}) {
  return (
    <nav className="home-v1-footer-column" aria-label={title}>
      <h3>{title}</h3>
      {items.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          onClick={() => void trackEvent("footer_link_clicked", { locale, label: item.label, href: item.href })}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
