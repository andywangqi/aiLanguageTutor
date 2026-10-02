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
  chrome: {
    chooseLanguage: string;
    getHelp: string;
    languages: string;
    helpAlt: string;
    tutorHere: string;
  };
  contentHub: {
    eyebrow: string;
    h2: string;
    lead: string;
    groups: Array<{
      title: string;
      links: Array<{ label: string; description: string; href: string }>;
    }>;
  };
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
    footerDescription: "Practice speaking with an AI tutor and improve your language skills in real conversations.",
    chrome: {
      chooseLanguage: "Choose a language",
      getHelp: "Help",
      languages: "Languages",
      helpAlt: "Learner getting unstuck with the AI tutor",
      tutorHere: "Your AI tutor is here to help."
    },
    contentHub: {
      eyebrow: "Keep learning",
      h2: "Guides, Topics & Practice Routines",
      lead: "Short guides and practice pages to help you speak more, get unstuck faster, and build a daily habit.",
      groups: [
        {
          title: "Practice",
          links: [
            { label: "Talk with your AI tutor", description: "Real conversations that keep you speaking.", href: "/practice/talk" },
            { label: "Get help mid-sentence", description: "Ask in your own language, get a natural phrase.", href: "/practice/get-help" },
            { label: "Pronunciation practice", description: "Speak into the mic, get instant feedback.", href: "/practice/pronunciation" },
            { label: "Vocabulary from your chats", description: "Save and review words you actually used.", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "Learn",
          links: [
            { label: "120 conversation topics", description: "Work, travel, small talk — pick one and start.", href: "/learn/conversation-topics" },
            { label: "Tips for practising alone", description: "12 practical ways to build a speaking habit solo.", href: "/learn/learning-tips" },
            { label: "Daily practice guide", description: "A step-by-step routine you can repeat every day.", href: "/learn/practice-guide" },
            { label: "Blog", description: "Speaking tips, practice guides, and learning notes.", href: "/learn/blog" }
          ]
        },
        {
          title: "English practice scenarios",
          links: [
            { label: "IELTS speaking practice", description: "Cue cards, follow-ups, and natural answers.", href: "/learn/ielts-speaking" },
            { label: "Job interview English", description: "Practise common questions and confident answers.", href: "/learn/english-job-interview" },
            { label: "Travel conversation", description: "Airports, hotels, restaurants, and asking for help.", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
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
    footerDescription: "AI Tutor と実際の会話を練習しながら、語学力と話す自信を伸ばせます。",
    chrome: {
      chooseLanguage: "練習する言語を選ぶ",
      getHelp: "ヘルプ",
      languages: "対応言語",
      helpAlt: "AI Tutor の助けを借りて、言葉に詰まっている学習者",
      tutorHere: "あなたの AI Tutor がそばにいます。"
    },
    contentHub: {
      eyebrow: "学びを続ける",
      h2: "ガイド・トピック・練習ルーティン",
      lead: "話す量を増やし、詰まりを早く解消し、毎日の習慣を作るための短いガイドと練習ページです。",
      groups: [
        {
          title: "練習",
          links: [
            { label: "AI Tutor と話す", description: "話し続けられる本物の会話。", href: "/practice/talk" },
            { label: "文中で助けを求める", description: "母語で尋ねて、自然なフレーズを受け取る。", href: "/practice/get-help" },
            { label: "発音練習", description: "マイクに話して、すぐにフィードバック。", href: "/practice/pronunciation" },
            { label: "会話からの語彙", description: "実際に使った単語を保存して復習。", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "学ぶ",
          links: [
            { label: "120 の会話トピック", description: "仕事、旅行、雑談 — ひとつ選んで始める。", href: "/learn/conversation-topics" },
            { label: "一人で練習するコツ", description: "一人で話す習慣を作る12の実践的な方法。", href: "/learn/learning-tips" },
            { label: "毎日の練習ガイド", description: "毎日繰り返せるステップバイステップのルーティン。", href: "/learn/practice-guide" },
            { label: "ブログ", description: "スピーキングのコツ、練習ガイド、学習ノート。", href: "/learn/blog" }
          ]
        },
        {
          title: "英語練習シーン",
          links: [
            { label: "IELTS スピーキング練習", description: "キューカード、フォローアップ、自然な回答。", href: "/learn/ielts-speaking" },
            { label: "就職面接の英語", description: "よくある質問と自信のある答え方を練習。", href: "/learn/english-job-interview" },
            { label: "旅行会話", description: "空港、ホテル、レストラン、助けを求める場面。", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
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
    footerDescription: "ฝึกพูดกับ AI Tutor ผ่านบทสนทนาจริง เพื่อพัฒนาทักษะภาษาและความมั่นใจ",
    chrome: {
      chooseLanguage: "เลือกภาษาที่อยากฝึก",
      getHelp: "ความช่วยเหลือ",
      languages: "ภาษาที่รองรับ",
      helpAlt: "ผู้เรียนที่กำลังติดขัดและได้รับความช่วยเหลือจาก AI Tutor",
      tutorHere: "AI Tutor ของคุณพร้อมช่วยอยู่ตรงนี้"
    },
    contentHub: {
      eyebrow: "เรียนต่อ",
      h2: "คู่มือ หัวข้อ และกิจวัตรฝึกพูด",
      lead: "คู่มือและหน้าฝึกสั้น ๆ ที่ช่วยให้พูดมากขึ้น แก้คำติดได้เร็ว และสร้างนิสัยการฝึกทุกวัน",
      groups: [
        {
          title: "ฝึก",
          links: [
            { label: "คุยกับ AI Tutor", description: "บทสนทนาจริงที่ทำให้คุณพูดต่อได้เรื่อย ๆ", href: "/practice/talk" },
            { label: "ขอความช่วยเหลือกลางประโยค", description: "ถามเป็นภาษาของคุณ รับวลีที่เป็นธรรมชาติ", href: "/practice/get-help" },
            { label: "ฝึกออกเสียง", description: "พูดเข้าไมค์ รับฟีดแบ็กทันที", href: "/practice/pronunciation" },
            { label: "คำศัพท์จากบทสนทนา", description: "บันทึกและทบทวนคำที่ใช้จริง", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "เรียนรู้",
          links: [
            { label: "120 หัวข้อสนทนา", description: "งาน ท่องเที่ยว small talk — เลือกแล้วเริ่มพูด", href: "/learn/conversation-topics" },
            { label: "เคล็ดลับฝึกคนเดียว", description: "12 วิธีสร้างนิสัยการพูดด้วยตัวเอง", href: "/learn/learning-tips" },
            { label: "คู่มือฝึกรายวัน", description: "ขั้นตอนที่ทำซ้ำได้ทุกวัน", href: "/learn/practice-guide" },
            { label: "บล็อก", description: "เคล็ดลับการพูด คู่มือฝึก และบันทึกการเรียนรู้", href: "/learn/blog" }
          ]
        },
        {
          title: "สถานการณ์ฝึกภาษาอังกฤษ",
          links: [
            { label: "ฝึกพูด IELTS", description: "คิวการ์ด คำถามต่อเนื่อง และคำตอบที่เป็นธรรมชาติ", href: "/learn/ielts-speaking" },
            { label: "ภาษาอังกฤษสัมภาษณ์งาน", description: "ฝึกคำถามที่พบบ่อยและตอบอย่างมั่นใจ", href: "/learn/english-job-interview" },
            { label: "บทสนทนาท่องเที่ยว", description: "สนามบิน โรงแรม ร้านอาหาร และการขอความช่วยเหลือ", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
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
    footerDescription: "AI 튜터와 실제 대화를 연습하며 언어 실력과 말하기 자신감을 키워보세요.",
    chrome: {
      chooseLanguage: "연습할 언어 선택",
      getHelp: "도움말",
      languages: "지원 언어",
      helpAlt: "AI 튜터의 도움으로 막힘을 해소하는 학습자",
      tutorHere: "당신의 AI 튜터가 곁에서 도와드려요."
    },
    contentHub: {
      eyebrow: "계속 배우기",
      h2: "가이드, 토픽 & 연습 루틴",
      lead: "더 많이 말하고, 막힘을 빨리 풀고, 매일 습관을 만드는 짧은 가이드와 연습 페이지.",
      groups: [
        {
          title: "연습",
          links: [
            { label: "AI 튜터와 대화하기", description: "계속 말하게 만드는 진짜 대화.", href: "/practice/talk" },
            { label: "문장 중간에 도움받기", description: "모국어로 묻고, 자연스러운 표현 받기.", href: "/practice/get-help" },
            { label: "발음 연습", description: "마이크에 말하고 즉시 피드백 받기.", href: "/practice/pronunciation" },
            { label: "대화에서 나온 어휘", description: "실제로 쓴 단어를 저장하고 복습.", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "배우기",
          links: [
            { label: "120개 회화 토픽", description: "직장, 여행, 스몰토크 — 하나 골라 시작.", href: "/learn/conversation-topics" },
            { label: "혼자 연습하는 팁", description: "혼자서 말하기 습관을 만드는 12가지 실용적인 방법.", href: "/learn/learning-tips" },
            { label: "매일 연습 가이드", description: "매일 반복할 수 있는 단계별 루틴.", href: "/learn/practice-guide" },
            { label: "블로그", description: "스피킹 팁, 연습 가이드, 학습 노트.", href: "/learn/blog" }
          ]
        },
        {
          title: "영어 연습 시나리오",
          links: [
            { label: "IELTS 스피킹 연습", description: "큐카드, 후속 질문, 자연스러운 답변.", href: "/learn/ielts-speaking" },
            { label: "면접 영어", description: "자주 묻는 질문과 자신감 있는 답변 연습.", href: "/learn/english-job-interview" },
            { label: "여행 회화", description: "공항, 호텔, 식당, 도움 요청하기.", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
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
    footerDescription: "和 AI 导师练习真实对话，在开口交流中提升语言能力和表达信心。",
    chrome: {
      chooseLanguage: "选择要练习的语言",
      getHelp: "求助",
      languages: "支持的语言",
      helpAlt: "在 AI 导师帮助下摆脱卡壳的学习者",
      tutorHere: "你的 AI 导师随时帮忙。"
    },
    contentHub: {
      eyebrow: "继续学习",
      h2: "指南、话题与练习流程",
      lead: "短指南和练习页,帮你多说、更快摆脱卡壳、养成每日开口的习惯。",
      groups: [
        {
          title: "练习",
          links: [
            { label: "和 AI 导师对话", description: "让你不停开口的真实对话。", href: "/practice/talk" },
            { label: "说了一半卡住时求助", description: "用自己的语言问,拿到自然的说法。", href: "/practice/get-help" },
            { label: "发音练习", description: "对着麦克风说,立刻拿到反馈。", href: "/practice/pronunciation" },
            { label: "对话里攒下的词汇", description: "把真正用过的词存下来复习。", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "学习",
          links: [
            { label: "120 个对话话题", description: "职场、旅行、闲聊 — 挑一个就开口。", href: "/learn/conversation-topics" },
            { label: "一个人练口语的技巧", description: "12 个独自养成开口习惯的实用方法。", href: "/learn/learning-tips" },
            { label: "每日练习指南", description: "一套每天都能重复的分步流程。", href: "/learn/practice-guide" },
            { label: "博客", description: "口语技巧、练习指南和学习笔记。", href: "/learn/blog" }
          ]
        },
        {
          title: "英语练习场景",
          links: [
            { label: "IELTS 口语练习", description: "题卡、追问和自然的回答。", href: "/learn/ielts-speaking" },
            { label: "求职面试英语", description: "练习常见问题和有底气的回答。", href: "/learn/english-job-interview" },
            { label: "旅行对话", description: "机场、酒店、餐厅和求助场景。", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
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
    footerDescription: "和 AI 導師練習真實對話，在開口交流中提升語言能力與表達信心。",
    chrome: {
      chooseLanguage: "選擇要練習的語言",
      getHelp: "求助",
      languages: "支援的語言",
      helpAlt: "在 AI 導師幫助下擺脫卡關的學習者",
      tutorHere: "你的 AI 導師隨時幫忙。"
    },
    contentHub: {
      eyebrow: "繼續學習",
      h2: "指南、話題與練習流程",
      lead: "短指南和練習頁,幫你多說、更快擺脫卡關、養成每日開口的習慣。",
      groups: [
        {
          title: "練習",
          links: [
            { label: "和 AI 導師對話", description: "讓你不停開口的真實對話。", href: "/practice/talk" },
            { label: "說到一半卡住時求助", description: "用自己的語言問,拿到自然的說法。", href: "/practice/get-help" },
            { label: "發音練習", description: "對著麥克風說,立刻拿到回饋。", href: "/practice/pronunciation" },
            { label: "對話裡累積的詞彙", description: "把真正用過的詞存起來複習。", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "學習",
          links: [
            { label: "120 個對話話題", description: "職場、旅行、閒聊 — 挑一個就開口。", href: "/learn/conversation-topics" },
            { label: "一個人練口說的技巧", description: "12 個獨自養成開口習慣的實用方法。", href: "/learn/learning-tips" },
            { label: "每日練習指南", description: "一套每天都能重複的分步流程。", href: "/learn/practice-guide" },
            { label: "部落格", description: "口說技巧、練習指南和學習筆記。", href: "/learn/blog" }
          ]
        },
        {
          title: "英語練習情境",
          links: [
            { label: "IELTS 口說練習", description: "題卡、追問和自然的回答。", href: "/learn/ielts-speaking" },
            { label: "求職面試英語", description: "練習常見問題和有底氣的回答。", href: "/learn/english-job-interview" },
            { label: "旅行對話", description: "機場、飯店、餐廳和求助情境。", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
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
    footerDescription: "Practica conversaciones reales con un tutor de AI y mejora tu nivel y tu confianza al hablar.",
    chrome: {
      chooseLanguage: "Elige un idioma",
      getHelp: "Ayuda",
      languages: "Idiomas",
      helpAlt: "Estudiante superando un bloqueo con la ayuda del tutor de IA",
      tutorHere: "Tu tutor de IA está aquí para ayudarte."
    },
    contentHub: {
      eyebrow: "Sigue aprendiendo",
      h2: "Guías, temas y rutinas de práctica",
      lead: "Guías cortas y páginas de práctica para hablar más, desbloquearte antes y crear el hábito diario.",
      groups: [
        {
          title: "Práctica",
          links: [
            { label: "Habla con tu tutor de IA", description: "Conversaciones reales que te mantienen hablando.", href: "/practice/talk" },
            { label: "Ayuda a media frase", description: "Pregunta en tu idioma y recibe una frase natural.", href: "/practice/get-help" },
            { label: "Práctica de pronunciación", description: "Habla al micrófono y recibe feedback al instante.", href: "/practice/pronunciation" },
            { label: "Vocabulario de tus conversaciones", description: "Guarda y repasa las palabras que usaste.", href: "/practice/vocabulary" }
          ]
        },
        {
          title: "Aprender",
          links: [
            { label: "120 temas de conversación", description: "Trabajo, viajes, small talk — elige uno y empieza.", href: "/learn/conversation-topics" },
            { label: "Consejos para practicar solo", description: "12 formas prácticas de crear el hábito por tu cuenta.", href: "/learn/learning-tips" },
            { label: "Guía de práctica diaria", description: "Una rutina paso a paso que puedes repetir cada día.", href: "/learn/practice-guide" },
            { label: "Blog", description: "Consejos de speaking, guías de práctica y notas de aprendizaje.", href: "/learn/blog" }
          ]
        },
        {
          title: "Escenarios de práctica de inglés",
          links: [
            { label: "Práctica de speaking IELTS", description: "Cue cards, follow-ups y respuestas naturales.", href: "/learn/ielts-speaking" },
            { label: "Inglés para entrevistas", description: "Practica preguntas comunes y respuestas con confianza.", href: "/learn/english-job-interview" },
            { label: "Conversación de viaje", description: "Aeropuertos, hoteles, restaurantes y pedir ayuda.", href: "/learn/english-travel-conversation" }
          ]
        }
      ]
    }
  }
};
