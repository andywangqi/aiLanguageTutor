import type { LandingDictionary } from "./types";
import { getLandingSections } from "./landing-copy";
import { getProductCopy } from "./product-copy";
import { repeatCopy, positioning, trialLabels } from "./practice-copy";

const baseEn: LandingDictionary = {
  locale: "en",
  seo: {
    title: "AI Language Tutor | Speak Naturally in Real Conversations",
    description:
      "Practice speaking with an AI language tutor. When you get stuck, get help saying what you mean, then practice it in a real conversation and learn natural phrases."
  },
  nav: {
    product: "Product",
    method: "How it works",
    languages: "Languages",
    faq: "FAQ",
    app: "Start Talking"
  },
  hero: {
    eyebrow: "AI Language Tutor · Real Conversation Practice",
    h1: "AI Language Tutor for Real Conversations",
    lead:
      "Know what you want to say. Learn how to say it naturally with help from your AI language tutor. Practice in real conversations and save useful phrases for next time.",
    primaryCta: "Start Speaking Free",
    secondaryCta: "See how it works",
    proof: ["1-minute free conversation", "No credit card required"]
  },
  demo: {
    title: "Try your AI tutor",
    tabs: {
      sayIt: "Say It",
      talk: "Talk",
      practice: "Practice"
    },
    promptLabel: "You",
    prompt: "I might be late tomorrow.",
    responseLabel: "AI Tutor",
    response: "I might be late tomorrow.",
    actions: ["Listen", "Translation", "Learn"],
    turn: "Your turn",
    hint: "Long-press to speak, then release to send."
  },
  sections: {
    learn: {
      eyebrow: "Language conversation practice",
      h2: "Practice Speaking Through Real Conversations",
      lead: "Talk with your AI tutor, get help when you get stuck, and keep speaking in the language you're learning.",
      cards: [
        {
          title: "Talk",
          description: "Have a real conversation while your tutor responds naturally and keeps the exchange moving."
        },
        {
          title: "Get Help",
          description: "When you do not know how to say something, explain what you mean in your own language."
        },
        {
          title: "Say It Again",
          description: "Learn the natural expression, practice it out loud, and return to the conversation."
        }
      ]
    },
    modes: {
      eyebrow: "Get Help",
      h2: "Don't Know How to Say It? Get Help and Keep Talking.",
      lead:
        "Tell your tutor what you mean in your own language. Get a natural expression in the language you're learning, then use it in the next turn.",
      items: [
        {
          title: "Help me say it",
          description: "Explain the idea in your own language and get the natural expression immediately."
        },
        {
          title: "Continue",
          description: "Practice the phrase, then let your tutor ask a follow-up question and keep the conversation alive."
        }
      ]
    },
    corrections: {
      eyebrow: "Corrections",
      h2: "Improve Your Language as You Speak",
      lead: "Get useful corrections while you practice, so you can understand mistakes and use better expressions in your next reply.",
      points: ["Grammar", "Vocabulary", "Natural expressions", "Pronunciation"]
    },
    stuck: {
      eyebrow: "Pronunciation Practice",
      h2: "Listen, Speak, and Improve Your Pronunciation",
      lead:
        "Listen to the tutor, say the phrase yourself, and get focused feedback that helps you speak more clearly.",
      points: [
        "Listen to the tutor",
        "Repeat the phrase",
        "Get speaking feedback",
        "Try again"
      ]
    },
    lesson: {
      eyebrow: "Vocabulary",
      h2: "Learn Useful Words From Your Conversations",
      lead: "Your conversations introduce words and phrases that actually fit what you are trying to say.",
      steps: ["New words", "Useful phrases", "Practice", "Review", "Progress"]
    },
    personal: {
      eyebrow: "Review",
      h2: "Review What You Learned",
      lead: "Keep useful phrases, corrections, and words from your conversations in one place so you can practice them again later.",
      stats: [
        { label: "Review focus", value: "Past tense" },
        { label: "Practice style", value: "Personal" },
        { label: "Speaking pace", value: "Adaptive" }
      ]
    },
    languages: {
      eyebrow: "Languages",
      h2: "Learn the Language You Want to Speak",
      lead: "Practice conversations in the language you are learning, starting with the languages your learners care about most.",
      items: ["English", "Spanish", "Japanese", "Korean", "Chinese", "French", "German"]
    },
    why: {
      eyebrow: "Why learn with an AI tutor",
      h2: "Why Practice With an AI Language Tutor?",
      lead: "Practice travel, work, interviews, small talk, and everyday conversations whenever you want, at your own level.",
      cards: [
        {
          title: "Practice real situations",
          description: "Prepare for travel, work, interviews, and everyday small talk with conversations that feel useful."
        },
        {
          title: "Learn at your level",
          description: "Practice with conversations and support that match your current ability."
        },
        {
          title: "Speak without pressure",
          description: "Make mistakes, ask for help, and try again while your tutor adapts to your pace."
        }
      ]
    },
    faq: {
      eyebrow: "Frequently Asked Questions About AI Language Tutors",
      h2: "Frequently Asked Questions About AI Language Tutors",
      lead: "Answers to the most common questions about trying the tutor, speaking in your own language, and practicing out loud.",
      items: [
        {
          question: "What is an AI Language Tutor?",
          answer:
            "An AI language tutor is a learning tool that lets you practice a language through real-time voice or text conversations. It can explain natural expressions, correct mistakes, and help you continue when you get stuck."
        },
        {
          question: "How does an AI Language Tutor work?",
          answer:
            "Choose the language you want to learn and start a conversation. You can speak in your native language when you need help, or practice directly in your target language."
        },
        {
          question: "Can I speak in my native language?",
          answer:
            "Yes. When you do not know how to express something in your target language, you can say it in your native language and your AI tutor can respond in the language you're learning."
        },
        {
          question: "Can I practice conversations with an AI tutor?",
          answer:
            "Yes. You can role-play useful situations such as ordering food, checking into a hotel, joining a meeting, preparing for an interview, or making everyday small talk."
        },
        {
          question: "Can I listen to the AI tutor?",
          answer:
            "Yes. Your tutor can speak its responses so you can listen, repeat, and practice pronunciation."
        },
        {
          question: "What languages can I learn?",
          answer:
            "Start with the languages your learners care about most, then expand to more supported languages over time."
        },
        {
          question: "Is AI Language Tutor free?",
          answer:
            "You can try your first one-minute AI conversation for free without a credit card. Paid plans are available for longer and unlimited practice."
        }
      ]
    },
    cta: {
      h2: "Start Speaking Today",
      lead: "Try your first AI language conversation free, then keep practicing when you're ready.",
      primaryCta: "Start Speaking Free",
      secondaryCta: "View plans"
    }
  },
  footer: {
    brand: "AI Language Tutor",
    rights: "© 2026 AI Language Tutor. All rights reserved.",
    columns: [
      { title: "Practice", links: ["Talk", "Get Help", "Pronunciation", "Vocabulary"] },
      { title: "Learn", links: ["Conversation Topics", "Learning Tips", "Practice Guide", "Blog"] },
      { title: "Company", links: ["About Us", "Contact", "Careers"] },
      { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookies"] }
    ]
  },
  product: getProductCopy("en")
};

export const dictionaries: Record<LandingDictionary["locale"], LandingDictionary> = {
  en: baseEn,
  ja: {
    ...baseEn,
    locale: "ja",
    product: getProductCopy("ja"),
    seo: {
      title: "AI Language Tutor | AIで話して学ぶ語学チューター",
      description:
        "AI語学チューターと実際の会話を練習。自然な言い方、即時添削、スピーキング力の向上をサポートします。"
    },
    nav: { product: "製品", method: "メソッド", languages: "言語", faq: "FAQ", app: "話してみる" },
    hero: {
      eyebrow: "スピーキング練習のためのAI語学チューター",
      h1: "リアルな会話のためのAI Language Tutor",
      lead: "学習中の言語で話し、すぐに添削を受け、自然な表現を身につけましょう。",
      primaryCta: "無料で話し始める",
      secondaryCta: "デモを見る"
    },
    sections: {
      ...baseEn.sections,
      learn: {
        ...baseEn.sections.learn,
        eyebrow: "勉強だけでなく、話せるように",
        h2: "勉強だけでなく、話せるように",
        lead: "AIチューターと実際の会話を練習し、自分の言いたいことを自然に表現できるようにします。"
      },
      modes: {
        ...baseEn.sections.modes,
        eyebrow: "Say It. Talk. Practice.",
        h2: "言ってみる。話す。練習する。"
      },
      corrections: { ...baseEn.sections.corrections, h2: "話しながらAIチューターが添削します" },
      stuck: { ...baseEn.sections.stuck, h2: "困ったら、チューターに聞くだけ" },
      lesson: { ...baseEn.sections.lesson, h2: "すべての会話がレッスンになります" },
      personal: { ...baseEn.sections.personal, h2: "あなた専用のAI語学チューター" },
      languages: { ...baseEn.sections.languages, h2: "英語、スペイン語、日本語などを練習" },
      why: { ...baseEn.sections.why, h2: "AIチューターで学ぶ理由" },
      faq: { ...baseEn.sections.faq, h2: "よくある質問" },
      cta: { ...baseEn.sections.cta, h2: "今日から話し始めましょう", primaryCta: "無料で話し始める" }
    }
  },
  th: {
    ...baseEn,
    locale: "th",
    product: getProductCopy("th"),
    seo: {
      title: "AI Language Tutor | ฝึกพูดและพัฒนาภาษาด้วย AI",
      description:
        "ฝึกสนทนาจริงกับติวเตอร์ภาษา AI เรียนรู้การพูดให้เป็นธรรมชาติ รับคำแก้ไขทันที และพัฒนาทักษะการพูด"
    },
    nav: { product: "ผลิตภัณฑ์", method: "วิธีเรียน", languages: "ภาษา", faq: "FAQ", app: "เริ่มพูด" },
    hero: {
      eyebrow: "ติวเตอร์ภาษา AI สำหรับฝึกพูด",
      h1: "AI Language Tutor สำหรับบทสนทนาจริง",
      lead: "พูดภาษาที่คุณกำลังเรียน รับคำแก้ไขทันที และเรียนรู้วิธีสื่อสารอย่างเป็นธรรมชาติ",
      primaryCta: "เริ่มพูดฟรี",
      secondaryCta: "ลองเดโม"
    },
    sections: {
      ...baseEn.sections,
      learn: { ...baseEn.sections.learn, h2: "เรียนเพื่อพูดได้ ไม่ใช่แค่ท่องจำ" },
      modes: { ...baseEn.sections.modes, h2: "พูดสิ่งที่อยากพูด สนทนา แล้วพัฒนา" },
      corrections: { ...baseEn.sections.corrections, h2: "AI Tutor แก้ให้ขณะคุณพูด" },
      stuck: { ...baseEn.sections.stuck, h2: "ติดตรงไหน ถาม Tutor ได้เลย" },
      lesson: { ...baseEn.sections.lesson, h2: "ทุกบทสนทนากลายเป็นบทเรียน" },
      personal: { ...baseEn.sections.personal, h2: "AI Language Tutor ส่วนตัวของคุณ" },
      languages: { ...baseEn.sections.languages, h2: "ฝึกอังกฤษ สเปน ญี่ปุ่น และอีกมากมาย" },
      why: { ...baseEn.sections.why, h2: "ทำไมควรเรียนกับ AI Tutor?" },
      faq: { ...baseEn.sections.faq, h2: "คำถามที่พบบ่อย" },
      cta: { ...baseEn.sections.cta, h2: "เริ่มพูดวันนี้", primaryCta: "เริ่มพูดฟรี" }
    }
  },
  ko: {
    ...baseEn,
    locale: "ko",
    product: getProductCopy("ko"),
    seo: {
      title: "AI Language Tutor | AI와 말하며 배우는 언어 튜터",
      description:
        "AI 언어 튜터와 실제 대화를 연습하세요. 자연스러운 표현, 즉각적인 교정, 말하기 실력 향상을 도와줍니다."
    },
    nav: { product: "제품", method: "방법", languages: "언어", faq: "FAQ", app: "말하기 시작" },
    hero: {
      eyebrow: "말하기 연습을 위한 AI 언어 튜터",
      h1: "실전 대화를 위한 AI Language Tutor",
      lead: "배우는 언어로 말하고, 즉시 교정을 받고, 자연스럽게 표현하는 법을 익히세요.",
      primaryCta: "무료로 말하기 시작",
      secondaryCta: "데모 보기"
    },
    sections: {
      ...baseEn.sections,
      learn: { ...baseEn.sections.learn, h2: "공부만 하지 말고 말하는 법을 배우세요" },
      modes: { ...baseEn.sections.modes, h2: "말하고, 대화하고, 개선하세요" },
      corrections: { ...baseEn.sections.corrections, h2: "말하는 동안 AI 튜터가 교정합니다" },
      stuck: { ...baseEn.sections.stuck, h2: "막히면 튜터에게 물어보세요" },
      lesson: { ...baseEn.sections.lesson, h2: "모든 대화가 수업이 됩니다" },
      personal: { ...baseEn.sections.personal, h2: "나만의 AI 언어 튜터" },
      languages: { ...baseEn.sections.languages, h2: "영어, 스페인어, 일본어 등을 연습하세요" },
      why: { ...baseEn.sections.why, h2: "왜 AI 튜터로 배울까요?" },
      faq: { ...baseEn.sections.faq, h2: "자주 묻는 질문" },
      cta: { ...baseEn.sections.cta, h2: "오늘 말하기 시작하세요", primaryCta: "무료로 시작" }
    }
  },
  "zh-CN": {
    ...baseEn,
    locale: "zh-CN",
    product: getProductCopy("zh-CN"),
    seo: {
      title: "AI Language Tutor | 用 AI 开口练语言",
      description:
        "和 AI 语言导师练习真实对话，学习更自然的表达，获得即时纠错，并提升你的口语能力。"
    },
    nav: { product: "产品", method: "方法", languages: "语言", faq: "常见问题", app: "免费开始对话" },
    hero: {
      eyebrow: "用于口语练习的 AI 语言导师",
      h1: "面向真实对话的 AI Language Tutor",
      lead: "用你正在学习的语言开口说，获得即时纠错，并学习如何更自然地表达自己。",
      primaryCta: "免费开始开口练",
      secondaryCta: "试试演示"
    },
    sections: {
      ...baseEn.sections,
      learn: {
        ...baseEn.sections.learn,
        eyebrow: "学会开口，而不只是学习",
        h2: "学会开口，而不只是学习",
        lead: "和 AI 导师练习真实对话，学习如何用目标语言自然表达自己的想法。"
      },
      modes: { ...baseEn.sections.modes, h2: "想说。开口。进步。" },
      corrections: { ...baseEn.sections.corrections, h2: "你的 AI 导师会在你开口时纠正你" },
      stuck: { ...baseEn.sections.stuck, h2: "卡住了？直接问你的导师" },
      lesson: { ...baseEn.sections.lesson, h2: "每一次对话都会变成一节课" },
      personal: { ...baseEn.sections.personal, h2: "你的私人 AI 语言导师" },
      languages: { ...baseEn.sections.languages, h2: "练习英语、西班牙语、日语和更多语言" },
      why: { ...baseEn.sections.why, h2: "为什么用 AI 导师学语言？" },
      faq: { ...baseEn.sections.faq, h2: "常见问题" },
      cta: { ...baseEn.sections.cta, h2: "今天就开始开口", primaryCta: "免费开始开口练" }
    },
    footer: { ...baseEn.footer, rights: "© 2026 AI Language Tutor. 保留所有权利。" }
  },
  "zh-TW": {
    ...baseEn,
    locale: "zh-TW",
    product: getProductCopy("zh-TW"),
    seo: {
      title: "AI Language Tutor | 用 AI 開口練語言",
      description:
        "和 AI 語言導師練習真實對話，學習更自然的表達，獲得即時修正，並提升口說能力。"
    },
    nav: { product: "產品", method: "方法", languages: "語言", faq: "常見問題", app: "免費開始對話" },
    hero: {
      eyebrow: "用於口說練習的 AI 語言導師",
      h1: "面向真實對話的 AI Language Tutor",
      lead: "用你正在學習的語言開口說，獲得即時修正，並學會如何更自然地表達自己。",
      primaryCta: "免費開始開口練",
      secondaryCta: "試試示範"
    },
    sections: {
      ...baseEn.sections,
      learn: { ...baseEn.sections.learn, h2: "學會開口，而不只是學習" },
      modes: { ...baseEn.sections.modes, h2: "想說。開口。進步。" },
      corrections: { ...baseEn.sections.corrections, h2: "你的 AI 導師會在你開口時修正你" },
      stuck: { ...baseEn.sections.stuck, h2: "卡住了？直接問你的導師" },
      lesson: { ...baseEn.sections.lesson, h2: "每一次對話都會變成一堂課" },
      personal: { ...baseEn.sections.personal, h2: "你的私人 AI 語言導師" },
      languages: { ...baseEn.sections.languages, h2: "練習英語、西班牙語、日語和更多語言" },
      why: { ...baseEn.sections.why, h2: "為什麼用 AI 導師學語言？" },
      faq: { ...baseEn.sections.faq, h2: "常見問題" },
      cta: { ...baseEn.sections.cta, h2: "今天就開始開口", primaryCta: "免費開始開口練" }
    }
  },
  es: {
    ...baseEn,
    locale: "es",
    product: getProductCopy("es"),
    seo: {
      title: "AI Language Tutor | Habla, aprende y mejora con AI",
      description:
        "Practica conversaciones reales con un tutor de idiomas con IA. Aprende expresiones naturales, recibe correcciones al instante y mejora tu expresión oral."
    },
    nav: { product: "Producto", method: "Método", languages: "Idiomas", faq: "FAQ", app: "Empezar a hablar" },
    hero: {
      eyebrow: "Tutor de idiomas con AI para practicar speaking",
      h1: "Tu AI Language Tutor para conversaciones reales",
      lead: "Habla en el idioma que aprendes, recibe correcciones al instante y aprende a expresarte con naturalidad.",
      primaryCta: "Empieza gratis",
      secondaryCta: "Probar demo"
    },
    sections: {
      ...baseEn.sections,
      learn: { ...baseEn.sections.learn, h2: "Aprende a hablar, no solo a estudiar" },
      modes: { ...baseEn.sections.modes, h2: "Dilo. Habla. Mejora." },
      corrections: { ...baseEn.sections.corrections, h2: "Tu tutor con AI te corrige mientras hablas" },
      stuck: { ...baseEn.sections.stuck, h2: "¿Te bloqueaste? Pregunta a tu tutor" },
      lesson: { ...baseEn.sections.lesson, h2: "Cada conversación se convierte en una lección" },
      personal: { ...baseEn.sections.personal, h2: "Tu tutor personal de idiomas con AI" },
      languages: { ...baseEn.sections.languages, h2: "Practica inglés, español, japonés y más" },
      why: { ...baseEn.sections.why, h2: "¿Por qué aprender con un tutor de AI?" },
      faq: { ...baseEn.sections.faq, h2: "Preguntas frecuentes" },
      cta: { ...baseEn.sections.cta, h2: "Empieza a hablar hoy", primaryCta: "Empieza gratis" }
    }
  }
};

for (const locale of ["ja", "th", "ko", "zh-CN", "zh-TW", "es"] as const) {
  dictionaries[locale].sections = getLandingSections(locale);
}

export function getDictionary(locale: LandingDictionary["locale"]): LandingDictionary {
  const dictionary = dictionaries[locale];
  const feedback = repeatCopy[locale];
  const localized = locale === "en" ? null : positioning[locale];
  return {
    ...dictionary,
    seo: localized ? { title: localized.title, description: localized.description } : dictionary.seo,
    hero: { ...dictionary.hero, ...(localized ? { h1: localized.h1, lead: localized.description } : {}) },
    sections: {
      ...dictionary.sections,
      corrections: { ...dictionary.sections.corrections, h2: feedback.correction, lead: feedback.lead, points: [feedback.correction, feedback.label] },
      stuck: { ...dictionary.sections.stuck, eyebrow: feedback.label, h2: feedback.label, lead: feedback.note }
    }
  };
}
