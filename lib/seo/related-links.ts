import type { Locale } from "@/lib/i18n/config";

// T05: 每个 /learn/* 与 /practice/* 内容页底部的互链配置。
// 每条目出链到其他内容页,目标是让每个内容页站内入链 ≥3 条。
// 键为当前页路径,值为推荐的其他内容页路径(展示文案见 relatedCopy)。
export const relatedLinksMap: Record<string, string[]> = {
  "/practice/talk": ["/practice/get-help", "/learn/conversation-topics", "/learn/practice-guide"],
  "/practice/get-help": ["/practice/talk", "/learn/learning-tips", "/learn/conversation-topics"],
  "/practice/pronunciation": ["/practice/talk", "/practice/get-help", "/learn/practice-guide"],
  "/practice/vocabulary": ["/practice/talk", "/learn/conversation-topics", "/learn/learning-tips"],
  "/learn/conversation-topics": ["/practice/talk", "/learn/learning-tips", "/learn/practice-guide"],
  "/learn/learning-tips": ["/learn/practice-guide", "/practice/talk", "/learn/conversation-topics"],
  "/learn/practice-guide": ["/practice/talk", "/learn/learning-tips", "/learn/conversation-topics"],
  "/learn/blog": ["/learn/learning-tips", "/learn/practice-guide", "/practice/talk"]
};

type RelatedCopy = {
  heading: string;
  items: Record<string, { label: string; description: string }>;
};

export const relatedCopy: Record<Locale, RelatedCopy> = {
  en: {
    heading: "Keep practising",
    items: {
      "/practice/talk": { label: "Talk with your AI tutor", description: "Real conversations that keep you speaking." },
      "/practice/get-help": { label: "Get help mid-sentence", description: "Ask in your own language, get a natural phrase." },
      "/practice/pronunciation": { label: "Pronunciation practice", description: "Speak into the mic, get instant feedback." },
      "/practice/vocabulary": { label: "Vocabulary from your chats", description: "Save and review words you actually used." },
      "/learn/conversation-topics": { label: "120 conversation topics", description: "Work, travel, small talk — pick one and start." },
      "/learn/learning-tips": { label: "Tips for practising alone", description: "12 practical ways to build a speaking habit solo." },
      "/learn/practice-guide": { label: "Daily practice guide", description: "A step-by-step routine you can repeat every day." },
      "/learn/blog": { label: "Blog", description: "Speaking tips, practice guides, and learning notes." }
    }
  },
  ja: {
    heading: "練習を続ける",
    items: {
      "/practice/talk": { label: "AI Tutor と話す", description: "話し続けられる本物の会話。" },
      "/practice/get-help": { label: "文中で助けを求める", description: "母語で尋ねて、自然なフレーズを受け取る。" },
      "/practice/pronunciation": { label: "発音練習", description: "マイクに話して、すぐにフィードバック。" },
      "/practice/vocabulary": { label: "会話からの語彙", description: "実際に使った単語を保存して復習。" },
      "/learn/conversation-topics": { label: "120 の会話トピック", description: "仕事、旅行、雑談 — ひとつ選んで始める。" },
      "/learn/learning-tips": { label: "一人で練習するコツ", description: "一人で話す習慣を作る12の実践的な方法。" },
      "/learn/practice-guide": { label: "毎日の練習ガイド", description: "毎日繰り返せるステップバイステップのルーティン。" },
      "/learn/blog": { label: "ブログ", description: "スピーキングのコツ、練習ガイド、学習ノート。" }
    }
  },
  th: {
    heading: "ฝึกต่อ",
    items: {
      "/practice/talk": { label: "คุยกับ AI Tutor", description: "บทสนทนาจริงที่ทำให้คุณพูดต่อได้เรื่อย ๆ" },
      "/practice/get-help": { label: "ขอความช่วยเหลือกลางประโยค", description: "ถามเป็นภาษาของคุณ รับวลีที่เป็นธรรมชาติ" },
      "/practice/pronunciation": { label: "ฝึกออกเสียง", description: "พูดเข้าไมค์ รับฟีดแบ็กทันที" },
      "/practice/vocabulary": { label: "คำศัพท์จากบทสนทนา", description: "บันทึกและทบทวนคำที่ใช้จริง" },
      "/learn/conversation-topics": { label: "120 หัวข้อสนทนา", description: "งาน ท่องเที่ยว small talk — เลือกแล้วเริ่มพูด" },
      "/learn/learning-tips": { label: "เคล็ดลับฝึกคนเดียว", description: "12 วิธีสร้างนิสัยการพูดด้วยตัวเอง" },
      "/learn/practice-guide": { label: "คู่มือฝึกรายวัน", description: "ขั้นตอนที่ทำซ้ำได้ทุกวัน" },
      "/learn/blog": { label: "บล็อก", description: "เคล็ดลับการพูด คู่มือฝึก และบันทึกการเรียนรู้" }
    }
  },
  ko: {
    heading: "계속 연습하기",
    items: {
      "/practice/talk": { label: "AI 튜터와 대화하기", description: "계속 말하게 만드는 진짜 대화." },
      "/practice/get-help": { label: "문장 중간에 도움받기", description: "모국어로 묻고, 자연스러운 표현 받기." },
      "/practice/pronunciation": { label: "발음 연습", description: "마이크에 말하고 즉시 피드백 받기." },
      "/practice/vocabulary": { label: "대화에서 나온 어휘", description: "실제로 쓴 단어를 저장하고 복습." },
      "/learn/conversation-topics": { label: "120개 회화 토픽", description: "직장, 여행, 스몰토크 — 하나 골라 시작." },
      "/learn/learning-tips": { label: "혼자 연습하는 팁", description: "혼자서 말하기 습관을 만드는 12가지 실용적인 방법." },
      "/learn/practice-guide": { label: "매일 연습 가이드", description: "매일 반복할 수 있는 단계별 루틴." },
      "/learn/blog": { label: "블로그", description: "스피킹 팁, 연습 가이드, 학습 노트." }
    }
  },
  "zh-CN": {
    heading: "继续练习",
    items: {
      "/practice/talk": { label: "和 AI 导师对话", description: "让你不停开口的真实对话。" },
      "/practice/get-help": { label: "说了一半卡住时求助", description: "用自己的语言问,拿到自然的说法。" },
      "/practice/pronunciation": { label: "发音练习", description: "对着麦克风说,立刻拿到反馈。" },
      "/practice/vocabulary": { label: "对话里攒下的词汇", description: "把真正用过的词存下来复习。" },
      "/learn/conversation-topics": { label: "120 个对话话题", description: "职场、旅行、闲聊 — 挑一个就开口。" },
      "/learn/learning-tips": { label: "一个人练口语的技巧", description: "12 个独自养成开口习惯的实用方法。" },
      "/learn/practice-guide": { label: "每日练习指南", description: "一套每天都能重复的分步流程。" },
      "/learn/blog": { label: "博客", description: "口语技巧、练习指南和学习笔记。" }
    }
  },
  "zh-TW": {
    heading: "繼續練習",
    items: {
      "/practice/talk": { label: "和 AI 導師對話", description: "讓你不停開口的真實對話。" },
      "/practice/get-help": { label: "說到一半卡住時求助", description: "用自己的語言問,拿到自然的說法。" },
      "/practice/pronunciation": { label: "發音練習", description: "對著麥克風說,立刻拿到回饋。" },
      "/practice/vocabulary": { label: "對話裡累積的詞彙", description: "把真正用過的詞存起來複習。" },
      "/learn/conversation-topics": { label: "120 個對話話題", description: "職場、旅行、閒聊 — 挑一個就開口。" },
      "/learn/learning-tips": { label: "一個人練口說的技巧", description: "12 個獨自養成開口習慣的實用方法。" },
      "/learn/practice-guide": { label: "每日練習指南", description: "一套每天都能重複的分步流程。" },
      "/learn/blog": { label: "部落格", description: "口說技巧、練習指南和學習筆記。" }
    }
  },
  es: {
    heading: "Sigue practicando",
    items: {
      "/practice/talk": { label: "Habla con tu tutor de IA", description: "Conversaciones reales que te mantienen hablando." },
      "/practice/get-help": { label: "Ayuda a media frase", description: "Pregunta en tu idioma y recibe una frase natural." },
      "/practice/pronunciation": { label: "Práctica de pronunciación", description: "Habla al micrófono y recibe feedback al instante." },
      "/practice/vocabulary": { label: "Vocabulario de tus conversaciones", description: "Guarda y repasa las palabras que usaste." },
      "/learn/conversation-topics": { label: "120 temas de conversación", description: "Trabajo, viajes, small talk — elige uno y empieza." },
      "/learn/learning-tips": { label: "Consejos para practicar solo", description: "12 formas prácticas de crear el hábito por tu cuenta." },
      "/learn/practice-guide": { label: "Guía de práctica diaria", description: "Una rutina paso a paso que puedes repetir cada día." },
      "/learn/blog": { label: "Blog", description: "Consejos de speaking, guías de práctica y notas de aprendizaje." }
    }
  }
};

