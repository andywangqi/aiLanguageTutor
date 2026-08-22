import type { LandingDictionary } from "./types";

const baseEn: LandingDictionary = {
  locale: "en",
  seo: {
    title: "AI Language Tutor | Speak, Learn & Improve with AI",
    description:
      "Practice real conversations with an AI language tutor. Learn how to say things naturally, get instant corrections, and improve your speaking skills."
  },
  nav: {
    product: "Product",
    method: "Method",
    languages: "Languages",
    faq: "FAQ",
    app: "Start Talking"
  },
  hero: {
    eyebrow: "AI language tutor for speaking practice",
    h1: "Your AI Language Tutor for Real Conversations",
    lead:
      "Speak in the language you're learning, get instant corrections, and learn how to express yourself naturally.",
    primaryCta: "Start Talking — Free",
    secondaryCta: "Try the demo"
  },
  demo: {
    title: "Try your AI tutor",
    tabs: {
      sayIt: "Say It",
      talk: "Talk"
    },
    promptLabel: "You",
    prompt: "I might be late tomorrow.",
    responseLabel: "AI Tutor",
    response: "Natural. You can also say: “I may be running a little late tomorrow.”",
    actions: ["Listen", "Translation", "Practice"],
    turn: "Your turn",
    hint: "Practice the sentence out loud and get feedback."
  },
  sections: {
    learn: {
      eyebrow: "Learn to Speak, Not Just Study",
      h2: "Learn to Speak, Not Just Study",
      lead:
        "Practice real conversations with an AI tutor and learn how to express yourself naturally in the language you want to speak.",
      cards: [
        {
          title: "Speak from day one",
          description:
            "Start with real things you want to say. Your tutor helps you form the sentence, say it, and improve it."
        },
        {
          title: "Understand the correction",
          description:
            "See what changed and why, from grammar and vocabulary to more natural everyday expressions."
        },
        {
          title: "Practice until it feels natural",
          description:
            "Repeat useful phrases in context so they become easier to remember and use in conversation."
        }
      ]
    },
    modes: {
      eyebrow: "Say It. Talk. Improve.",
      h2: "Say It. Talk. Improve.",
      lead:
        "Use two simple modes: ask how to say something, then move into a conversation that adapts to your level.",
      items: [
        {
          title: "Say It",
          description:
            "Tell your tutor what you want to say in your own language. Learn the natural way to say it, then practice speaking it."
        },
        {
          title: "Talk",
          description:
            "Have a real conversation in the language you're learning. Your AI tutor adapts to your level and keeps the conversation going."
        }
      ]
    },
    corrections: {
      eyebrow: "Instant speaking feedback",
      h2: "Your AI Tutor Corrects You as You Speak",
      lead:
        "This is more than a chatbot. Your tutor listens for mistakes, gives useful corrections, and helps you sound more natural.",
      points: ["Grammar", "Vocabulary", "Natural expressions", "Pronunciation"]
    },
    stuck: {
      eyebrow: "Stuck? Just Ask Your Tutor",
      h2: "Stuck? Just Ask Your Tutor",
      lead:
        "Don't know how to say something? Ask your tutor in your own language. Get a natural answer, an explanation, and a chance to say it yourself.",
      points: [
        "Ask in your own language when you get stuck",
        "Get the natural expression, not a word-by-word translation",
        "Practice the answer out loud right away"
      ]
    },
    lesson: {
      eyebrow: "Every Conversation Becomes a Lesson",
      h2: "Every Conversation Becomes a Lesson",
      lead:
        "You don't need to study a lesson before you can speak. Your conversations create the lessons you need.",
      steps: ["New words", "Mistakes", "Corrections", "Practice", "Progress"]
    },
    personal: {
      eyebrow: "Personalized language learning",
      h2: "Your Personal AI Language Tutor",
      lead:
        "Your tutor remembers your level, notices your mistakes, and keeps each conversation challenging without becoming overwhelming.",
      stats: [
        { label: "Speaking pace", value: "Adaptive" },
        { label: "Correction style", value: "Natural" },
        { label: "Practice focus", value: "Personal" }
      ]
    },
    languages: {
      eyebrow: "Language SEO foundation",
      h2: "Practice English, Spanish, Japanese & More",
      lead:
        "Start with the languages your learners care about most. Each language can grow into a focused SEO landing page later.",
      items: ["English", "Spanish", "Japanese", "French", "German", "Korean"]
    },
    why: {
      eyebrow: "Why Learn with an AI Tutor?",
      h2: "Why Learn with an AI Tutor?",
      lead:
        "AI language learning works best when practice, correction, pronunciation, and personalized progress happen in the same place.",
      cards: [
        {
          title: "Always available",
          description: "Practice when you have five minutes, without scheduling a class."
        },
        {
          title: "Personalized practice",
          description: "Focus on the grammar, vocabulary, and pronunciation you actually need."
        },
        {
          title: "Real conversation",
          description: "Build confidence by speaking about your work, travel, life, and ideas."
        }
      ]
    },
    faq: {
      eyebrow: "Frequently Asked Questions",
      h2: "Frequently Asked Questions",
      lead:
        "Answers to common questions about AI language tutors, speaking practice, corrections, and learning a language with AI.",
      items: [
        {
          question: "Is there an AI language tutor?",
          answer:
            "Yes. An AI language tutor can help you practice conversations, correct your grammar and vocabulary, explain natural expressions, and guide your speaking practice."
        },
        {
          question: "Are AI language tutors good?",
          answer:
            "AI language tutors are useful for regular practice, instant feedback, and personalized review. They work best when you use them to speak, correct mistakes, and repeat useful phrases."
        },
        {
          question: "Do AI language tutors work?",
          answer:
            "They can help you improve when you practice consistently. The most useful flow is conversation, feedback, explanation, and another chance to say it better."
        },
        {
          question: "How can I use AI to learn a language?",
          answer:
            "Use AI to practice real conversations, ask how to say things naturally, get corrections, review pronunciation, and turn your mistakes into short lessons."
        },
        {
          question: "Is there a free AI language tutor?",
          answer:
            "Many AI language tutor apps offer a free way to start. This site is designed around a free first speaking session so learners can try the tutor immediately."
        }
      ]
    },
    cta: {
      h2: "Start Talking Today",
      lead: "Open your AI tutor, say one real sentence, and turn it into speaking practice.",
      primaryCta: "Start Talking — Free",
      secondaryCta: "See how it works"
    }
  },
  footer: {
    brand: "AI Language Tutor",
    rights: "© 2026 AI Language Tutor. All rights reserved.",
    columns: [
      { title: "Product", links: ["Say It", "Talk", "Corrections", "Open App"] },
      { title: "Learning", links: ["AI language tutor", "Speaking practice", "Pronunciation practice", "Personalized learning"] },
      { title: "Languages", links: ["Learn English", "Learn Spanish", "Learn Japanese", "Learn Korean"] },
      { title: "Company", links: ["Contact", "Privacy", "Terms"] }
    ]
  }
};

