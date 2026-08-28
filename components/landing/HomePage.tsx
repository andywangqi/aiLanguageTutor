import Link from "next/link";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Target,
  Volume2
} from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { SectionHeading } from "./SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";

const pronunciationBars = [34, 58, 72, 48, 64, 52, 76, 44];
const benefitIcons = [Sparkles, Target, MessageSquareText];

export function HomePage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const { sections } = dictionary;
  const product = dictionary.product;

  return (
    <>
      <Header dictionary={dictionary} locale={locale} />
      <main>
        <Hero dictionary={dictionary} locale={locale} />

        <section className="section section-white story-section" id="method">
          <div className="container">
              <SectionHeading
                eyebrow={sections.learn.eyebrow}
                title={sections.learn.h2}
                lead={sections.learn.lead}
              />
            <div className="story-grid">
              {sections.learn.cards.map((card, index) => {
                const sample = product.home.storySamples[index] ?? product.home.storySamples[0];

                return (
                  <article className="story-card" key={card.title}>
                    <div className="story-card-top">
                      <span className="story-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="story-pill">{sample.badge}</span>
                    </div>
                    <h3>{card.title}</h3>
                    <div className="story-dialogue">
                      <div className="story-sample story-user">
                        <small>{product.demo.userLabel}</small>
                        <strong>{sample.prompt}</strong>
                      </div>
                      <div className="story-sample story-tutor">
                        <small>{product.demo.tutorLabel}</small>
                        <strong>{sample.response}</strong>
                      </div>
                    </div>
                    <p>{card.description}</p>
                    <div className="story-actions" aria-label={card.title}>
                      {sample.actions.map((action) => (
                        <span key={action}>{action}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-warm">
          <div className="container split-grid product-grid">
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.modes.eyebrow}
                title={sections.modes.h2}
                lead={sections.modes.lead}
              />
              <div className="flow-track" aria-label={product.home.flowSteps.join(" → ")}>
                {product.home.flowSteps.map((step, index) => (
                  <span key={step}>
                    {step}
                    {index < product.home.flowSteps.length - 1 ? <ChevronRight aria-hidden="true" size={14} /> : null}
                  </span>
                ))}
              </div>
              <p className="flow-note">{product.home.flowNote}</p>
            </div>
            <div className="mode-stack">
              {sections.modes.items.map((item, index) => (
                <article className="mode-card mode-story-card" key={item.title}>
                  <div className="mode-card-head">
                    <span className={index === 0 ? "mode-number orange" : "mode-number blue"}>{index + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="mode-example">
                    <small>{product.home.modeExamples[index]?.label}</small>
                    <strong>{product.home.modeExamples[index]?.text}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-blue" id="corrections">
          <div className="container correction-grid">
            <div className="correction-board">
              <div className="correction-row muted">
                <span>{product.home.correction.youSaid}</span>
                <strong>{product.home.correction.youSaidText}</strong>
              </div>
              <div className="correction-row active">
                <span>{product.home.correction.tutorLabel}</span>
                <strong>{product.home.correction.tutorText}</strong>
              </div>
              <div className="correction-note">
                <Lightbulb aria-hidden="true" size={18} />
                <p>{product.home.correction.note}</p>
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.corrections.eyebrow}
                title={sections.corrections.h2}
                lead={sections.corrections.lead}
              />
              <div className="correction-list">
                {sections.corrections.points.map((point) => (
                  <div className="check-item" key={point}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-white" id="pronunciation">
          <div className="container split-grid reverse-on-mobile">
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.stuck.eyebrow}
                title={sections.stuck.h2}
                lead={sections.stuck.lead}
              />
              <ul className="clean-list">
                {sections.stuck.points.map((point) => (
                  <li key={point}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pronunciation-panel">
              <div className="panel-header">
                <span className="panel-label">{product.home.pronunciation.label}</span>
                <span className="live-dot">{locale === "ja" ? "ライブ" : locale === "th" ? "สด" : locale === "ko" ? "실시간" : locale === "zh-CN" ? "实时" : locale === "zh-TW" ? "即時" : locale === "es" ? "En directo" : "Live"}</span>
              </div>
              <div className="pronunciation-word">
                <Volume2 aria-hidden="true" size={18} />
                <strong>{product.home.pronunciation.word}</strong>
              </div>
              <div className="pronunciation-score">
                <span>{product.home.pronunciation.feedbackLabel}</span>
                <strong>{product.home.pronunciation.feedbackTitle}</strong>
                <p>{product.home.pronunciation.feedbackBody}</p>
              </div>
              <div className="voice-wave" aria-hidden="true">
                {pronunciationBars.map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="pronunciation-details" aria-label={product.home.pronunciation.ariaSyllables}>
                {product.home.pronunciation.syllables.map((syllable) => (
                  <span key={syllable}>{syllable}</span>
                ))}
              </div>
              <p className="pronunciation-copy">{product.home.pronunciation.copy}</p>
              <ButtonLink href={localizedPath(locale, "/login")} variant="secondary" className="pronunciation-button">
                {product.home.pronunciation.cta}
                <ChevronRight aria-hidden="true" size={18} />
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="section section-warm">
          <div className="container split-grid lesson-grid">
            <div className="vocab-panel">
              <div className="panel-header">
                <span className="panel-label">{product.home.vocabulary.label}</span>
                <BookOpen aria-hidden="true" size={18} />
              </div>
              <div className="vocab-table" role="table" aria-label={product.home.vocabulary.ariaLabel}>
                <div className="vocab-head" role="row">
                  {product.home.vocabulary.columns.map((column) => (
                    <span role="columnheader" key={column}>{column}</span>
                  ))}
                </div>
                {product.home.vocabulary.rows.map((row) => (
                  <div className="vocab-row" role="row" key={row.word}>
                    <strong role="cell">{row.word}</strong>
                    <span role="cell">{row.meaning}</span>
                    <button type="button" aria-label={`${row.practice} ${row.word}`}>
                      {row.practice}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.lesson.eyebrow}
                title={sections.lesson.h2}
                lead={sections.lesson.lead}
              />
              <div className="lesson-strip">
                {sections.lesson.steps.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
              <p className="lesson-note">{product.home.vocabulary.note}</p>
            </div>
          </div>
        </section>

        <section className="section section-blue" id="review">
          <div className="container personal-grid">
            <div className="memory-panel">
              <div className="panel-header">
                <span className="panel-label">{product.home.review.label}</span>
                <Brain aria-hidden="true" size={18} />
              </div>
              <div className="memory-list">
                {product.home.review.rows.map((row) => (
                  <div className="memory-item" key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
              <div className="stat-grid">
                {sections.personal.stats.map((stat) => (
                  <div key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.personal.eyebrow}
                title={sections.personal.h2}
                lead={sections.personal.lead}
              />
              <ul className="clean-list compact" aria-label={product.home.review.ariaLabel}>
                {product.home.review.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section section-white" id="languages">
          <div className="container">
            <SectionHeading
              eyebrow={sections.languages.eyebrow}
              title={sections.languages.h2}
              lead={sections.languages.lead}
            />
            <div className="language-cloud">
              {sections.languages.items.map((language) => (
                <span key={language}>{language}</span>
              ))}
            </div>
            <p className="language-note">{product.home.languageNote}</p>
          </div>
        </section>

        <section className="section section-warm">
          <div className="container">
            <SectionHeading eyebrow={sections.why.eyebrow} title={sections.why.h2} lead={sections.why.lead} />
            <div className="benefit-grid">
              {sections.why.cards.map((card, index) => {
                const Icon = benefitIcons[index] ?? Sparkles;

                return (
                  <article className="benefit-card" key={card.title}>
                    <span className="icon-tile blue">
                      <Icon aria-hidden="true" size={24} />
                    </span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-white" id="faq">
          <div className="container">
            <SectionHeading eyebrow={sections.faq.eyebrow} title={sections.faq.h2} lead={sections.faq.lead} />
            <div className="faq-grid">
              {sections.faq.items.map((item, index) => (
                <details className="faq-item" key={item.question} open={index < 2}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-panel">
              <h2>{sections.cta.h2}</h2>
              <p>{sections.cta.lead}</p>
              <div className="cta-actions">
                <ButtonLink
                  href={localizedPath(locale, "/login")}
                  variant="secondary"
                  eventName="home_cta_clicked"
                  eventProperties={{ placement: "final", cta: "primary", destination: "login", locale }}
                >
                  {sections.cta.primaryCta}
                  <ChevronRight aria-hidden="true" size={18} />
                </ButtonLink>
                <ButtonLink
                  href={localizedPath(locale, "/pricing")}
                  variant="ghost"
                  eventName="home_cta_clicked"
                  eventProperties={{ placement: "final", cta: "secondary", destination: "pricing", locale }}
                >
                  {sections.cta.secondaryCta}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer dictionary={dictionary} />
    </>
  );
}

function Footer({ dictionary }: { dictionary: LandingDictionary }) {
  const locale = dictionary.locale;
  const footerLinks: Record<string, string> = {
    "Say It": "#demo",
    Talk: "#method",
    "Get Help": "#method",
    Corrections: "#corrections",
    "Open App": localizedPath(locale, "/login"),
    "Conversation Practice": "#method",
    "Speaking Practice": "#method",
    "Pronunciation Practice": "#pronunciation",
    Review: "#review",
    Contact: localizedPath(locale, "/contact"),
    Privacy: localizedPath(locale, "/privacy"),
    Terms: localizedPath(locale, "/terms")
  };
  const footerTitles: Record<Locale, string[]> = {
    en: ["Product", "Learn", "Company"],
    ja: ["プロダクト", "学習", "会社情報"],
    th: ["ผลิตภัณฑ์", "การเรียนรู้", "บริษัท"],
    ko: ["제품", "학습", "회사"],
    "zh-CN": ["产品", "学习", "公司"],
    "zh-TW": ["產品", "學習", "公司"],
    es: ["Producto", "Aprendizaje", "Empresa"]
  };
  const footerLabels: Record<Locale, Record<string, string>> = {
    en: {},
    ja: { Talk: "Talk", "Get Help": "ヘルプ", Corrections: "添削", "Open App": "話してみる", "Conversation Practice": "会話練習", "Speaking Practice": "スピーキング練習", "Pronunciation Practice": "発音練習", Review: "復習", Contact: "お問い合わせ", Privacy: "プライバシー", Terms: "利用規約" },
    th: { Talk: "Talk", "Get Help": "ขอความช่วยเหลือ", Corrections: "การแก้ไข", "Open App": "เริ่มพูด", "Conversation Practice": "ฝึกสนทนา", "Speaking Practice": "ฝึกพูด", "Pronunciation Practice": "ฝึกออกเสียง", Review: "ทบทวน", Contact: "ติดต่อเรา", Privacy: "ความเป็นส่วนตัว", Terms: "ข้อกำหนด" },
    ko: { Talk: "Talk", "Get Help": "도움 받기", Corrections: "교정", "Open App": "말하기 시작", "Conversation Practice": "대화 연습", "Speaking Practice": "말하기 연습", "Pronunciation Practice": "발음 연습", Review: "복습", Contact: "문의하기", Privacy: "개인정보 보호", Terms: "이용약관" },
    "zh-CN": { Talk: "Talk", "Get Help": "获得帮助", Corrections: "纠错", "Open App": "开始对话", "Conversation Practice": "对话练习", "Speaking Practice": "口语练习", "Pronunciation Practice": "发音练习", Review: "复习", Contact: "联系我们", Privacy: "隐私政策", Terms: "服务条款" },
    "zh-TW": { Talk: "Talk", "Get Help": "取得幫助", Corrections: "即時修正", "Open App": "開始對話", "Conversation Practice": "會話練習", "Speaking Practice": "口說練習", "Pronunciation Practice": "發音練習", Review: "複習", Contact: "聯絡我們", Privacy: "隱私政策", Terms: "服務條款" },
    es: { Talk: "Talk", "Get Help": "Pedir ayuda", Corrections: "Correcciones", "Open App": "Empezar a hablar", "Conversation Practice": "Práctica conversacional", "Speaking Practice": "Práctica oral", "Pronunciation Practice": "Práctica de pronunciación", Review: "Repaso", Contact: "Contacto", Privacy: "Privacidad", Terms: "Términos" }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>{dictionary.footer.brand}</h2>
          <p>{dictionary.footer.rights}</p>
          <a href="mailto:support@ailanguagetutor.online">support@ailanguagetutor.online</a>
        </div>
        {dictionary.footer.columns.map((column, index) => (
          <nav aria-label={footerTitles[locale][index] ?? column.title} key={column.title}>
            <h3>{footerTitles[locale][index] ?? column.title}</h3>
            {column.links.map((link) => (
              <Link href={footerLinks[link] ?? "/"} key={link}>
                {footerLabels[locale][link] ?? link}
              </Link>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
