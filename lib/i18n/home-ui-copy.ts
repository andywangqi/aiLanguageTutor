import type { Locale } from "./config";

export type HomeUiCopy = {
  brandHome: string;
  openMenu: string;
  closeMenu: string;
  productBenefits: string;
  speakingBenefit: { title: string; description: string };
  progressBenefit: { title: string; description: string };
  coreFeatures: string;
  featureActions: [string, string, string];
  conversationFallback: string;
  helpKicker: string;
  helpActions: [string, string, string];
  helpExample: string;
  you: string;
  english: string;
  suggestionLead: string;
  listen: string;
  practice: string;
  whyChooseUs: string;
  faq: string;
  personalizedPractice: string;
  tryAgain: string;
  footerDescription: string;
};

export const homeUiCopy: Record<Locale, HomeUiCopy> = {
  en: {
    brandHome: "AI Language Tutor home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    productBenefits: "Product benefits",
    speakingBenefit: { title: "Learn by speaking", description: "Get corrections and learn useful expressions." },
    progressBenefit: { title: "Track your progress", description: "Review what you learned and keep improving." },
    coreFeatures: "Core features",
    featureActions: ["Start talking", "Learn more", "Try it now"],
    conversationFallback: "Keep the conversation moving.",
    helpKicker: "Stuck? No problem",
    helpActions: ["Explain", "Translate", "Practice"],
    helpExample: "Example of getting help",
    you: "You",
    english: "English",
    suggestionLead: "You could say:",
    listen: "Listen",
    practice: "Practice",
    whyChooseUs: "Why choose us",
    faq: "FAQ",
    personalizedPractice: "Personalized practice",
    tryAgain: "Try it again",
    footerDescription: "Practice speaking with an AI tutor and improve your language skills in real conversations."
  },
  ja: {
    brandHome: "AI Language Tutor ホーム",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    productBenefits: "製品の特長",
    speakingBenefit: { title: "話して身につける", description: "添削を受けながら、役立つ表現を学べます。" },
    progressBenefit: { title: "上達を確認", description: "学んだ内容を復習し、着実に伸ばせます。" },
    coreFeatures: "主な機能",
    featureActions: ["会話を始める", "詳しく見る", "今すぐ試す"],
    conversationFallback: "会話をそのまま続けましょう。",
    helpKicker: "言葉に詰まっても大丈夫",
    helpActions: ["解説", "翻訳", "練習"],
    helpExample: "会話中に助けを求める例",
    you: "あなた",
    english: "英語",
    suggestionLead: "こう言えます：",
    listen: "聞く",
    practice: "練習",
    whyChooseUs: "選ばれる理由",
    faq: "よくある質問",
    personalizedPractice: "あなたに合った練習",
    tryAgain: "もう一度試す",
    footerDescription: "AI Tutor と実際の会話を練習しながら、語学力と話す自信を伸ばせます。"
  },
  th: {
    brandHome: "หน้าหลัก AI Language Tutor",
    openMenu: "เปิดเมนู",
    closeMenu: "ปิดเมนู",
    productBenefits: "ประโยชน์ของผลิตภัณฑ์",
    speakingBenefit: { title: "เรียนรู้ด้วยการพูด", description: "รับคำแก้ไขและเรียนรู้สำนวนที่ใช้ได้จริง" },
    progressBenefit: { title: "ติดตามความก้าวหน้า", description: "ทบทวนสิ่งที่เรียนและพัฒนาต่อเนื่อง" },
    coreFeatures: "ฟีเจอร์หลัก",
    featureActions: ["เริ่มสนทนา", "ดูเพิ่มเติม", "ลองตอนนี้"],
    conversationFallback: "สนทนาต่อได้เลย",
    helpKicker: "คิดคำไม่ออกก็ไม่เป็นไร",
    helpActions: ["อธิบาย", "แปล", "ฝึก"],
    helpExample: "ตัวอย่างการขอความช่วยเหลือ",
    you: "คุณ",
    english: "ภาษาอังกฤษ",
    suggestionLead: "คุณพูดแบบนี้ได้:",
    listen: "ฟัง",
    practice: "ฝึก",
    whyChooseUs: "ทำไมถึงเลือกเรา",
    faq: "คำถามที่พบบ่อย",
    personalizedPractice: "การฝึกที่เหมาะกับคุณ",
    tryAgain: "ลองอีกครั้ง",
    footerDescription: "ฝึกพูดกับ AI Tutor ผ่านบทสนทนาจริง เพื่อพัฒนาทักษะภาษาและความมั่นใจ"
  },
  ko: {
    brandHome: "AI Language Tutor 홈",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    productBenefits: "제품 장점",
    speakingBenefit: { title: "말하면서 배우기", description: "교정을 받고 실용적인 표현을 익히세요." },
    progressBenefit: { title: "학습 진도 확인", description: "배운 내용을 복습하며 꾸준히 성장하세요." },
    coreFeatures: "주요 기능",
    featureActions: ["대화 시작", "자세히 보기", "지금 체험하기"],
    conversationFallback: "대화를 계속 이어가세요.",
    helpKicker: "막혀도 괜찮아요",
    helpActions: ["설명", "번역", "연습"],
    helpExample: "도움받기 예시",
    you: "나",
    english: "영어",
    suggestionLead: "이렇게 말할 수 있어요:",
    listen: "듣기",
    practice: "연습",
    whyChooseUs: "선택하는 이유",
    faq: "자주 묻는 질문",
    personalizedPractice: "맞춤형 연습",
    tryAgain: "다시 해보기",
    footerDescription: "AI 튜터와 실제 대화를 연습하며 언어 실력과 말하기 자신감을 키워보세요."
  },
  "zh-CN": {
    brandHome: "AI Language Tutor 首页",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    productBenefits: "产品优势",
    speakingBenefit: { title: "在表达中学习", description: "获得纠正，并掌握实用表达。" },
    progressBenefit: { title: "跟踪学习进度", description: "复习学过的内容，持续进步。" },
    coreFeatures: "核心功能",
    featureActions: ["开始对话", "了解更多", "立即体验"],
    conversationFallback: "继续把对话聊下去。",
    helpKicker: "卡住了也没关系",
    helpActions: ["解释", "翻译", "练习"],
    helpExample: "在对话中求助的示例",
    you: "你",
    english: "英语",
    suggestionLead: "你可以这样说：",
    listen: "收听",
    practice: "练习",
    whyChooseUs: "为什么选择我们",
    faq: "常见问题",
    personalizedPractice: "个性化练习",
    tryAgain: "再试一次",
    footerDescription: "和 AI 导师练习真实对话，在开口交流中提升语言能力和表达信心。"
  },
  "zh-TW": {
    brandHome: "AI Language Tutor 首頁",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    productBenefits: "產品優勢",
    speakingBenefit: { title: "在表達中學習", description: "獲得修正，並掌握實用表達。" },
    progressBenefit: { title: "追蹤學習進度", description: "複習學過的內容，持續進步。" },
    coreFeatures: "核心功能",
    featureActions: ["開始對話", "瞭解更多", "立即體驗"],
    conversationFallback: "繼續把對話聊下去。",
    helpKicker: "卡住了也沒關係",
    helpActions: ["解釋", "翻譯", "練習"],
    helpExample: "在對話中求助的範例",
    you: "你",
    english: "英語",
    suggestionLead: "你可以這樣說：",
    listen: "聆聽",
    practice: "練習",
    whyChooseUs: "為什麼選擇我們",
    faq: "常見問題",
    personalizedPractice: "個人化練習",
    tryAgain: "再試一次",
    footerDescription: "和 AI 導師練習真實對話，在開口交流中提升語言能力與表達信心。"
  },
  es: {
    brandHome: "Inicio de AI Language Tutor",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    productBenefits: "Ventajas del producto",
    speakingBenefit: { title: "Aprende hablando", description: "Recibe correcciones y aprende expresiones útiles." },
    progressBenefit: { title: "Sigue tu progreso", description: "Repasa lo aprendido y continúa mejorando." },
    coreFeatures: "Funciones principales",
    featureActions: ["Empezar a hablar", "Más información", "Probar ahora"],
    conversationFallback: "Mantén viva la conversación.",
    helpKicker: "¿Te bloqueaste? No pasa nada",
    helpActions: ["Explicar", "Traducir", "Practicar"],
    helpExample: "Ejemplo de cómo pedir ayuda",
    you: "Tú",
    english: "Inglés",
    suggestionLead: "Puedes decir:",
    listen: "Escuchar",
    practice: "Practicar",
    whyChooseUs: "Por qué elegirnos",
    faq: "Preguntas frecuentes",
    personalizedPractice: "Práctica personalizada",
    tryAgain: "Intentarlo de nuevo",
    footerDescription: "Practica conversaciones reales con un tutor de AI y mejora tu nivel y tu confianza al hablar."
  }
};
