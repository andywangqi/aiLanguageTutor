"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  BriefcaseBusiness,
  Headphones,
  Lightbulb,
  MessageCircle,
  Mic,
  Plane,
  Sparkles,
  Volume2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { homeUiCopy } from "@/lib/i18n/home-ui-copy";
import { trackEvent } from "@/lib/analytics/client";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Header } from "./Header";
import { HomeFaq } from "./HomeFaq";
type HeroDialogue = {
  question: string;
  natural: string;
  followUp: string;
};

// AI 第一句提问 —— 跟随左侧目标语言(heroLang)；后两句 natural / followUp 跟随顶部用户本地语言
const heroDialoguesByTarget: Record<string, HeroDialogue> = {
  en: { question: "What did you do last weekend?", natural: "I went hiking with some friends.", followUp: "That sounds great! What was the best part of the trip?" },
  es: { question: "¿Qué hiciste el fin de semana pasado?", natural: "Fui de excursión con unos amigos.", followUp: "¡Suena genial! ¿Cuál fue la mejor parte del viaje?" },
  fr: { question: "Qu'as-tu fait le week-end dernier ?", natural: "Je suis parti en randonnée avec des amis.", followUp: "Génial ! Quel a été le meilleur moment de la sortie ?" },
  de: { question: "Was hast du letztes Wochenende gemacht?", natural: "Ich war mit ein paar Freunden wandern.", followUp: "Das klingt toll! Was war der schönste Moment des Ausflugs?" },
  ja: { question: "週末は何をしていましたか？", natural: "友達とハイキングに行ってきました。", followUp: "それはよかったですね！一番楽しかったのは何ですか？" }
};

const heroDialoguesByLocale: Record<Locale, HeroDialogue> = {
  en: { question: "What did you do last weekend?", natural: "I went hiking with some friends.", followUp: "That sounds great! What was the best part of the trip?" },
  ja: { question: "週末は何をしていましたか？", natural: "友達とハイキングに行ってきました。", followUp: "それはよかったですね！一番楽しかったのは何ですか？" },
  th: { question: "สุดสัปดาห์ที่ผ่านมาคุณทำอะไรไปบ้าง?", natural: "ฉันไปเดินป่ากับเพื่อนๆ", followUp: "เสียงดูสนุก!ส่วนไหนสนุกที่สุด?" },
  ko: { question: "지난 주말에 무엇을 하셨나요?", natural: "친구들과 하이킹을 갔어요.", followUp: "좋겠네요! 가장 좋았던 부분은 뭐였어요?" },
  "zh-CN": { question: "上周末你做什么了？", natural: "我跟几个朋友去爬山了。", followUp: "听起来不错！这次最开心的部分是什么？" },
  "zh-TW": { question: "上週末你做什麼了？", natural: "我跟幾個朋友去爬山了。", followUp: "聽起來不錯！這次最開心的部分是什麼？" },
  es: { question: "¿Qué hiciste el fin de semana pasado?", natural: "Fui de excursión con unos amigos.", followUp: "¡Suena genial! ¿Cuál fue la mejor parte del viaje?" }
};

// 卡片头部国旗 + 名称 —— 跟随顶部用户本地语言(header locale)；TTS 语音跟随左侧目标语言
const localeMeta: Record<Locale, { flag: string; name: string }> = {
  en: { flag: "us", name: "English" },
  ja: { flag: "jp", name: "日本語" },
  th: { flag: "th", name: "ไทย" },
  ko: { flag: "kr", name: "한국어" },
  "zh-CN": { flag: "cn", name: "中文" },
  "zh-TW": { flag: "tw", name: "繁體中文" },
  es: { flag: "es", name: "Español" }
};

const targetSpeechLang: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ja: "ja-JP"
};