export const dictionaries: Record<LandingDictionary["locale"], LandingDictionary> = {
  en: baseEn,
  ja: {
    ...baseEn,
    locale: "ja",
    seo: {
      title: "AI Language Tutor | AIで話して学ぶ語学チューター",
      description:
        "AI語学チューターと実際の会話を練習。自然な言い方、即時添削、スピーキング力の向上をサポートします。"
    },
    nav: { product: "製品", method: "メソッド", languages: "言語", faq: "FAQ", app: "アプリを開く" },
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
        eyebrow: "Say It. Talk. Improve.",
        h2: "言ってみる。話す。上達する。"
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
    seo: {
      title: "AI Language Tutor | ฝึกพูดและพัฒนาภาษาด้วย AI",
      description:
        "ฝึกสนทนาจริงกับติวเตอร์ภาษา AI เรียนรู้การพูดให้เป็นธรรมชาติ รับคำแก้ไขทันที และพัฒนาทักษะการพูด"
    },
    nav: { product: "ผลิตภัณฑ์", method: "วิธีเรียน", languages: "ภาษา", faq: "FAQ", app: "เปิดแอป" },
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
    seo: {
      title: "AI Language Tutor | AI와 말하며 배우는 언어 튜터",
      description:
        "AI 언어 튜터와 실제 대화를 연습하세요. 자연스러운 표현, 즉각적인 교정, 말하기 실력 향상을 도와줍니다."
    },
    nav: { product: "제품", method: "방법", languages: "언어", faq: "FAQ", app: "앱 열기" },
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
    seo: {
      title: "AI Language Tutor | 用 AI 开口练语言",
      description:
        "和 AI 语言导师练习真实对话，学习更自然的表达，获得即时纠错，并提升你的口语能力。"
    },
    nav: { product: "产品", method: "方法", languages: "语言", faq: "常见问题", app: "打开应用" },
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
    seo: {
      title: "AI Language Tutor | 用 AI 開口練語言",
      description:
        "和 AI 語言導師練習真實對話，學習更自然的表達，獲得即時修正，並提升口說能力。"
    },
    nav: { product: "產品", method: "方法", languages: "語言", faq: "常見問題", app: "打開應用" },
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
    seo: {
      title: "AI Language Tutor | Habla, aprende y mejora con AI",
      description:
        "Practica conversaciones reales con un tutor de idiomas con AI. Aprende expresiones naturales, recibe correcciones al instante y mejora tu speaking."
    },
    nav: { product: "Producto", method: "Método", languages: "Idiomas", faq: "FAQ", app: "Abrir app" },
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

export function getDictionary(locale: LandingDictionary["locale"]): LandingDictionary {
  return dictionaries[locale];
}
