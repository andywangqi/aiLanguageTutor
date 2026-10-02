import type { Locale } from "@/lib/i18n/config";

// T04: 各内容页的 SEO title / description 集中管理。
// 原则:title 55–60 字符、核心词靠前、品牌名用 | 收尾;description ≤160 字符,含搜索意图 + 利益点 + 行动号召。
// 页面 H1 仍由 content copy 决定,本表只影响 <title> 与 meta description。
type PageSeo = { title: string; description: string };

export const pageSeo: Record<string, Record<Locale, PageSeo>> = {
  "/practice/talk": {
    en: {
      title: "Free AI Conversation Practice: Speak English Every Day",
      description: "Have real conversations with an AI tutor that replies naturally and keeps you talking. Practice speaking English every day — free to start."
    },
    ja: {
      title: "無料AI英会話練習｜毎日続くスピーキング習慣",
      description: "自然に受け答えしてくれるAIチューターと本格的な会話練習。話す量が増えるほど上達します。無料で始められます。"
    },
    th: {
      title: "ฝึกสนทนาภาษาอังกฤษกับ AI ฟรี｜พูดได้ทุกวัน",
      description: "ฝึกบทสนทนาจริงกับ AI Tutor ที่ตอบโต้เป็นธรรมชาติและชวนคุยต่อ พูดภาษาอังกฤษทุกวัน เริ่มใช้ได้ฟรี"
    },
    ko: {
      title: "무료 AI 영어 회화 연습｜매일 영어로 말하기",
      description: "자연스럽게 응답하고 대화를 이어 주는 AI 튜터와 실제 회화를 연습하세요. 매일 영어 말하기, 무료로 시작할 수 있습니다."
    },
    "zh-CN": {
      title: "免费 AI 英语对话练习｜每天开口说英语",
      description: "和 AI 导师进行真实对话,导师自然回应、带着你聊下去。每天练习英语口语,免费开始。"
    },
    "zh-TW": {
      title: "免費 AI 英語對話練習｜每天開口說英語",
      description: "和 AI 導師進行真實對話,導師自然回應、帶著你聊下去。每天練習英語口說,免費開始。"
    },
    es: {
      title: "Práctica de conversación con IA gratis: habla inglés a diario",
      description: "Mantén conversaciones reales con un tutor de IA que responde con naturalidad y te anima a seguir hablando. Empieza gratis."
    }
  },
  "/practice/get-help": {
    en: {
      title: "Stuck Mid-Sentence? Get Natural English Phrasings Instantly",
      description: "Explain what you mean in your own language and get a natural English phrasing right inside the conversation. No pausing, no tab switching."
    },
    ja: {
      title: "言葉に詰まったら｜自然な英語表現をその場で提案",
      description: "母語で言いたいことを説明するだけ。会話の中で自然な英語表現がすぐに見つかります。画面を切り替える必要はありません。"
    },
    th: {
      title: "พูดไม่ออกกลางประโยค? รับวิธีพูดอังกฤษแบบธรรมชาติทันที",
      description: "อธิบายสิ่งที่อยากพูดเป็นภาษาของคุณ แล้วรับวิธีพูดภาษาอังกฤษที่เป็นธรรมชาติในบทสนทนาเดิม ไม่ต้องสลับหน้าจอ"
    },
    ko: {
      title: "문장 중간에 막혔나요? 자연스러운 영어 표현 바로 확인",
      description: "모국어로 하고 싶은 말을 설명하면 대화 안에서 자연스러운 영어 표현을 바로 받을 수 있습니다. 화면 전환 없이 계속 대화하세요."
    },
    "zh-CN": {
      title: "说了一半卡住?马上拿到自然的英语说法",
      description: "用自己的语言说明想表达的意思,对话中直接获得自然的英语表达。不用暂停,不用切出去查。"
    },
    "zh-TW": {
      title: "說到一半卡住?馬上取得自然的英語說法",
      description: "用自己的語言說明想表達的意思,對話中直接獲得自然的英語表達。不用暫停,不用切出去查。"
    },
    es: {
      title: "¿Trabado a media frase? Frases naturales en inglés al instante",
      description: "Explica lo que quieres decir en tu idioma y recibe una frase natural en inglés dentro de la conversación. Sin pausas ni cambios de pestaña."
    }
  },
  "/practice/pronunciation": {
    en: {
      title: "English Pronunciation Practice With Real-Time AI Feedback",
      description: "Practise English pronunciation by speaking into your mic and comparing what you said with the target sentence. Get instant feedback on every attempt. Start free."
    },
    ja: {
      title: "英語発音練習｜話すたびにその場でフィードバック",
      description: "マイクに向かって話し、認識された言葉を目標の文と比較。毎回その場でフィードバックが得られます。無料で始められます。"
    },
    th: {
      title: "ฝึกออกเสียงภาษาอังกฤษ พร้อมฟีดแบ็กทันที",
      description: "พูดเข้าไมค์แล้วเทียบคำที่ระบบรู้จำกับประโยคเป้าหมาย รับฟีดแบ็กทุกครั้งที่ลอง เริ่มใช้ได้ฟรี"
    },
    ko: {
      title: "영어 발음 연습｜말할 때마다 즉시 피드백",
      description: "마이크에 대고 말한 뒤 인식된 단어를 목표 문장과 비교하세요. 매번 즉시 피드백을 받을 수 있습니다. 무료로 시작하세요."
    },
    "zh-CN": {
      title: "英语发音练习｜每次开口都有即时反馈",
      description: "对着麦克风开口说,系统把识别出的文字和目标句对比,每次练习都有即时反馈。免费开始。"
    },
    "zh-TW": {
      title: "英語發音練習｜每次開口都有即時回饋",
      description: "對著麥克風開口說,系統把辨識出的文字和目標句比對,每次練習都有即時回饋。免費開始。"
    },
    es: {
      title: "Pronunciación inglesa: práctica con feedback inmediato",
      description: "Practica la pronunciación hablando al micrófono y comparando lo que dijiste con la frase objetivo. Feedback instantáneo en cada intento. Empieza gratis."
    }
  },
  "/practice/vocabulary": {
    en: {
      title: "Build English Vocabulary From Real Conversations | AI Tutor",
      description: "Save the words and phrases that come up in your own conversations and review them later. You remember them because you actually used them."
    },
    ja: {
      title: "会話から英単語が増える｜AI語彙トレーニング",
      description: "自分の会話で出会った単語やフレーズを保存し、あとで復習。実際に使った言葉だから、記憶に残ります。"
    },
    th: {
      title: "สะสมคำศัพท์อังกฤษจากบทสนทนาจริง | AI Tutor",
      description: "บันทึกคำและวลีที่เจอในบทสนทนาของตัวเอง แล้วกลับมาทบทวน เพราะเคยใช้จริงจึงจำได้ง่าย"
    },
    ko: {
      title: "실제 대화에서 영어 어휘 늘리기 | AI 튜터",
      description: "내 대화에서 나온 단어와 표현을 저장하고 나중에 복습하세요. 직접 사용한 표현이라 더 오래 기억됩니다."
    },
    "zh-CN": {
      title: "从真实对话中积累英语词汇 | AI 导师",
      description: "把对话中遇到的单词和表达存下来,之后复习。因为是自己用过的,所以真正记得住。"
    },
    "zh-TW": {
      title: "從真實對話中累積英語詞彙 | AI 導師",
      description: "把對話中遇到的單字和表達存起來,之後複習。因為是自己用過的,所以真正記得住。"
    },
    es: {
      title: "Amplía tu vocabulario inglés con conversaciones reales | Tutor IA",
      description: "Guarda las palabras y frases que surgen en tus propias conversaciones y repásalas después. Las recuerdas porque las usaste."
    }
  },
  "/learn/learning-tips": {
    en: {
      title: "How to Practise Speaking a Language Alone: 12 Practical Tips",
      description: "No partner? No problem. Twelve practical ways to build a speaking habit on your own, from shadowing to short daily AI conversations."
    },
    ja: {
      title: "一人で話す練習をする方法｜実践的な12のコツ",
      description: "練習相手がいなくても大丈夫。シャドーイングから短いAI会話まで、一人で話す習慣を作る12の実践的な方法を紹介します。"
    },
    th: {
      title: "วิธีฝึกพูดภาษาคนเดียว｜12 เคล็ดลับที่ทำได้จริง",
      description: "ไม่มีคู่ซ้อมก็ไม่เป็นไร 12 วิธีสร้างนิสัยการพูดด้วยตัวเอง ตั้งแต่ชาโดว์อิงจนถึงคุยสั้น ๆ กับ AI ทุกวัน"
    },
    ko: {
      title: "혼자 말하기 연습하는 방법｜실천 가능한 12가지 팁",
      description: "파트너가 없어도 괜찮습니다. 쉐도잉부터 짧은 AI 대화까지, 혼자서 말하기 습관을 만드는 12가지 실용적인 방법을 소개합니다."
    },
    "zh-CN": {
      title: "一个人怎么练口语｜12 个实用方法",
      description: "没有语伴也没关系。从影子跟读到每天和 AI 短聊,12 个能真正坚持下来的独自练口语方法。"
    },
    "zh-TW": {
      title: "一個人怎麼練口說｜12 個實用方法",
      description: "沒有語伴也沒關係。從影子跟讀到每天和 AI 短聊,12 個能真正堅持下來的獨自練口說方法。"
    },
    es: {
      title: "Cómo practicar speaking solo: 12 consejos prácticos",
      description: "¿Sin compañero? No pasa nada. Doce formas prácticas de crear el hábito de hablar por tu cuenta, del shadowing a conversaciones cortas con IA."
    }
  },
  "/learn/practice-guide": {
    en: {
      title: "Daily Speaking Practice Plan: A Step-by-Step Guide",
      description: "A simple daily routine for speaking practice: pick a topic, say it in your language first, get a natural phrasing, then use it in conversation."
    },
    ja: {
      title: "毎日のスピーキング練習プラン｜ステップ別ガイド",
      description: "話題を選び、まず母語で言いたいことを整理し、自然な表現を受け取って会話で使う。毎日続けられるシンプルな練習手順です。"
    },
    th: {
      title: "แผนฝึกพูดรายวัน｜คำแนะนำทีละขั้นตอน",
      description: "เลือกหัวข้อ พูดเป็นภาษาตัวเองก่อน รับประโยคที่เป็นธรรมชาติ แล้วเอาไปใช้ในบทสนทนา กิจวัตรฝึกพูดที่ทำได้ทุกวัน"
    },
    ko: {
      title: "매일 말하기 연습 플랜｜단계별 가이드",
      description: "주제를 고르고, 모국어로 먼저 말해 보고, 자연스러운 표현을 받은 뒤 대화에서 활용하는 간단한 매일 연습 루틴입니다."
    },
    "zh-CN": {
      title: "每日口语练习计划｜分步指南",
      description: "选个话题,先用自己的语言说清意思,拿到自然的说法,再把它用进对话。一套每天都能坚持的简单练习流程。"
    },
    "zh-TW": {
      title: "每日口說練習計畫｜分步指南",
      description: "選個話題,先用自己的語言說清意思,取得自然的說法,再把它用進對話。一套每天都能堅持的簡單練習流程。"
    },
    es: {
      title: "Plan diario de práctica oral: guía paso a paso",
      description: "Una rutina diaria sencilla: elige un tema, dilo primero en tu idioma, recibe una frase natural y úsala en la conversación."
    }
  },
  "/learn/conversation-topics": {
    en: {
      title: "120 English Conversation Topics for Work, Travel & Small Talk",
      description: "A library of English conversation topics with open questions for each — work, travel, small talk and opinions. Pick one and start talking."
    },
    ja: {
      title: "英会話トピック120選｜仕事・旅行・雑談シーン別",
      description: "仕事、旅行、雑談、意見交換まで。場面別の英会話トピックとオープンクエスチョン集。ひとつ選んで話し始めましょう。"
    },
    th: {
      title: "120 หัวข้อสนทนาภาษาอังกฤษ｜งาน ท่องเที่ยว small talk",
      description: "คลังหัวข้อสนทนาภาษาอังกฤษพร้อมคำถามปลายเปิดสำหรับแต่ละหัวข้อ ครอบคลุมงาน ท่องเที่ยว และ small talk เลือกแล้วเริ่มพูดได้เลย"
    },
    ko: {
      title: "영어 회화 주제 120선｜직장·여행·스몰토크",
      description: "직장, 여행, 스몰토크, 의견 교환까지. 주제별 영어 회화 토픽과 개방형 질문 모음. 하나를 골라 바로 말해 보세요."
    },
    "zh-CN": {
      title: "120 个英语对话话题｜职场、旅行与闲聊",
      description: "按场景分组的英语对话话题库,每个话题配开放式问题,涵盖工作、旅行、闲聊和观点表达。挑一个,开口聊。"
    },
    "zh-TW": {
      title: "120 個英語對話話題｜職場、旅行與閒聊",
      description: "按情境分組的英語對話話題庫,每個話題附開放式問題,涵蓋工作、旅行、閒聊和觀點表達。挑一個,開口聊。"
    },
    es: {
      title: "120 temas de conversación en inglés: trabajo, viajes y más",
      description: "Una biblioteca de temas de conversación en inglés con preguntas abiertas: trabajo, viajes, small talk y opiniones. Elige uno y empieza a hablar."
    }
  },
  "/learn/blog": {
    en: {
      title: "AI Language Learning Blog: Speaking Tips & Practice Guides",
      description: "Guides on learning a language with an AI tutor: building a speaking habit, practising alone, and turning hesitation into conversation."
    },
    ja: {
      title: "AI英会話の学習ブログ｜スピーキング練習のコツとガイド",
      description: "AIチューターとの語学学習ガイド。話す習慣の作り方、一人での練習法、言葉に詰まったときの乗り越え方を紹介します。"
    },
    th: {
      title: "บล็อกเรียนภาษากับ AI｜เคล็ดลับและคู่มือฝึกพูด",
      description: "คู่มือเรียนภาษากับ AI Tutor: สร้างนิสัยการพูด ฝึกคนเดียว และเปลี่ยนความติดขัดให้เป็นบทสนทนา"
    },
    ko: {
      title: "AI 언어 학습 블로그｜스피킹 팁과 연습 가이드",
      description: "AI 튜터와 함께하는 언어 학습 가이드. 말하기 습관 만들기, 혼자 연습하기, 막힘을 대화로 바꾸는 방법을 다룹니다."
    },
    "zh-CN": {
      title: "AI 语言学习博客｜口语技巧与练习指南",
      description: "用 AI 导师学语言的实用指南:如何养成开口习惯、一个人怎么练、以及如何把卡壳变成对话。"
    },
    "zh-TW": {
      title: "AI 語言學習部落格｜口說技巧與練習指南",
      description: "用 AI 導師學語言的實用指南:如何養成開口習慣、一個人怎麼練,以及如何把卡關變成對話。"
    },
    es: {
      title: "Blog de idiomas con IA: consejos de speaking y guías",
      description: "Guías para aprender un idioma con un tutor de IA: crear el hábito de hablar, practicar en solitario y convertir las dudas en conversación."
    }
  },
  "/pricing": {
    en: {
      title: "Pricing: Free Trial, Pro Monthly & Pro Annual | AI Language Tutor",
      description: "Try your first AI language conversation for free, then choose Pro monthly or save with Pro Annual."
    },
    ja: {
      title: "料金プラン｜無料体験・Pro月額・Pro年額 | AI Language Tutor",
      description: "最初のAI会話は無料。その後はPro月額、またはお得なPro年額を選べます。"
    },
    th: {
      title: "ราคา: ทดลองฟรี Pro รายเดือน และ Pro รายปี | AI Language Tutor",
      description: "ลองบทสนทนากับ AI ครั้งแรกฟรี แล้วเลือก Pro รายเดือนหรือประหยัดกว่าด้วย Pro รายปี"
    },
    ko: {
      title: "요금제: 무료 체험, Pro 월간 및 연간 | AI Language Tutor",
      description: "첫 AI 언어 대화를 무료로 체험하고, Pro 월간 또는 더 저렴한 Pro 연간을 선택하세요."
    },
    "zh-CN": {
      title: "价格:免费试用、Pro 月付与 Pro 年付 | AI Language Tutor",
      description: "首次 AI 对话免费体验,之后可选 Pro 月付,或用更划算的 Pro 年付。"
    },
    "zh-TW": {
      title: "價格:免費試用、Pro 月付與 Pro 年付 | AI Language Tutor",
      description: "首次 AI 對話免費體驗,之後可選 Pro 月付,或用更划算的 Pro 年付。"
    },
    es: {
      title: "Precios: prueba gratis, Pro mensual y Pro anual | AI Language Tutor",
      description: "Prueba tu primera conversación con IA gratis y después elige Pro mensual o ahorra con Pro anual."
    }
  }
};

export function getPageSeo(path: string, locale: Locale): PageSeo | null {
  return pageSeo[path]?.[locale] ?? null;
}