// 用户母语的"卡壳"表达 —— 永远跟随页面 locale,与左侧切换的目标语言无关
const learnerHesitations: Record<Locale, string> = {
  en: "I… went to… um…",
  ja: "えっと…友達と…",
  th: "อืม…ไปกับ…อ่ะ",
  ko: "음…갔어…어…",
  "zh-CN": "我…去了…嗯…",
  "zh-TW": "我…去了…嗯…",
  es: "Yo… fui a… eh…"
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

const howStepsCopy: Record<Locale, Array<{ title: string; description: string }>> = {
  en: [
    { title: "Tell It", description: "Explain what you mean in your own words." },
    { title: "Get Help", description: "Your AI tutor gives you a natural expression." },
    { title: "Say It", description: "Listen, repeat, and practice saying it." },
    { title: "Keep Talking", description: "Use it in the conversation and build your confidence." }
  ],
  ja: [
    { title: "伝える", description: "自分の言葉で意味を伝えます。" },
    { title: "助けを借りる", description: "AI Tutor が自然な表現を提案します。" },
    { title: "声に出す", description: "聞いて、繰り返して、自分で言ってみます。" },
    { title: "話し続ける", description: "会話で使って、自信を少しずつ育てます。" }
  ],
  th: [
    { title: "บอกสิ่งที่อยากพูด", description: "อธิบายความหมายด้วยภาษาของคุณ" },
    { title: "ขอความช่วยเหลือ", description: "AI Tutor จะเสนอวิธีพูดที่เป็นธรรมชาติ" },
    { title: "พูดตาม", description: "ฟัง พูดตาม แล้วฝึกพูดเอง" },
    { title: "คุยต่อ", description: "เอาไปใช้ในบทสนทนา แล้วค่อยๆ มั่นใจขึ้น" }
  ],
  ko: [
    { title: "말하기", description: "자기 말로 뜻을 전하세요." },
    { title: "도움받기", description: "AI 튜터가 자연스러운 표현을 알려드려요." },
    { title: "따라 말하기", description: "듣고, 따라 하고, 직접 말해보세요." },
    { title: "계속 대화하기", description: "대화에 활용하며 조금씩 자신감을 키워요." }
  ],
  "zh-CN": [
    { title: "说出来", description: "用自己的话把意思讲清楚。" },
    { title: "找帮手", description: "AI 导师给你一个自然的说法。" },
    { title: "开口练", description: "听一遍,跟一遍,自己说一遍。" },
    { title: "继续聊", description: "把它用进对话里,慢慢更有信心。" }
  ],
  "zh-TW": [
    { title: "說出來", description: "用自己的話把意思講清楚。" },
    { title: "找幫手", description: "AI 導師給你一個自然的說法。" },
    { title: "開口練", description: "聽一遍,跟一遍,自己說一遍。" },
    { title: "繼續聊", description: "把它用進對話裡,慢慢更有信心。" }
  ],
  es: [
    { title: "Dilo", description: "Explica lo que quieres decir con tus palabras." },
    { title: "Pide ayuda", description: "Tu tutor con AI te da una expresión natural." },
    { title: "Repítelo", description: "Escucha, repite y practica decirlo." },
    { title: "Sigue hablando", description: "Úsalo en la conversación y gana confianza." }
  ]
};

const learningPointsCopy: Record<Locale, Array<{ title: string; description: string }>> = {
  en: [
    { title: "Natural Corrections", description: "See a more natural way to express yourself." },
    { title: "Useful Phrases", description: "Save expressions you can use right away." },
    { title: "Vocabulary", description: "Build your vocabulary step by step." },
    { title: "Review & Practice", description: "Revisit your conversations and keep improving." }
  ],
  ja: [
    { title: "自然な表現", description: "より自然な言い方を見られます。" },
    { title: "使えるフレーズ", description: "すぐに使える表現を保存できます。" },
    { title: "語彙", description: "語彙を少しずつ増やしていけます。" },
    { title: "復習と練習", description: "会話を見直して、さらに上達できます。" }
  ],
  th: [
    { title: "ภาษาที่เป็นธรรมชาติ", description: "เห็นวิธีพูดที่เป็นธรรมชาติกว่า" },
    { title: "วลีที่ใช้ได้จริง", description: "เก็บวลีที่หยิบไปใช้ได้เลย" },
    { title: "คำศัพท์", description: "เพิ่มคำศัพท์ทีละก้าว" },
    { title: "ทบทวนและฝึก", description: "กลับไปดูบทสนทนาแล้วพัฒนาต่อ" }
  ],
  ko: [
    { title: "자연스러운 표현", description: "더 자연스러운 표현을 보여드려요." },
    { title: "쓸모 있는 구절", description: "바로 쓸 수 있는 표현을 저장하세요." },
    { title: "어휘", description: "어휘를 한 걸음씩 쌓아가세요." },
    { title: "복습과 연습", description: "대화를 다시 보며 계속 발전하세요." }
  ],
  "zh-CN": [
    { title: "自然表达", description: "看到更地道的说法。" },
    { title: "实用短语", description: "保存能直接用的表达。" },
    { title: "词汇积累", description: "一步一步把词汇量做起来。" },
    { title: "复盘练习", description: "回看对话,继续进步。" }
  ],
  "zh-TW": [
    { title: "自然表達", description: "看到更道地的說法。" },
    { title: "實用短語", description: "儲存能直接用的表達。" },
    { title: "詞彙累積", description: "一步一步把詞彙量做起來。" },
    { title: "回顧練習", description: "回看對話,繼續進步。" }
  ],
  es: [
    { title: "Expresión natural", description: "Ve una forma más natural de expresarte." },
    { title: "Frases útiles", description: "Guarda expresiones que puedes usar de inmediato." },
    { title: "Vocabulario", description: "Construye tu vocabulario paso a paso." },
    { title: "Repaso y práctica", description: "Revisa tus conversaciones y sigue mejorando." }
  ]
};

const finalStepsCopy: Record<Locale, string[]> = {
  en: ["Choose a scenario", "Start talking", "Get help when you're stuck"],
  ja: ["シーンを選ぶ", "話し始める", "詰まったら助けを求める"],
  th: ["เลือกสถานการณ์", "เริ่มคุย", "คิดไม่ออกก็ขอความช่วยเหลือ"],
  ko: ["상황 고르기", "말 시작하기", "막히면 도움받기"],
  "zh-CN": ["挑一个场景", "开口说", "卡住了就求助"],
  "zh-TW": ["挑一個情境", "開口說", "卡住了就求助"],
  es: ["Elige un escenario", "Empieza a hablar", "Pide ayuda si te bloqueas"]
};

type SummaryCopy = {
  title: string;
  tabs: [string, string, string];
  itemLabel1: string;
  itemLabel2: string;
};

const summaryCopy: Record<Locale, SummaryCopy> = {
  en: { title: "Conversation Summary", tabs: ["Phrases", "Corrections", "New Words"], itemLabel1: "Natural expression", itemLabel2: "Saved phrase" },
  ja: { title: "会話サマリー", tabs: ["フレーズ", "添削", "新語"], itemLabel1: "自然な表現", itemLabel2: "保存したフレーズ" },
  th: { title: "สรุปบทสนทนา", tabs: ["วลี", "แก้ไข", "คำใหม่"], itemLabel1: "วิธีพูดที่เป็นธรรมชาติ", itemLabel2: "วลีที่บันทึกแล้ว" },
  ko: { title: "대화 요약", tabs: ["구절", "교정", "새 단어"], itemLabel1: "자연스러운 표현", itemLabel2: "저장한 구절" },
  "zh-CN": { title: "对话小结", tabs: ["短语", "修改", "新词"], itemLabel1: "自然说法", itemLabel2: "已保存的短语" },
  "zh-TW": { title: "對話小結", tabs: ["短語", "修正", "新詞"], itemLabel1: "自然說法", itemLabel2: "已儲存的短語" },
  es: { title: "Resumen de conversación", tabs: ["Frases", "Correcciones", "Palabras nuevas"], itemLabel1: "Expresión natural", itemLabel2: "Frase guardada" }
};

type FooterColumnCopy = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

const footerColumnsCopy: Record<Locale, FooterColumnCopy[]> = {
  en: [
    { title: "Product", links: [{ label: "Home", href: "/" }, { label: "Languages", href: "#home-languages" }, { label: "Practice", href: "#home-practice" }, { label: "Pricing", href: "/pricing" }] },
    { title: "Company", links: [{ label: "About Us", href: "/company/about" }, { label: "Blog", href: "/learn/blog" }, { label: "Contact", href: "/contact" }] },
    { title: "Support", links: [{ label: "Help Center", href: "/contact" }, { label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }] }
  ],
  ja: [
    { title: "プロダクト", links: [{ label: "ホーム", href: "/" }, { label: "対応言語", href: "#home-languages" }, { label: "練習", href: "#home-practice" }, { label: "料金", href: "/pricing" }] },
    { title: "会社", links: [{ label: "私たちについて", href: "/company/about" }, { label: "ブログ", href: "/learn/blog" }, { label: "お問い合わせ", href: "/contact" }] },
    { title: "サポート", links: [{ label: "ヘルプセンター", href: "/contact" }, { label: "プライバシーポリシー", href: "/privacy" }, { label: "利用規約", href: "/terms" }] }
  ],
  th: [
    { title: "ผลิตภัณฑ์", links: [{ label: "หน้าหลัก", href: "/" }, { label: "ภาษา", href: "#home-languages" }, { label: "ฝึกฝน", href: "#home-practice" }, { label: "ราคา", href: "/pricing" }] },
    { title: "บริษัท", links: [{ label: "เกี่ยวกับเรา", href: "/company/about" }, { label: "บล็อก", href: "/learn/blog" }, { label: "ติดต่อ", href: "/contact" }] },
    { title: "ช่วยเหลือ", links: [{ label: "ศูนย์ช่วยเหลือ", href: "/contact" }, { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" }, { label: "ข้อกำหนดการให้บริการ", href: "/terms" }] }
  ],
  ko: [
    { title: "제품", links: [{ label: "홈", href: "/" }, { label: "언어", href: "#home-languages" }, { label: "연습", href: "#home-practice" }, { label: "요금", href: "/pricing" }] },
    { title: "회사", links: [{ label: "소개", href: "/company/about" }, { label: "블로그", href: "/learn/blog" }, { label: "문의", href: "/contact" }] },
    { title: "지원", links: [{ label: "도움말 센터", href: "/contact" }, { label: "개인정보처리방침", href: "/privacy" }, { label: "이용약관", href: "/terms" }] }
  ],
  "zh-CN": [
    { title: "产品", links: [{ label: "首页", href: "/" }, { label: "语言", href: "#home-languages" }, { label: "练习", href: "#home-practice" }, { label: "定价", href: "/pricing" }] },
    { title: "公司", links: [{ label: "关于我们", href: "/company/about" }, { label: "博客", href: "/learn/blog" }, { label: "联系我们", href: "/contact" }] },
    { title: "支持", links: [{ label: "帮助中心", href: "/contact" }, { label: "隐私政策", href: "/privacy" }, { label: "服务条款", href: "/terms" }] }
  ],
  "zh-TW": [
    { title: "產品", links: [{ label: "首頁", href: "/" }, { label: "語言", href: "#home-languages" }, { label: "練習", href: "#home-practice" }, { label: "定價", href: "/pricing" }] },
    { title: "公司", links: [{ label: "關於我們", href: "/company/about" }, { label: "部落格", href: "/learn/blog" }, { label: "聯絡我們", href: "/contact" }] },
    { title: "支援", links: [{ label: "說明中心", href: "/contact" }, { label: "隱私政策", href: "/privacy" }, { label: "服務條款", href: "/terms" }] }
  ],
  es: [
    { title: "Producto", links: [{ label: "Inicio", href: "/" }, { label: "Idiomas", href: "#home-languages" }, { label: "Práctica", href: "#home-practice" }, { label: "Precios", href: "/pricing" }] },
    { title: "Empresa", links: [{ label: "Quiénes somos", href: "/company/about" }, { label: "Blog", href: "/learn/blog" }, { label: "Contacto", href: "/contact" }] },
    { title: "Soporte", links: [{ label: "Centro de ayuda", href: "/contact" }, { label: "Política de privacidad", href: "/privacy" }, { label: "Términos del servicio", href: "/terms" }] }
  ]
};
export function HomePage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const { sections } = dictionary;
  const ui = homeUiCopy[locale];
  const heroLangs = [
    { code: "en", name: "English", flag: "us" },
    { code: "es", name: "Spanish", flag: "es" },
    { code: "fr", name: "French", flag: "fr" },
    { code: "de", name: "German", flag: "de" },
    { code: "ja", name: "Japanese", flag: "jp" }
  ];
  const [heroLang, setHeroLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem("homeHeroLang");
        if (saved && ["en", "es", "fr", "de", "ja"].includes(saved)) return saved;
      } catch {}
    }
    return "en";
  });
  useEffect(() => {
    try { window.localStorage.setItem("homeHeroLang", heroLang); } catch {}
  }, [heroLang]);
  const scenarioTitles: Record<Locale, string[]> = {
    en: ["Job Interview", "Work", "Travel", "Everyday"],
    ja: ["面接", "仕事", "旅行", "日常会話"],
    th: ["สัมภาษณ์งาน", "การทำงาน", "การเดินทาง", "ชีวิตประจำวัน"],
    ko: ["면접", "업무", "여행", "일상 대화"],
    "zh-CN": ["求职面试", "工作沟通", "旅行", "日常对话"],
    "zh-TW": ["求職面試", "工作溝通", "旅行", "日常對話"],
    es: ["Entrevista de trabajo", "Trabajo", "Viajes", "Conversación diaria"]
  };
  const scenarioBadge = locale === "en" ? "Most Popular" : locale === "ja" ? "人気" : locale === "zh-CN" ? "最受欢迎" : locale === "zh-TW" ? "最受歡迎" : locale === "es" ? "Más popular" : locale === "ko" ? "인기" : "ยอดนิยม";
  const targetLanguage = heroLang;
  const startHref = `${localizedPath(locale, "/app")}?learningLanguage=${targetLanguage}`;

  return (
    <div className="home-v1-page">
      <Header dictionary={dictionary} locale={locale} />
      <main>
        <section className="home-v1-hero">
          <div className="home-v1-container home-v1-hero-grid">
            <div className="home-v1-hero-copy">
              <p className="home-v1-eyebrow">{dictionary.hero.eyebrow}</p>
              <h1>{dictionary.hero.h1}</h1>
              <p className="home-v1-lead">{dictionary.hero.lead}</p>
              <div className="home-v1-hero-lang-row" role="group" aria-label="Choose a language">
                {heroLangs.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`home-v1-hero-lang-pill${heroLang === l.code ? " is-active" : ""}`}
                    onClick={() => setHeroLang(l.code)}
                    aria-pressed={heroLang === l.code}
                  >
                    <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt="" loading="lazy" />{l.name}
                  </button>
                ))}
              </div>
              <div className="home-v1-hero-actions">
                <ButtonLink className="home-v1-hero-cta" href={startHref} eventName="home_cta_clicked" eventProperties={{ placement: "hero", cta: "primary", destination: "app", locale, target_language: targetLanguage }}>
                  {dictionary.hero.primaryCta}<ArrowRight size={16} aria-hidden="true" />
                </ButtonLink>
                <span className="home-v1-trial-note">{(dictionary.hero.proof ?? ["Start in your own language", "Keep talking even when stuck"]).map((item) => <span key={item}><Check size={13} />{item}</span>)}</span>
              </div>
            </div>
            <HeroConversationDemo dictionary={dictionary} locale={locale} targetLanguage={targetLanguage} />
          </div>
        </section>

        <section className="home-v1-how-strip" id="home-features" aria-label="How it works">
          <div className="home-v1-how-intro"><span className="home-v1-kicker">{dictionary.sections.learn.eyebrow}</span><h2>{dictionary.sections.learn.h2}</h2><p>{dictionary.sections.learn.lead}</p></div>
          <div className="home-v1-how-steps">{[
            [BriefcaseBusiness, howStepsCopy[locale][0].title, howStepsCopy[locale][0].description],
            [Lightbulb, howStepsCopy[locale][1].title, howStepsCopy[locale][1].description],
            [Volume2, howStepsCopy[locale][2].title, howStepsCopy[locale][2].description],
            [MessageCircle, howStepsCopy[locale][3].title, howStepsCopy[locale][3].description]
          ].map(([Icon, title, description], index) => { const StepIcon = Icon as LucideIcon; return <div className="home-v1-how-step" key={title as string}><span className="home-v1-how-icon"><StepIcon size={25} /></span><strong><i>{`0${index + 1}`}</i>{title as string}</strong><p>{description as string}</p></div>; })}</div>
        </section>

        <section className="home-v1-scenarios" id="home-practice">
          <div className="home-v1-section-heading"><h2>{dictionary.sections.personal.h2}</h2><p>{dictionary.sections.personal.lead}</p></div>
          <div className="home-v1-scenario-grid">{[[scenarioTitles[locale][0], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app?scenario=english-job-interview", "/images/scenario-job-interview.webp", scenarioBadge, BriefcaseBusiness],
            [scenarioTitles[locale][1], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app", "/images/scenario-work.webp", "", Headphones],
            [scenarioTitles[locale][2], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app?scenario=english-travel-conversation", "/images/scenario-travel.webp", "", Plane],
            [scenarioTitles[locale][3], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app", "/images/scenario-everyday.webp", "", MessageCircle]].map(([title, description, cta, href, image, badge, Icon]) => { const ScenarioIcon = Icon as LucideIcon; return <Link className={`home-v1-scenario-card ${badge ? "is-popular" : ""}`} href={localizedPath(locale, href as string)} key={title as string}><div className="home-v1-scenario-image"><img src={image as string} alt="" loading="lazy" />{badge ? <span>{badge as string}</span> : null}<em><ScenarioIcon size={17} /></em></div><div className="home-v1-scenario-body"><h3>{title as string}</h3><p>{description as string}</p><strong>{cta as string}<ArrowRight size={14} /></strong></div></Link>; })}</div>
        </section>

        <section className="home-v1-duo" aria-label="Help and languages">
          <article className="home-v1-duo-card home-v1-unstuck">
            <div className="home-v1-unstuck-media"><img src="/images/unstuck-companion.webp" alt="Learner getting unstuck with AI tutor" loading="lazy" /><span className="home-v1-unstuck-bubble top">I want to go hiking this weekend.</span><span className="home-v1-unstuck-bubble mid">Here&apos;s a natural way to say it: &ldquo;I&apos;m planning to go hiking this weekend.&rdquo;</span></div>
            <div className="home-v1-unstuck-copy"><span className="home-v1-kicker">{dictionary.sections.modes.eyebrow}</span><h2>{dictionary.sections.modes.h2}</h2><p>{dictionary.sections.modes.lead}</p><ul>{dictionary.sections.modes.items.map((item) => <li key={item.title}><Check size={14} />{item.title}</li>)}</ul></div>
          </article>
          <article className="home-v1-duo-card home-v1-mini-langs" id="home-languages">
            <span className="home-v1-kicker">{dictionary.sections.languages.eyebrow}</span><h2>{dictionary.sections.languages.h2}</h2><p>{dictionary.sections.languages.lead}</p>
            <div className="home-v1-mini-lang-grid">{[{ c: "us", n: "English" }, { c: "es", n: "Spanish" }, { c: "jp", n: "Japanese" }, { c: "fr", n: "French" }, { c: "de", n: "German" }, { c: "kr", n: "Korean" }, { c: "cn", n: "Chinese" }, { c: "th", n: "Thai" }].map((l) => <span key={l.n}><img src={`https://flagcdn.com/w40/${l.c}.png`} alt="" loading="lazy" /><b>{l.n}</b></span>)}</div>
            <Link href={localizedPath(locale, "/app?chooseLanguage=1")}>{viewAllLanguagesCopy[locale]} <ArrowRight size={13} /></Link>
          </article>
        </section>

        <section className="home-v1-learning-section"><div className="home-v1-learning-copy"><h2>{dictionary.sections.lesson.h2}</h2><div className="home-v1-learning-points">{[
          [Sparkles, learningPointsCopy[locale][0].title, learningPointsCopy[locale][0].description],
          [BookOpen, learningPointsCopy[locale][1].title, learningPointsCopy[locale][1].description],
          [MessageCircle, learningPointsCopy[locale][2].title, learningPointsCopy[locale][2].description],
          [Mic, learningPointsCopy[locale][3].title, learningPointsCopy[locale][3].description]
        ].map(([Icon, title, description]) => { const FeatureIcon = Icon as LucideIcon; return <div key={title as string}><span><FeatureIcon size={17} /></span><strong>{title as string}</strong><p>{description as string}</p></div>; })}</div></div><ConversationSummaryCard locale={locale} /></section>

        <section className="home-v1-betterway" aria-label="A better way">
          <div className="home-v1-betterway-main"><span className="home-v1-kicker">{dictionary.sections.why.eyebrow}</span><h2>{dictionary.sections.why.h2}</h2><div className="home-v1-betterway-grid">{dictionary.sections.why.cards.map((card) => <div key={card.title}><span><Check size={14} /></span><strong>{card.title}</strong><p>{card.description}</p></div>)}</div></div>
          <div className="home-v1-betterway-photo" aria-hidden="true"><span className="home-v1-hero-robot-shadow" aria-hidden="true" /><img className="home-v1-betterway-robot" src="/images/ai-tutor-robot.png" alt="" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /></div>
        </section>

        <HomeFaq locale={locale} />

        <section className="home-v1-final-cta"><div className="home-v1-final-text"><h2>{dictionary.sections.cta.h2}</h2><p>{dictionary.sections.cta.lead}</p><div className="home-v1-final-row"><ButtonLink href={localizedPath(locale, "/app")} eventName="home_cta_clicked" eventProperties={{ placement: "final", cta: "primary", destination: "app", locale }}>{dictionary.sections.cta.primaryCta}<ArrowRight size={15} /></ButtonLink><small><Check size={12} />{(dictionary.hero.proof ?? ["No credit card required", "Free conversation included"]).join(" · ")}</small></div></div><div className="home-v1-final-steps"><div><span><BriefcaseBusiness size={15} /></span><b>{finalStepsCopy[locale][0]}</b><ArrowRight size={13} /></div><div><span><Lightbulb size={15} /></span><b>{finalStepsCopy[locale][1]}</b><ArrowRight size={13} /></div><div><span><MessageCircle size={15} /></span><b>{finalStepsCopy[locale][2]}</b></div></div></section>
      </main>
      <HomeFooter dictionary={dictionary} locale={locale} />
    </div>
  );
}

function HeroConversationDemo({ dictionary, locale, targetLanguage }: { dictionary: LandingDictionary; locale: Locale; targetLanguage: string }) {
  const targetDialogue = heroDialoguesByTarget[targetLanguage] ?? heroDialoguesByTarget.en;
  const localeDialogue = heroDialoguesByLocale[locale] ?? heroDialoguesByLocale.en;
  const meta = localeMeta[locale] ?? localeMeta.en;
  const speechLang = targetSpeechLang[targetLanguage] ?? targetSpeechLang.en;
  const workHref = localizedPath(locale, `/app?learningLanguage=${targetLanguage}`);
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(targetDialogue.natural);
    utterance.lang = speechLang;
    window.speechSynthesis.speak(utterance);
  }

  function handleParallax(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget.querySelector(".home-v1-hero-robot-img") as HTMLElement | null;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--px", `${(x * 16).toFixed(1)}px`);
    el.style.setProperty("--py", `${(y * 12).toFixed(1)}px`);
    el.style.setProperty("--rr", `${(x * 4).toFixed(1)}deg`);
  }

  function resetParallax(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget.querySelector(".home-v1-hero-robot-img") as HTMLElement | null;
    if (!el) return;
    el.style.setProperty("--px", "0px");
    el.style.setProperty("--py", "0px");
    el.style.setProperty("--rr", "0deg");
  }

  return <div className="home-v1-hero-demo-wrap" onMouseMove={handleParallax} onMouseLeave={resetParallax}><div className="home-v1-hero-orb" aria-hidden="true" /><div className="home-v1-hero-demo">
    <header><span className="home-v1-demo-logo"><span>▮</span> AI Language Tutor</span><span className="home-v1-demo-lang"><img src={`https://flagcdn.com/w40/${meta.flag}.png`} alt="" />{meta.name}</span><span className="home-v1-demo-head-actions" aria-hidden="true">✈ ···</span></header>
    <div className="home-v1-demo-chat"><div className="home-v1-demo-line tutor"><span className="home-v1-demo-avatar">AI</span><div><p>{localeDialogue.question}</p></div></div><div className="home-v1-demo-line learner"><p>{learnerHesitations[locale]}</p></div>
      <div className="home-v1-help-card"><strong><Lightbulb size={17} />{dictionary.demo.responseLabel}</strong><span>{dictionary.demo.promptLabel}:</span><b>“{targetDialogue.natural}”</b><div><button type="button" onClick={speak}><Volume2 size={14} />{dictionary.demo.actions[0]}</button><Link href={workHref} onClick={() => void trackEvent("home_cta_clicked", { placement: "hero-demo", cta: "mic", destination: "app", locale, target_language: targetLanguage })}><Mic size={14} />{dictionary.demo.actions[1]}</Link></div></div>
      <div className="home-v1-demo-line tutor follow-up"><span className="home-v1-demo-avatar">AI</span><div><p>{localeDialogue.followUp}</p></div></div></div>
    <Link className="home-v1-demo-mic" href={workHref} aria-label={dictionary.demo.actions[1]} onClick={() => void trackEvent("home_cta_clicked", { placement: "hero-demo", cta: "mic-big", destination: "app", locale, target_language: targetLanguage })}><Mic size={22} /></Link><small className="home-v1-demo-tap">{dictionary.demo.turn}</small>
  </div><figure className="home-v1-hero-robot"><span className="home-v1-robot-note" aria-hidden="true">Your AI tutor<br />is here to help.</span><span className="home-v1-robot-bubble" aria-hidden="true"><i /><i /><i /><i /></span><span className="home-v1-hero-robot-shadow" aria-hidden="true" /><img className="home-v1-hero-robot-img" src="/images/ai-tutor-robot.png" alt="AI tutor robot" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /><span className="home-v1-robot-eq" aria-hidden="true"><i /><i /><i /><i /><i /></span></figure></div>;
}

function ConversationSummaryCard({ locale }: { locale: Locale }) {
  const s = summaryCopy[locale];
  return <div className="home-v1-summary-wrap"><div className="home-v1-summary-card"><header><span>‹</span><strong>{s.title}</strong><span>◌</span></header><nav><b>{s.tabs[0]}</b><span>{s.tabs[1]}</span><span>{s.tabs[2]}</span></nav><article className="home-v1-summary-item"><span className="home-v1-summary-check"><Check size={12} /></span><div><strong>It was a great experience.</strong><small>{s.itemLabel1}</small></div><ArrowRight size={13} /></article><article className="home-v1-summary-item"><span className="home-v1-summary-check"><Check size={12} /></span><div><strong>I really enjoyed the trip.</strong><small>{s.itemLabel2}</small></div><ArrowRight size={13} /></article></div><span className="home-v1-summary-spark spark-a">✧</span><span className="home-v1-summary-spark spark-b">✦</span></div>;
}

function HomeFooter({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const ui = homeUiCopy[locale];
  const columns = footerColumnsCopy[locale].map((column) => ({
    title: column.title,
    links: column.links.map((link) => ({ label: link.label, href: localizedPath(locale, link.href) }))
  }));

  return (
    <footer className="home-v1-footer">
      <div className="home-v1-container home-v1-footer-grid">
        <div className="home-v1-footer-brand">
          <Link href={localizedPath(locale, "/")}>
            <span className="home-v1-brand-mark"><img src="/arno.svg" alt="" /></span>
            <strong>AI Language Tutor</strong>
          </Link>
          <p>{ui.footerDescription}</p>
          <a href="https://www.direct2app.com" target="_blank" rel="noopener" aria-label="Featured On Direct2App">
            <img src="https://www.direct2app.com/featured-light.svg" alt="Featured On Direct2App" style={{ height: 54, width: "auto" }} loading="lazy" />
          </a>
        </div>
        {columns.map((column) => (
          <FooterColumn key={column.title} title={column.title} items={column.links} locale={locale} />
        ))}
        <small className="home-v1-footer-copyright">{dictionary.footer.rights}</small>
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