// T05: 博客文章末尾固定推荐的两个产品页(不动 CMS 数据,前端兜底)。
export const blogProductLinksMap: Record<Locale, Array<{ label: string; description: string; href: string }>> = {
  en: [
    { label: "Try a free conversation", description: "Open the workbench and start talking with your AI tutor.", href: "/practice/talk" },
    { label: "Get help mid-sentence", description: "Ask in your own language, get a natural phrase.", href: "/practice/get-help" }
  ],
  ja: [
    { label: "無料で会話を試す", description: "ワークベンチを開いて、AI Tutor と話し始めましょう。", href: "/practice/talk" },
    { label: "文中で助けを求める", description: "母語で尋ねて、自然なフレーズを受け取る。", href: "/practice/get-help" }
  ],
  th: [
    { label: "ลองสนทนาฟรี", description: "เปิดเวิร์กเบนช์แล้วเริ่มคุยกับ AI Tutor", href: "/practice/talk" },
    { label: "ขอความช่วยเหลือกลางประโยค", description: "ถามเป็นภาษาของคุณ รับวลีที่เป็นธรรมชาติ", href: "/practice/get-help" }
  ],
  ko: [
    { label: "무료 대화 체험하기", description: "워크벤치를 열고 AI 튜터와 대화를 시작하세요.", href: "/practice/talk" },
    { label: "문장 중간에 도움받기", description: "모국어로 묻고, 자연스러운 표현 받기.", href: "/practice/get-help" }
  ],
  "zh-CN": [
    { label: "免费试一次对话", description: "打开工作台,开始和 AI 导师聊起来。", href: "/practice/talk" },
    { label: "说了一半卡住时求助", description: "用自己的语言问,拿到自然的说法。", href: "/practice/get-help" }
  ],
  "zh-TW": [
    { label: "免費試一次對話", description: "打開工作台,開始和 AI 導師聊起來。", href: "/practice/talk" },
    { label: "說到一半卡住時求助", description: "用自己的語言問,拿到自然的說法。", href: "/practice/get-help" }
  ],
  es: [
    { label: "Prueba una conversación gratis", description: "Abre el workbench y empieza a hablar con tu tutor de IA.", href: "/practice/talk" },
    { label: "Ayuda a media frase", description: "Pregunta en tu idioma y recibe una frase natural.", href: "/practice/get-help" }
  ]
};
