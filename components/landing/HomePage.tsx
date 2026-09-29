"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  BriefcaseBusiness,
  Headphones,
  Lightbulb,
  MessageCircle,
  Mic,
  Play,
  Plane,
  Sparkles,
  Volume2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { homeUiCopy, type HomeUiCopy } from "@/lib/i18n/home-ui-copy";
import { trackEvent } from "@/lib/analytics/client";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Header } from "./Header";
type LanguageCardKey = "english" | "spanish" | "japanese" | "french" | "german" | "korean" | "chinese";

type LanguageDetail = {
  key: LanguageCardKey;
  code: string;
  languageCode: string;
  className: string;
  imageSrc: string;
};

const languageDetails: LanguageDetail[] = [
  { key: "english", code: "EN", languageCode: "en", className: "language-english", imageSrc: "/images/languages/english-speaking-practice-v2.webp" },
  { key: "spanish", code: "ES", languageCode: "es", className: "language-spanish", imageSrc: "/images/languages/spanish-speaking-practice-v2.webp" },
  { key: "japanese", code: "JP", languageCode: "ja", className: "language-japanese", imageSrc: "/images/languages/japanese-speaking-practice-v2.webp" },
  { key: "french", code: "FR", languageCode: "fr", className: "language-french", imageSrc: "/images/languages/french-speaking-practice-v2.webp" },
  { key: "german", code: "DE", languageCode: "de", className: "language-german", imageSrc: "/images/languages/german-speaking-practice-v2.webp" },
  { key: "korean", code: "KR", languageCode: "ko", className: "language-korean", imageSrc: "/images/languages/korean-speaking-practice-v2.webp" },
  { key: "chinese", code: "ZH", languageCode: "zh-CN", className: "language-chinese", imageSrc: "/images/languages/chinese-speaking-practice-v2.webp" }
];

type HeroLanguage = {
  code: string;
  name: string;
  flag: string;
  speechLang: string;
  question: string;
  hesitation: string;
  natural: string;
  followUp: string;
};

const heroLanguages: HeroLanguage[] = [
  { code: "en", name: "English", flag: "us", speechLang: "en-US", question: "What did you do last weekend?", hesitation: "I… went to… um…", natural: "I went hiking with some friends.", followUp: "That sounds great! What was the best part of the trip?" },
  { code: "es", name: "Spanish", flag: "es", speechLang: "es-ES", question: "¿Qué hiciste el fin de semana?", hesitation: "Yo… fui a… eh…", natural: "Fui de excursión con unos amigos.", followUp: "¡Qué bien! ¿Cuál fue la mejor parte del viaje?" },
  { code: "fr", name: "French", flag: "fr", speechLang: "fr-FR", question: "Qu'est-ce que tu as fait ce week-end ?", hesitation: "Je… suis allé… euh…", natural: "Je suis allé faire une randonnée avec des amis.", followUp: "Ça a l'air super ! Quel a été le meilleur moment ?" },
  { code: "de", name: "German", flag: "de", speechLang: "de-DE", question: "Was hast du letztes Wochenende gemacht?", hesitation: "Ich… bin… äh…", natural: "Ich war mit Freunden wandern.", followUp: "Das klingt schön! Was war der beste Teil?" },
  { code: "ja", name: "Japanese", flag: "jp", speechLang: "ja-JP", question: "週末は何をしましたか？", hesitation: "えっと…友達と…", natural: "友達とハイキングに行きました。", followUp: "楽しそうですね！一番よかったことは何ですか？" }
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
  const { sections } = dictionary;
  const ui = homeUiCopy[locale];
  const heroLangs = [
    { code: "en", name: "English", flag: "us" },
    { code: "es", name: "Spanish", flag: "es" },
    { code: "fr", name: "French", flag: "fr" },
    { code: "de", name: "German", flag: "de" },
    { code: "ja", name: "Japanese", flag: "jp" }
  ];
  const [heroLang, setHeroLang] = useState("en");  const scenarioTitles: Record<Locale, string[]> = {
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
  const startHref = `${localizedPath(locale, "/login")}?next=${encodeURIComponent(`${localizedPath(locale, "/app")}?learningLanguage=${targetLanguage}`)}`;

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
                <ButtonLink href={startHref} eventName="home_cta_clicked" eventProperties={{ placement: "hero", cta: "primary", destination: "login", locale, target_language: targetLanguage }}>
                  {dictionary.hero.primaryCta}<ArrowRight size={16} aria-hidden="true" />
                </ButtonLink>
                <span className="home-v1-trial-note">{(dictionary.hero.proof ?? ["1-minute free conversation", "No credit card required"]).map((item) => <span key={item}><Check size={13} />{item}</span>)}</span>
              </div>
            </div>
            <HeroConversationDemo language={heroLang} dictionary={dictionary} />
          </div>
        </section>

        <section className="home-v1-how-strip" id="home-features" aria-label="How it works">
          <div className="home-v1-how-intro"><span className="home-v1-kicker">{dictionary.sections.learn.eyebrow}</span><h2>{dictionary.sections.learn.h2}</h2><p>{dictionary.sections.learn.lead}</p></div>
          <div className="home-v1-how-steps">{[
            [BriefcaseBusiness, "Tell It", "Explain what you mean in your own words."],
            [Lightbulb, "Get Help", "Your AI tutor gives you a natural expression."],
            [Volume2, "Say It", "Listen, repeat, and practice saying it."],
            [MessageCircle, "Keep Talking", "Use it in the conversation and build your confidence."]
          ].map(([Icon, title, description], index) => { const StepIcon = Icon as LucideIcon; return <div className="home-v1-how-step" key={title as string}><span className="home-v1-how-icon"><StepIcon size={25} /></span><strong><i>{`0${index + 1}`}</i>{title as string}</strong><p>{description as string}</p></div>; })}</div>
        </section>

        <section className="home-v1-scenarios" id="home-practice">
          <div className="home-v1-section-heading"><h2>{dictionary.sections.personal.h2}</h2><p>{dictionary.sections.personal.lead}</p></div>
          <div className="home-v1-scenario-grid">{[[scenarioTitles[locale][0], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app?scenario=english-job-interview", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=60", scenarioBadge, BriefcaseBusiness],
            [scenarioTitles[locale][1], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=60", "", Headphones],
            [scenarioTitles[locale][2], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app?scenario=english-travel-conversation", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=60", "", Plane],
            [scenarioTitles[locale][3], dictionary.sections.personal.lead, dictionary.sections.cta.primaryCta, "/app", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=60", "", MessageCircle]].map(([title, description, cta, href, image, badge, Icon]) => { const ScenarioIcon = Icon as LucideIcon; return <Link className={`home-v1-scenario-card ${badge ? "is-popular" : ""}`} href={localizedPath(locale, href as string)} key={title as string}><div className="home-v1-scenario-image"><img src={image as string} alt="" loading="lazy" />{badge ? <span>{badge as string}</span> : null}<em><ScenarioIcon size={17} /></em></div><div className="home-v1-scenario-body"><h3>{title as string}</h3><p>{description as string}</p><strong>{cta as string}<ArrowRight size={14} /></strong></div></Link>; })}</div>
        </section>

        <section className="home-v1-duo" aria-label="Help and languages">
          <article className="home-v1-duo-card home-v1-unstuck">
            <div className="home-v1-unstuck-media"><img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=520&q=60" alt="Learner getting unstuck with AI tutor" loading="lazy" /><span className="home-v1-unstuck-bubble top">I want to go hiking this weekend.</span><span className="home-v1-unstuck-bubble mid">Here&apos;s a natural way to say it: &ldquo;I&apos;m planning to go hiking this weekend.&rdquo;</span></div>
            <div className="home-v1-unstuck-copy"><span className="home-v1-kicker">{dictionary.sections.modes.eyebrow}</span><h2>{dictionary.sections.modes.h2}</h2><p>{dictionary.sections.modes.lead}</p><ul>{dictionary.sections.modes.items.map((item) => <li key={item.title}><Check size={14} />{item.title}</li>)}</ul></div>
          </article>
          <article className="home-v1-duo-card home-v1-mini-langs" id="home-languages">
            <span className="home-v1-kicker">{dictionary.sections.languages.eyebrow}</span><h2>{dictionary.sections.languages.h2}</h2><p>{dictionary.sections.languages.lead}</p>
            <div className="home-v1-mini-lang-grid">{[{ c: "us", n: "English" }, { c: "es", n: "Spanish" }, { c: "jp", n: "Japanese" }, { c: "fr", n: "French" }, { c: "de", n: "German" }, { c: "kr", n: "Korean" }, { c: "cn", n: "Chinese" }, { c: "th", n: "Thai" }].map((l) => <span key={l.n}><img src={`https://flagcdn.com/w40/${l.c}.png`} alt="" loading="lazy" /><b>{l.n}</b></span>)}</div>
            <Link href={localizedPath(locale, "/app?chooseLanguage=1")}>{viewAllLanguagesCopy[locale]} <ArrowRight size={13} /></Link>
          </article>
        </section>

        <section className="home-v1-learning-section"><div className="home-v1-learning-copy"><h2>{dictionary.sections.lesson.h2}</h2><div className="home-v1-learning-points">{[
          [Sparkles, "Natural Corrections", "See a more natural way to express yourself."],
          [BookOpen, "Useful Phrases", "Save expressions you can use right away."],
          [MessageCircle, "Vocabulary", "Build your vocabulary step by step."],
          [Mic, "Review & Practice", "Revisit your conversations and keep improving."]
        ].map(([Icon, title, description]) => { const FeatureIcon = Icon as LucideIcon; return <div key={title as string}><span><FeatureIcon size={17} /></span><strong>{title as string}</strong><p>{description as string}</p></div>; })}</div></div><ConversationSummaryCard /></section>

        <section className="home-v1-betterway" aria-label="A better way">
          <div className="home-v1-betterway-main"><span className="home-v1-kicker">{dictionary.sections.why.eyebrow}</span><h2>{dictionary.sections.why.h2}</h2><div className="home-v1-betterway-grid">{dictionary.sections.why.cards.map((card) => <div key={card.title}><span><Check size={14} /></span><strong>{card.title}</strong><p>{card.description}</p></div>)}</div></div>
          <div className="home-v1-betterway-photo" aria-hidden="true"><span className="home-v1-hero-robot-shadow" aria-hidden="true" /><img className="home-v1-betterway-robot" src="/images/ai-tutor-robot.png" alt="" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /></div>
        </section>

        <section className="home-v1-final-cta"><div className="home-v1-final-text"><h2>{dictionary.sections.cta.h2}</h2><p>{dictionary.sections.cta.lead}</p><div className="home-v1-final-row"><ButtonLink href={localizedPath(locale, "/login")} eventName="home_cta_clicked" eventProperties={{ placement: "final", cta: "primary", destination: "login", locale }}>{dictionary.sections.cta.primaryCta}<ArrowRight size={15} /></ButtonLink><small><Check size={12} />{(dictionary.hero.proof ?? ["No credit card required", "Free conversation included"]).join(" · ")}</small></div></div><div className="home-v1-final-steps"><div><span><BriefcaseBusiness size={15} /></span><b>Choose a scenario</b><ArrowRight size={13} /></div><div><span><Lightbulb size={15} /></span><b>Start talking</b><ArrowRight size={13} /></div><div><span><MessageCircle size={15} /></span><b>Get help when you&apos;re stuck</b></div></div></section>
      </main>
      <HomeFooter dictionary={dictionary} locale={locale} />
    </div>
  );
}

function HeroConversationDemo({ language, dictionary }: { language: string; dictionary: LandingDictionary }) {
  const selected = heroLanguages.find((item) => item.code === language) ?? heroLanguages[0];
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selected.natural);
    utterance.lang = selected.speechLang;
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
    <header><span className="home-v1-demo-logo"><span>▮</span> AI Language Tutor</span><span className="home-v1-demo-lang"><img src={`https://flagcdn.com/w40/${selected.flag}.png`} alt="" />{selected.name}</span><span className="home-v1-demo-head-actions" aria-hidden="true">✈ ···</span></header>
    <div className="home-v1-demo-chat"><div className="home-v1-demo-line tutor"><span className="home-v1-demo-avatar">AI</span><div><p>{selected.question}</p></div></div><div className="home-v1-demo-line learner"><p>{selected.hesitation}</p></div>
      <div className="home-v1-help-card"><strong><Lightbulb size={17} />{dictionary.demo.responseLabel}</strong><span>{dictionary.demo.promptLabel}:</span><b>“{selected.natural}”</b><div><button type="button" onClick={speak}><Volume2 size={14} />{dictionary.demo.actions[0]}</button><button type="button" onClick={speak}><Mic size={14} />{dictionary.demo.actions[1]}</button></div></div>
      <div className="home-v1-demo-line tutor follow-up"><span className="home-v1-demo-avatar">AI</span><div><p>{selected.followUp}</p></div></div></div>
    <button className="home-v1-demo-mic" type="button" onClick={speak} aria-label={dictionary.demo.actions[0]}><Mic size={22} /></button><small className="home-v1-demo-tap">{dictionary.demo.turn}</small>
  </div><figure className="home-v1-hero-robot"><span className="home-v1-robot-note" aria-hidden="true">Your AI tutor<br />is here to help.</span><span className="home-v1-robot-bubble" aria-hidden="true"><i /><i /><i /><i /></span><span className="home-v1-hero-robot-shadow" aria-hidden="true" /><img className="home-v1-hero-robot-img" src="/images/ai-tutor-robot.png" alt="AI tutor robot" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /><span className="home-v1-robot-eq" aria-hidden="true"><i /><i /><i /><i /><i /></span></figure></div>;
}

function ConversationSummaryCard() {
  return <div className="home-v1-summary-wrap"><div className="home-v1-summary-card"><header><span>‹</span><strong>Conversation Summary</strong><span>◌</span></header><nav><b>Phrases</b><span>Corrections</span><span>New Words</span></nav><article className="home-v1-summary-item"><span className="home-v1-summary-check"><Check size={12} /></span><div><strong>It was a great experience.</strong><small>Natural expression</small></div><ArrowRight size={13} /></article><article className="home-v1-summary-item"><span className="home-v1-summary-check"><Check size={12} /></span><div><strong>I really enjoyed the trip.</strong><small>Saved phrase</small></div><ArrowRight size={13} /></article></div><span className="home-v1-summary-spark spark-a">✧</span><span className="home-v1-summary-spark spark-b">✦</span></div>;
}

function HomeFooter({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const ui = homeUiCopy[locale];
  const columns = [
    { title: "Product", links: [{ label: "Home", href: localizedPath(locale, "/") }, { label: "Languages", href: "#home-languages" }, { label: "Practice", href: "#home-practice" }, { label: "Pricing", href: localizedPath(locale, "/pricing") }] },
    { title: "Company", links: [{ label: "About Us", href: localizedPath(locale, "/company/about") }, { label: "Blog", href: localizedPath(locale, "/learn/blog") }, { label: "Contact", href: localizedPath(locale, "/contact") }] },
    { title: "Support", links: [{ label: "Help Center", href: localizedPath(locale, "/contact") }, { label: "Privacy Policy", href: localizedPath(locale, "/privacy") }, { label: "Terms of Service", href: localizedPath(locale, "/terms") }] }
  ];

  return (
    <footer className="home-v1-footer">
      <div className="home-v1-container home-v1-footer-grid">
        <div className="home-v1-footer-brand">
          <Link href={localizedPath(locale, "/")}>
            <span className="home-v1-brand-mark"><img src="/arno.svg" alt="" /></span>
            <strong>AI Language Tutor</strong>
          </Link>
          <p>{ui.footerDescription}</p>
        </div>
        {columns.map((column) => (
          <FooterColumn key={column.title} title={column.title} items={column.links} locale={locale} />
        ))}
        <small className="home-v1-footer-copyright">© 2025 AI Language Tutor. {dictionary.footer.rights}</small>
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
