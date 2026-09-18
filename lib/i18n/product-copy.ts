import type { Locale } from "./config";
import type { ProductCopy } from "./types";
import { honestFeedbackLabel, repeatCopy, trialLabels } from "./practice-copy";
import { annualUsd, monthlyUsd } from "../billing/catalog";

type BrowserDemoLanguage = "en" | "zh-CN" | "zh-TW" | "ja" | "th" | "ko" | "es" | "fr";

const browserDemoCopy: Record<string, Record<BrowserDemoLanguage, { languagePair: string; userMessage: string; aiMessage?: string }>> = {
  airport: {
    en: { languagePair: "English → English", userMessage: "I need to ask where my gate is.", aiMessage: 'You could say, "Excuse me, where is Gate 24?"' },
    "zh-CN": { languagePair: "Chinese → English", userMessage: "我明天要去机场，但是不知道怎么问登机口在哪里。" },
    "zh-TW": { languagePair: "Chinese → English", userMessage: "我明天要去機場，但是不知道怎麼問登機口在哪裡。" },
    ja: { languagePair: "Japanese → English", userMessage: "明日空港に行くのですが、搭乗口の場所をどう聞けばいいかわかりません。" },
    th: { languagePair: "Thai → English", userMessage: "พรุ่งนี้ฉันจะไปสนามบิน แต่ไม่รู้ว่าจะถามว่าประตูขึ้นเครื่องอยู่ที่ไหน" },
    ko: { languagePair: "Korean → English", userMessage: "내일 공항에 가는데 탑승구가 어디인지 어떻게 물어봐야 할지 모르겠어요." },
    es: { languagePair: "Spanish → English", userMessage: "Mañana voy al aeropuerto, pero no sé cómo preguntar dónde está mi puerta de embarque." },
    fr: { languagePair: "French → English", userMessage: "Je vais à l'aéroport demain, mais je ne sais pas comment demander où se trouve ma porte d'embarquement." }
  },
  coffee: {
    en: { languagePair: "English → English", userMessage: "I want to ask if I can take this coffee to go.", aiMessage: 'You could say, "Can I get this coffee to go, please?"' },
    "zh-CN": { languagePair: "Chinese → English", userMessage: "我想问这杯咖啡可以打包带走吗？" },
    "zh-TW": { languagePair: "Chinese → English", userMessage: "我想問這杯咖啡可以外帶嗎？" },
    ja: { languagePair: "Japanese → English", userMessage: "このコーヒーは持ち帰りできますか？" },
    th: { languagePair: "Thai → English", userMessage: "กาแฟแก้วนี้สั่งกลับบ้านได้ไหม" },
    ko: { languagePair: "Korean → English", userMessage: "이 커피는 포장해서 가져갈 수 있나요?" },
    es: { languagePair: "Spanish → English", userMessage: "¿Puedo pedir este café para llevar?" },
    fr: { languagePair: "French → English", userMessage: "Est-ce que je peux prendre ce café à emporter ?" }
  },
  restaurant: {
    en: { languagePair: "English → English", userMessage: "I want to ask if you have vegetarian options.", aiMessage: 'You could say, "Do you have any vegetarian options?"' },
    "zh-CN": { languagePair: "Chinese → English", userMessage: "我想问你们有没有素食选择。" },
    "zh-TW": { languagePair: "Chinese → English", userMessage: "我想問你們有沒有素食選擇。" },
    ja: { languagePair: "Japanese → English", userMessage: "ベジタリアン向けのメニューがあるか聞きたいです。" },
    th: { languagePair: "Thai → English", userMessage: "มีเมนูมังสวิรัติไหม" },
    ko: { languagePair: "Korean → English", userMessage: "채식 메뉴가 있는지 물어보고 싶어요." },
    es: { languagePair: "Spanish → English", userMessage: "¿Tienen opciones vegetarianas?" },
    fr: { languagePair: "French → English", userMessage: "Avez-vous des options végétariennes ?" }
  },
  hotel: {
    en: { languagePair: "English → English", userMessage: "I want to say that I have a reservation.", aiMessage: 'You could say, "Hi, I have a reservation under my name."' },
    "zh-CN": { languagePair: "Chinese → English", userMessage: "我想说我有一个预订。" },
    "zh-TW": { languagePair: "Chinese → English", userMessage: "我想說我有一個預訂。" },
    ja: { languagePair: "Japanese → English", userMessage: "予約があることを伝えたいです。" },
    th: { languagePair: "Thai → English", userMessage: "ฉันอยากบอกว่ามีการจองไว้แล้ว" },
    ko: { languagePair: "Korean → English", userMessage: "예약이 되어 있다고 말하고 싶어요." },
    es: { languagePair: "Spanish → English", userMessage: "Quiero decir que tengo una reserva." },
    fr: { languagePair: "French → English", userMessage: "Je voudrais dire que j'ai une réservation." }
  }
};

function createDemo(copy: {
  productName: string;
  languagePairLabel: string;
  scenarioLabel: string;
  contextLabel: string;
  userLabel: string;
  tutorLabel: string;
  userInstruction: string;
  responseLabel: string;
  actions: string[];
  moreNaturalLabel: string;
  practiceCta: string;
  learningFlow: string[];
  scenarioNames: string[];
  visualLabels: string[];
  visualMetas: string[];
  visualDetails: string[];
  naturalPhrases: string[];
}): ProductCopy["demo"] {
  const scenarios = [
    { id: "airport", scenario: copy.scenarioNames[0], userMessage: "I need to ask where my gate is.", aiMessage: 'You could say, "Excuse me, where is Gate 24?"', naturalPhrase: copy.naturalPhrases[0], visualLabel: copy.visualLabels[0], visualMeta: copy.visualMetas[0], visualDetail: copy.visualDetails[0] },
    { id: "coffee", scenario: copy.scenarioNames[1], userMessage: "このコーヒーは持ち帰りできますか？", aiMessage: "Can I get this coffee to go?", naturalPhrase: copy.naturalPhrases[1], visualLabel: copy.visualLabels[1], visualMeta: copy.visualMetas[1], visualDetail: copy.visualDetails[1] },
    { id: "restaurant", scenario: copy.scenarioNames[2], userMessage: "¿Tienen opciones vegetarianas?", aiMessage: "Do you have any vegetarian options?", naturalPhrase: copy.naturalPhrases[2], visualLabel: copy.visualLabels[2], visualMeta: copy.visualMetas[2], visualDetail: copy.visualDetails[2] },
    { id: "hotel", scenario: copy.scenarioNames[3], userMessage: "Je voudrais dire que j'ai une réservation.", aiMessage: "I'd like to say that I have a reservation.", naturalPhrase: copy.naturalPhrases[3], visualLabel: copy.visualLabels[3], visualMeta: copy.visualMetas[3], visualDetail: copy.visualDetails[3] }
  ] as ProductCopy["demo"]["scenarios"];

  return {
    productName: copy.productName,
    languagePairLabel: copy.languagePairLabel,
    scenarioLabel: copy.scenarioLabel,
    contextLabel: copy.contextLabel,
    userLabel: copy.userLabel,
    tutorLabel: copy.tutorLabel,
    userInstruction: copy.userInstruction,
    responseLabel: copy.responseLabel,
    actions: copy.actions,
    moreNaturalLabel: copy.moreNaturalLabel,
    practiceCta: copy.practiceCta,
    learningFlow: copy.learningFlow,
    scenarios: scenarios.map((scenario) => ({ ...scenario, browserCopy: browserDemoCopy[scenario.id] }))
  };
}

const baseProduct: ProductCopy = {
  demo: createDemo({
    productName: "AI Language Tutor",
    languagePairLabel: "Current language pair",
    scenarioLabel: "Conversation scenario",
    contextLabel: "context",
    userLabel: "You",
    tutorLabel: "AI Tutor",
    userInstruction: "Tell your tutor what you mean",
    responseLabel: "Target-language response",
    actions: ["Listen", "Translate", "Learn"],
    moreNaturalLabel: "More natural:",
    practiceCta: "Practice this phrase",
    learningFlow: ["Native language", "AI understands", "Target expression", "Speak"],
    scenarioNames: ["Airport", "Coffee shop", "Restaurant", "Hotel"],
    visualLabels: ["Airport help", "Cafe order", "Menu question", "Check-in"],
    visualMetas: ["Tomorrow · Terminal 2", "Morning · Counter", "Dinner · Ordering", "Evening · Front desk"],
    visualDetails: ["Gate 24", "To go", "Vegetarian", "Reservation"],
    naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
  }),
  home: {
    flowSteps: ["Speak", "Understand", "Practice"],
    flowNote: "You do not need a full lesson before you speak. One conversation creates the practice you need next.",
    storySamples: [
      { badge: "Talk", prompt: "I go to Tokyo with my friend.", response: "A more natural way to say that is, “I went to Tokyo with my friend.” What did you enjoy most about Tokyo?", actions: ["Correction", "Continue", "Keep talking"] },
      { badge: "Get Help", prompt: "I usually go home and cook after work.", response: "You could say, “I usually go home and cook, but sometimes I grab dinner with friends.”", actions: ["Listen", "Learn", "Try saying it"] },
      { badge: "Say it again", prompt: "I had to work late yesterday.", response: "Great. Say it again, then your tutor will keep the conversation going.", actions: ["Listen", "Try again", "Continue"] }
    ],
    modeExamples: [
      { label: "You", text: "I want to tell my boss I cannot come to work tomorrow." },
      { label: "AI Tutor", text: "You could say, “I need to tell my boss that I cannot come to work tomorrow.”" }
    ],
    correction: {
      youSaid: "You said",
      youSaidText: "I go to Tokyo yesterday.",
      tutorLabel: "Your tutor",
      tutorText: "I went to Tokyo yesterday.",
      note: "Use went because yesterday is in the past. Try it again out loud."
    },
    pronunciation: {
      label: "Pronunciation practice",
      word: "comfortable",
      feedbackLabel: "Tutor feedback",
      feedbackTitle: "Clear and natural",
      feedbackBody: "Try making the middle sound softer, then say the phrase once more.",
      syllables: ["comf", "ter", "ble"],
      copy: "Listen, speak, and improve your pronunciation as you practice.",
      cta: "Try again",
      ariaSyllables: "Syllables"
    },
    vocabulary: {
      label: "Vocabulary",
      ariaLabel: "Words you actually used",
      columns: ["Word", "Meaning", "Practice"],
      rows: [
        { word: "delayed", meaning: "late or held back", practice: "Say it" },
        { word: "reservation", meaning: "a booking", practice: "Say it" },
        { word: "crowded", meaning: "full of people", practice: "Say it" }
      ],
      note: "No random vocabulary lists. Learn the words that come from your own conversations."
    },
    review: {
      label: "Review",
      rows: [
        { label: "New phrases", value: "3" },
        { label: "Corrections", value: "2" },
        { label: "Words learned", value: "5" }
      ],
      ariaLabel: "Personal learning review",
      items: [
        "Adapts to your current speaking level",
        "Reuses past mistakes for better practice",
        "Keeps lessons connected to real conversations"
      ]
    },
    languageNote: "Start with the language you need now. Add another when you are ready."
  },
  auth: {
    ariaLabel: "Sign in",
    closeLabel: "Close sign in",
    eyebrow: "AI LANGUAGE TUTOR",
    title: "Sign in to continue",
    lead: "Practice real conversations with your AI language tutor and keep your learning progress between sessions.",
    google: "Continue with Google",
    googleLoading: "Connecting to Google",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    emailCta: "Continue with email",
    emailSending: "Sending login link",
    emailSent: "Check your email for a login link. New addresses will be registered automatically.",
    invalidEmail: "Enter a valid email address.",
    emailError: "We could not send the login link. Please try again.",
    orContinueWith: "or continue with",
    accountNote: "Google sign-in keeps your tutor, conversations, and learning cards together.",
    demoMode: "Demo mode is active. Add Supabase environment variables to enable sign-in.",
    callbackError: "Sign-in could not be completed. Please try again.",
    termsPrefix: "By continuing, you agree to our",
    termsLabel: "Terms",
    termsAnd: "and",
    privacyLabel: "Privacy Policy"
  },
  pricing: {
    back: "Back to workbench",
    eyebrow: "Pricing",
    title: "Practice for free. Upgrade when you're ready.",
    lead: "Try your first AI language conversation for free.",
    plansLabel: "Subscription plans",
    freeKicker: "Try first",
    freeName: "Free",
    freePrice: "$0",
    freeTerm: "1-minute trial",
    freeSubtitle: "Try your first conversation.",
    freeFeatures: ["1-minute AI conversation", "Voice input", "AI replies in your target language", "Translation", "Listen to AI", "Basic word explanations", "Basic pronunciation feedback", "No credit card required"],
    freeNote: "Try the full experience. No credit card required.",
    freeCta: "Try for free",
    proKicker: "Unlimited practice",
    proBadge: "Most popular",
    proName: "Pro",
    proFallbackPrice: "$12.99",
    month: "month",
    proSubtitle: "Practice without limits.",
    proFeatures: ["Unlimited AI conversations", "Voice conversations", "Target-language AI replies", "Instant translation", "AI voice / TTS", "Slow playback", "Word and phrase explanations", "AI pronunciation feedback", "Grammar corrections", "Natural expression suggestions", "Saved words and phrases", "Conversation history", "Personalized practice", "Progress tracking"],
    proCta: "Start Pro",
    annualKicker: "Save more with Annual",
    annualName: "Pro Annual",
    annualDescription: "Pay once and keep practicing all year.",
    annualFallbackPrice: "$79.99",
    year: "year",
    monthEquivalent: "$6.67 / month",
    annualSavings: "Save 49%",
    annualCta: "Get Pro",
    supabaseNotice: "Add Supabase environment variables before starting a paid checkout.",
    pendingNotice: "Checkout is waiting for the Waffo merchant configuration.",
    checkoutNotice: "We could not start checkout. Please try again.",
    popupBlockedNotice: "Your browser blocked the checkout tab.",
    openCheckout: "Open secure checkout"
  },
  workbench: {
    nav: { home: "Home", history: "Chat history", cards: "Saved cards", reading: "Reading practice", partners: "Partners", aria: "Workbench" },
    accountPlan: "Free plan",
    tutorLabel: "AI tutor",
    remoteUnavailable: "Your account is connected. The tutor service is temporarily unavailable, so this page is showing the practice preview.",
    newConversationError: "A new conversation could not be created. Please try again.",
    demoSayItReply: "Nice. I understand you. Try saying it once more in English, and I’ll help you make it sound natural.",
    demoTalkReply: "Nice. Keep the conversation going. I’ll reply in English and adjust the pace to your level.",
    providerError: "Your message was saved, but the tutor could not reply yet. Please try again shortly.",
    messageError: "Your message could not be sent. Please try again.",
    settingsError: "Your language settings could not be saved. Please try again.",
    learningToolError: "That learning tool is temporarily unavailable. Please try again.",
    title: "AI Language Tutor",
    mobileTitle: "Home",
    subtitle: "Listen in English. Reply in English or your own language.",
    languageSettingsLabel: "Current language pair",
    upgradeCta: "Start Pro",
    partnerGenderOrigin: "Female · From Valencia",
    partnerDescription: "Calm, observant, gently witty",
    customize: "Customize",
    changePartner: "Change partner",
    partnerSettings: "Partner settings",
    partnerReady: "Clara is ready for a relaxed conversation.",
    closePartner: "Close partner settings",
    practiceMode: "Practice mode",
    sayItMode: "Say It / Translate",
    talkMode: "Talk / Conversation",
    stats: ["MINUTES", "MESSAGES", "YOUR TURNS", "INPUT WORDS"],
    startConversation: "New conversation",
    startingConversation: "Starting…",
    today: "TODAY",
    listen: "Listen",
    repeat: "Repeat",
    repeatPrompt: "Repeat the sentence aloud before continuing.",
    repeatChecking: "Checking your repetition…",
    repeatPassed: "Good repetition. You can continue.",
    repeatTryAgain: "Please repeat the sentence and try again.",
    repeatCorrection: "Practice this sentence:",
    repeatFeedbackError: "We could not check the repetition. Please try again.",
    repeatUnsupported: "Your browser cannot check repetition. Use Chrome or Edge and allow microphone access.",
    repeatRequired: "Please repeat the tutor's sentence before continuing.",
    slow: "Slow",
    hide: "Hide",
    translation: "Translation",
    lost: "I'm lost",
    gotIt: "Did I get it?",
    showHints: "Show hints",
    releaseToSend: "Release to send",
    sending: "Sending…",
    typeSayIt: "Type what you want to say",
    typeTalk: "Reply in English or your own language",
    messageLabel: "Message",
    holdToSpeak: "Hold to speak, release to send",
    sendMessage: "Send message",
    voiceUnsupported: "Voice input is not supported in this browser. Try Chrome or Edge.",
    micDenied: "Microphone permission was denied. Allow microphone access and try again.",
    voiceUnclear: "I couldn't hear that. Please try again.",
    sent: "Sent",
    insightTranslate: "Translate",
    insightGrammar: "Grammar",
    insightEmptyTitle: "Highlight or type text",
    insightEmptyBody: "Select a word or phrase from Clara Ruiz, or type it below, to see meaning or grammar.",
    selectedTranslateBody: "A natural sentence you can understand and use in your next conversation.",
    selectedGrammarBody: "Notice the word order and the everyday expression. Try saying it out loud once.",
    saveCard: "Save learning card",
    lookupPlaceholder: "Type a word or phrase from Clara Ruiz",
    lookupLabel: "Word lookup",
    privateNote: "Your conversation is private and saved to your account.",
    modal: {
      close: "Close language setup",
      eyebrow: "GET STARTED",
      title: "Choose your languages",
      lead: "Tell your tutor what you already speak and what you want to practice. You can change this later.",
      native: "I speak",
      learning: "I'm learning",
      level: "My level",
      later: "I'll choose later",
      start: "Start talking"
    },
    languageNames: { Chinese: "Chinese", English: "English", Spanish: "Spanish", Japanese: "Japanese", French: "French", Korean: "Korean" },
    levels: { "Auto-detect": "Auto-detect", Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" }
  }
};

const localized: Record<Exclude<Locale, "en">, ProductCopy> = {
  ja: {
    ...baseProduct,
    demo: createDemo({
      productName: "AI語学チューター",
      languagePairLabel: "現在の言語ペア",
      scenarioLabel: "会話の場面",
      contextLabel: "場面",
      userLabel: "あなた",
      tutorLabel: "AIチューター",
      userInstruction: "言いたいことを伝える",
      responseLabel: "自然な英語の言い方",
      actions: ["聞く", "翻訳", "学ぶ"],
      moreNaturalLabel: "もっと自然に言うと:",
      practiceCta: "このフレーズを練習",
      learningFlow: ["母語で伝える", "AIが意味を理解", "自然な表現を学ぶ", "声に出す"],
      scenarioNames: ["空港", "カフェ", "レストラン", "ホテル"],
      visualLabels: ["空港での質問", "カフェで注文", "メニューの質問", "チェックイン"],
      visualMetas: ["明日 · ターミナル2", "朝 · カウンター", "夕食 · 注文中", "夜 · フロント"],
      visualDetails: ["24番ゲート", "持ち帰り", "ベジタリアン", "予約"],
      naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
    }),
    home: {
      ...baseProduct.home,
      flowSteps: ["話す", "理解する", "練習する"],
      flowNote: "先に文法を勉強しなくても大丈夫。会話の中で、次に必要な練習が見つかります。",
      languageNote: "まずは今必要な言語から。慣れたら別の言語も追加できます。"
    },
    auth: { ...baseProduct.auth, ariaLabel: "ログイン", closeLabel: "ログインを閉じる", eyebrow: "AI語学チューター", title: "続けるにはログインしてください", lead: "AIチューターと実際に会話しながら、前回の学習内容も続きから練習できます。", google: "Googleで続ける", googleLoading: "Googleに接続中", emailLabel: "メールアドレス", emailPlaceholder: "you@example.com", emailCta: "メールで続ける", emailSending: "ログインリンクを送信中", emailSent: "ログインリンクをメールで確認してください。新しいアドレスは自動的に登録されます。", invalidEmail: "有効なメールアドレスを入力してください。", emailError: "ログインリンクを送信できませんでした。もう一度お試しください。", orContinueWith: "またはメールで続ける", accountNote: "Googleまたはメールでログインすると、チューター、会話履歴、学習カードをまとめて保存できます。", demoMode: "デモモードです。ログインを有効にするにはSupabaseの環境変数を設定してください。", callbackError: "ログインを完了できませんでした。もう一度お試しください。", termsPrefix: "続けることで、", termsLabel: "利用規約", termsAnd: "と", privacyLabel: "プライバシーポリシーに同意したものとみなされます。" },
    pricing: { ...baseProduct.pricing, back: "ワークベンチに戻る", eyebrow: "料金", title: "まずは無料で。必要になったらProへ。", lead: "最初のAI語学会話を無料で試せます。", freeKicker: "まずは体験", freeName: "Free", freeTerm: "1分間の体験", freeSubtitle: "最初の会話を試してみましょう。", freeFeatures: ["1分間のAI会話", "音声入力", "学習中の言語でAIが返答", "翻訳", "AIの返答を聞く", "基本的な単語説明", "基本的な発音フィードバック", "クレジットカード不要"], freeNote: "すべての流れを体験できます。カード登録は不要です。", freeCta: "無料で試す", proKicker: "無制限で練習", proBadge: "人気プラン", proSubtitle: "毎日の練習を止めない。", proFallbackPrice: "$12.99", proFeatures: ["AI会話を無制限で利用", "音声で会話", "目標言語での自然な返答", "すぐに翻訳", "AI音声 / TTS", "ゆっくり再生", "単語とフレーズの説明", "発音フィードバック", "文法の添削", "自然な言い換え", "保存した単語とフレーズ", "会話履歴", "自分に合った練習", "学習の進み具合"], proCta: "Proを始める", annualKicker: "年払いでもっとお得に", annualName: "Pro 年間", annualDescription: "一度支払って、1年間練習を続けられます。", annualFallbackPrice: "$79.99", annualSavings: "49%お得", annualCta: "Proを選ぶ", monthEquivalent: "$6.67 / month" },
    workbench: { ...baseProduct.workbench, nav: { home: "ホーム", history: "会話履歴", cards: "保存したカード", reading: "英語リーディング", partners: "チューター", aria: "ワークベンチ" }, accountPlan: "無料プラン", title: "AI語学チューター", mobileTitle: "ホーム", subtitle: "英語を聞いて、英語または自分の言葉で返答しましょう。", upgradeCta: "Proを始める", partnerGenderOrigin: "女性 · バレンシア出身", partnerDescription: "穏やかで、よく観察し、少しユーモアがある", customize: "カスタマイズ", changePartner: "チューターを変更", partnerSettings: "チューター設定", partnerReady: "Claraはリラックスした会話の準備ができています。", closePartner: "チューター設定を閉じる", practiceMode: "練習モード", sayItMode: "Say It / 翻訳", talkMode: "Talk / 会話", stats: ["分数", "メッセージ", "あなたの発話", "入力単語"], startConversation: "新しい会話", startingConversation: "開始中…", today: "今日", listen: "聞く", slow: "ゆっくり", hide: "隠す", translation: "翻訳", lost: "わかりません", gotIt: "理解できた", showHints: "ヒントを見る", releaseToSend: "離すと送信", sending: "送信中…", typeSayIt: "言いたいことを入力", typeTalk: "英語または自分の言葉で返答", messageLabel: "メッセージ", holdToSpeak: "長押しして話し、離して送信", sendMessage: "メッセージを送信", voiceUnsupported: "このブラウザでは音声入力を利用できません。ChromeまたはEdgeをお試しください。", micDenied: "マイクへのアクセスが拒否されました。許可してもう一度お試しください。", voiceUnclear: "聞き取れませんでした。もう一度お話しください。", sent: "送信済み", insightTranslate: "翻訳", insightGrammar: "文法", insightEmptyTitle: "単語や文章を選択", insightEmptyBody: "Claraの文章を選ぶか、下に入力すると意味や文法を確認できます。", selectedTranslateBody: "次の会話で理解して使える自然な文章です。", selectedGrammarBody: "語順と日常的な表現に注目して、声に出してみましょう。", saveCard: "学習カードに保存", lookupPlaceholder: "Claraの単語やフレーズを入力", lookupLabel: "単語検索", privateNote: "会話は非公開で、アカウントに保存されます。", modal: { close: "言語設定を閉じる", eyebrow: "はじめに", title: "学ぶ言語を選ぶ", lead: "話せる言語と、練習したい言語を教えてください。あとから変更できます。", native: "話せる言語", learning: "学びたい言語", level: "レベル", later: "あとで選ぶ", start: "話し始める" }, languageNames: { Chinese: "中国語", English: "英語", Spanish: "スペイン語", Japanese: "日本語", French: "フランス語", Korean: "韓国語" }, levels: { "Auto-detect": "自動判定", Beginner: "初級", Intermediate: "中級", Advanced: "上級" } }
  },
  th: {
    ...baseProduct,
    demo: createDemo({
      productName: "AI Language Tutor",
      languagePairLabel: "คู่ภาษาปัจจุบัน",
      scenarioLabel: "สถานการณ์สนทนา",
      contextLabel: "บริบท",
      userLabel: "คุณ",
      tutorLabel: "AI Tutor",
      userInstruction: "บอกสิ่งที่อยากสื่อ",
      responseLabel: "ประโยคในภาษาที่กำลังเรียน",
      actions: ["ฟัง", "แปล", "เรียนรู้"],
      moreNaturalLabel: "พูดให้เป็นธรรมชาติมากขึ้น:",
      practiceCta: "ฝึกประโยคนี้",
      learningFlow: ["บอกเป็นภาษาของคุณ", "AI เข้าใจความหมาย", "เรียนรู้ประโยคธรรมชาติ", "ลองพูด"],
      scenarioNames: ["สนามบิน", "ร้านกาแฟ", "ร้านอาหาร", "โรงแรม"],
      visualLabels: ["ถามทางในสนามบิน", "สั่งกาแฟ", "ถามเมนู", "เช็กอิน"],
      visualMetas: ["พรุ่งนี้ · เทอร์มินัล 2", "ตอนเช้า · เคาน์เตอร์", "มื้อเย็น · กำลังสั่ง", "ตอนค่ำ · เคาน์เตอร์ต้อนรับ"],
      visualDetails: ["ประตู 24", "ซื้อกลับ", "มังสวิรัติ", "การจอง"],
      naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
    }),
    home: { ...baseProduct.home, flowSteps: ["พูด", "เข้าใจ", "ฝึกต่อ"], flowNote: "ไม่ต้องเรียนบทใหญ่ก่อนเริ่มพูด ทุกบทสนทนาจะบอกคุณเองว่าควรฝึกอะไรต่อ" },
    auth: { ...baseProduct.auth, ariaLabel: "เข้าสู่ระบบ", closeLabel: "ปิดหน้าล็อกอิน", eyebrow: "AI LANGUAGE TUTOR", title: "เข้าสู่ระบบเพื่อฝึกต่อ", lead: "ฝึกบทสนทนาจริงกับ AI Tutor และกลับมาเรียนต่อจากความคืบหน้าเดิมได้", google: "ดำเนินการต่อด้วย Google", googleLoading: "กำลังเชื่อมต่อกับ Google", emailLabel: "อีเมล", emailPlaceholder: "you@example.com", emailCta: "ดำเนินการต่อด้วยอีเมล", emailSending: "กำลังส่งลิงก์เข้าสู่ระบบ", emailSent: "ตรวจสอบอีเมลเพื่อใช้ลิงก์เข้าสู่ระบบ ที่อยู่อีเมลใหม่จะถูกลงทะเบียนโดยอัตโนมัติ", invalidEmail: "กรุณากรอกที่อยู่อีเมลที่ถูกต้อง", emailError: "ส่งลิงก์เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง", orContinueWith: "หรือดำเนินการต่อด้วยอีเมล", accountNote: "เข้าสู่ระบบด้วย Google หรืออีเมลเพื่อเก็บ Tutor ประวัติการสนทนา และการ์ดการเรียนรู้ไว้ด้วยกัน", demoMode: "กำลังอยู่ในโหมดเดโม ตั้งค่าตัวแปรสภาพแวดล้อมของ Supabase เพื่อเปิดใช้การเข้าสู่ระบบ", callbackError: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง", termsPrefix: "เมื่อดำเนินการต่อ คุณยอมรับ", termsLabel: "ข้อกำหนดการใช้บริการ", termsAnd: "และ", privacyLabel: "นโยบายความเป็นส่วนตัว" },
    pricing: { ...baseProduct.pricing, back: "กลับไปยังเวิร์กเบนช์", eyebrow: "ราคา", title: "ลองฟรีก่อน แล้วค่อยอัปเกรดเมื่อพร้อม", lead: "ลองบทสนทนาภาษา AI ครั้งแรกได้ฟรี", freeKicker: "ลองก่อน", freeName: "Free", freeTerm: "ทดลอง 1 นาที", freeSubtitle: "ลองบทสนทนาแรกของคุณ", freeFeatures: ["บทสนทนา AI 1 นาที", "พูดด้วยเสียง", "AI ตอบเป็นภาษาที่กำลังเรียน", "แปลทันที", "ฟังคำตอบจาก AI", "คำอธิบายคำศัพท์พื้นฐาน", "คำแนะนำการออกเสียงเบื้องต้น", "ไม่ต้องใช้บัตรเครดิต"], freeNote: "ลองประสบการณ์เต็มรูปแบบได้โดยไม่ต้องใช้บัตรเครดิต", freeCta: "ลองฟรี", proKicker: "ฝึกได้ไม่จำกัด", proBadge: "แพ็กเกจยอดนิยม", proSubtitle: "ฝึกได้ทุกวันที่ต้องการ", proFeatures: ["สนทนากับ AI ไม่จำกัด", "สนทนาด้วยเสียง", "คำตอบในภาษาที่กำลังเรียน", "แปลทันที", "เสียง AI / TTS", "เล่นเสียงช้าลง", "อธิบายคำและวลี", "คำแนะนำการออกเสียง", "แก้ไขไวยากรณ์", "แนะนำสำนวนที่เป็นธรรมชาติ", "บันทึกคำและวลี", "ประวัติการสนทนา", "การฝึกที่เหมาะกับคุณ", "ติดตามความก้าวหน้า"], proCta: "เริ่ม Pro", annualKicker: "จ่ายรายปีคุ้มกว่า", annualName: "Pro รายปี", annualDescription: "จ่ายครั้งเดียวและฝึกต่อได้ทั้งปี", annualSavings: "ประหยัด 49%", annualCta: "เลือก Pro", monthEquivalent: "$6.67 / month" },
    workbench: { ...baseProduct.workbench, nav: { home: "หน้าหลัก", history: "ประวัติแชต", cards: "การ์ดที่บันทึก", reading: "ฝึกอ่านภาษาอังกฤษ", partners: "Tutor", aria: "พื้นที่ฝึก" }, accountPlan: "แพ็กเกจฟรี", title: "AI Language Tutor", mobileTitle: "หน้าหลัก", subtitle: "ฟังภาษาอังกฤษ แล้วตอบเป็นภาษาอังกฤษหรือภาษาของคุณเอง", upgradeCta: "เริ่ม Pro", partnerGenderOrigin: "ผู้หญิง · จากบาเลนเซีย", partnerDescription: "ใจเย็น ช่างสังเกต และมีอารมณ์ขันเล็กน้อย", customize: "ปรับแต่ง", changePartner: "เปลี่ยน Tutor", partnerSettings: "ตั้งค่า Tutor", partnerReady: "Clara พร้อมคุยกับคุณแบบสบาย ๆ แล้ว", closePartner: "ปิดการตั้งค่า Tutor", practiceMode: "โหมดฝึก", sayItMode: "Say It / แปล", talkMode: "Talk / สนทนา", stats: ["นาที", "ข้อความ", "รอบของคุณ", "คำที่ป้อน"], startConversation: "บทสนทนาใหม่", startingConversation: "กำลังเริ่ม…", today: "วันนี้", listen: "ฟัง", slow: "ช้า", hide: "ซ่อน", translation: "แปล", lost: "ไม่เข้าใจ", gotIt: "เข้าใจแล้ว", showHints: "ดูคำใบ้", releaseToSend: "ปล่อยเพื่อส่ง", sending: "กำลังส่ง…", typeSayIt: "พิมพ์สิ่งที่อยากพูด", typeTalk: "ตอบเป็นภาษาอังกฤษหรือภาษาของคุณ", messageLabel: "ข้อความ", holdToSpeak: "กดค้างเพื่อพูด แล้วปล่อยเพื่อส่ง", sendMessage: "ส่งข้อความ", voiceUnsupported: "เบราว์เซอร์นี้ไม่รองรับการป้อนข้อมูลด้วยเสียง ลองใช้ Chrome หรือ Edge", micDenied: "ไม่อนุญาตให้ใช้ไมโครโฟน กรุณาอนุญาตแล้วลองอีกครั้ง", voiceUnclear: "ฟังไม่ชัด ลองพูดอีกครั้ง", sent: "ส่งแล้ว", insightTranslate: "แปล", insightGrammar: "ไวยากรณ์", insightEmptyTitle: "เลือกหรือพิมพ์ข้อความ", insightEmptyBody: "เลือกคำหรือวลีจาก Clara หรือพิมพ์ด้านล่างเพื่อดูความหมายหรือไวยากรณ์", selectedTranslateBody: "ประโยคธรรมชาติที่คุณนำไปเข้าใจและใช้ต่อในการสนทนาได้", selectedGrammarBody: "สังเกตลำดับคำและสำนวนที่ใช้ในชีวิตประจำวัน แล้วลองพูดออกเสียง", saveCard: "บันทึกเป็นการ์ดเรียนรู้", lookupPlaceholder: "พิมพ์คำหรือวลีจาก Clara", lookupLabel: "ค้นหาคำ", privateNote: "บทสนทนานี้เป็นส่วนตัวและบันทึกไว้ในบัญชีของคุณ", modal: { close: "ปิดการตั้งค่าภาษา", eyebrow: "เริ่มต้นใช้งาน", title: "เลือกภาษาของคุณ", lead: "บอก Tutor ว่าคุณพูดภาษาอะไรและอยากฝึกภาษาอะไร เปลี่ยนภายหลังได้", native: "ฉันพูด", learning: "ฉันกำลังเรียน", level: "ระดับของฉัน", later: "เลือกทีหลัง", start: "เริ่มพูด" }, languageNames: { Chinese: "จีน", English: "อังกฤษ", Spanish: "สเปน", Japanese: "ญี่ปุ่น", French: "ฝรั่งเศส", Korean: "เกาหลี" }, levels: { "Auto-detect": "ตรวจอัตโนมัติ", Beginner: "เริ่มต้น", Intermediate: "กลาง", Advanced: "สูง" } }
  },
  ko: {
    ...baseProduct,
    demo: createDemo({
      productName: "AI 언어 튜터",
      languagePairLabel: "현재 언어 조합",
      scenarioLabel: "대화 상황",
      contextLabel: "상황",
      userLabel: "나",
      tutorLabel: "AI Tutor",
      userInstruction: "말하고 싶은 뜻을 알려주세요",
      responseLabel: "자연스러운 영어 표현",
      actions: ["듣기", "번역", "배우기"],
      moreNaturalLabel: "더 자연스럽게 말하면:",
      practiceCta: "이 표현 연습하기",
      learningFlow: ["내 언어로 말하기", "AI가 뜻 이해하기", "자연스러운 표현 배우기", "직접 말하기"],
      scenarioNames: ["공항", "카페", "식당", "호텔"],
      visualLabels: ["공항에서 질문하기", "카페 주문", "메뉴 질문", "체크인"],
      visualMetas: ["내일 · 터미널 2", "아침 · 카운터", "저녁 · 주문 중", "저녁 · 프런트"],
      visualDetails: ["24번 게이트", "테이크아웃", "채식 메뉴", "예약"],
      naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
    }),
    home: { ...baseProduct.home, flowSteps: ["말하기", "이해하기", "연습하기"], flowNote: "긴 수업을 먼저 끝낼 필요가 없습니다. 대화 속에서 지금 필요한 연습을 바로 찾습니다." },
    auth: { ...baseProduct.auth, ariaLabel: "로그인", closeLabel: "로그인 닫기", eyebrow: "AI 언어 튜터", title: "계속하려면 로그인하세요", lead: "AI 튜터와 실제 대화를 연습하고 학습 기록을 이어서 확인하세요.", google: "Google로 계속하기", googleLoading: "Google에 연결 중", emailLabel: "이메일 주소", emailPlaceholder: "you@example.com", emailCta: "이메일로 계속하기", emailSending: "로그인 링크 전송 중", emailSent: "이메일에서 로그인 링크를 확인하세요. 새 이메일 주소는 자동으로 등록됩니다.", invalidEmail: "유효한 이메일 주소를 입력하세요.", emailError: "로그인 링크를 보내지 못했습니다. 다시 시도하세요.", orContinueWith: "또는 이메일로 계속하기", accountNote: "Google 또는 이메일로 로그인하면 Tutor, 대화 기록, 학습 카드를 한곳에 보관할 수 있습니다.", demoMode: "현재 데모 모드입니다. 로그인을 사용하려면 Supabase 환경 변수를 설정하세요.", callbackError: "로그인을 완료하지 못했습니다. 다시 시도해주세요.", termsPrefix: "계속하면", termsLabel: "이용약관", termsAnd: "및", privacyLabel: "개인정보 처리방침에 동의하게 됩니다." },
    pricing: { ...baseProduct.pricing, back: "워크벤치로 돌아가기", eyebrow: "요금제", title: "무료로 시작하고, 필요할 때 Pro로 업그레이드하세요", lead: "첫 AI 언어 대화를 무료로 체험해보세요.", freeKicker: "먼저 체험하기", freeName: "Free", freeTerm: "1분 체험", freeSubtitle: "첫 대화를 가볍게 시작해보세요.", freeFeatures: ["1분 AI 대화", "음성 입력", "목표 언어로 AI 답변", "번역", "AI 답변 듣기", "기본 단어 설명", "기본 발음 피드백", "카드 등록 불필요"], freeNote: "카드 등록 없이 전체 흐름을 체험하세요.", freeCta: "무료로 체험", proKicker: "무제한 연습", proBadge: "가장 인기", proSubtitle: "매일 원하는 만큼 연습하세요.", proFeatures: ["AI 대화 무제한", "음성 대화", "목표 언어 답변", "즉시 번역", "AI 음성 / TTS", "느리게 듣기", "단어와 표현 설명", "발음 피드백", "문법 교정", "자연스러운 표현 제안", "저장한 단어와 표현", "대화 기록", "맞춤형 연습", "학습 진행 상황"], proCta: "Pro 시작하기", annualKicker: "연간 결제로 더 절약", annualName: "Pro 연간", annualDescription: "한 번 결제하고 1년 동안 계속 연습하세요.", annualSavings: "49% 절약", annualCta: "Pro 선택", monthEquivalent: "$6.67 / month" },
    workbench: { ...baseProduct.workbench, nav: { home: "홈", history: "대화 기록", cards: "저장한 카드", reading: "영어 읽기", partners: "Tutor", aria: "연습 공간" }, accountPlan: "무료 플랜", title: "AI 언어 튜터", mobileTitle: "홈", subtitle: "영어를 듣고, 영어 또는 내 언어로 답해보세요.", upgradeCta: "Pro 시작", partnerGenderOrigin: "여성 · 발렌시아 출신", partnerDescription: "차분하고 관찰력이 좋으며 은근히 재치 있어요", customize: "맞춤 설정", changePartner: "Tutor 변경", partnerSettings: "Tutor 설정", partnerReady: "Clara가 편안한 대화를 시작할 준비가 되었어요.", closePartner: "Tutor 설정 닫기", practiceMode: "연습 모드", sayItMode: "Say It / 번역", talkMode: "Talk / 대화", stats: ["분", "메시지", "내 차례", "입력 단어"], startConversation: "새 대화", startingConversation: "시작 중…", today: "오늘", listen: "듣기", slow: "느리게", hide: "숨기기", translation: "번역", lost: "잘 모르겠어요", gotIt: "이해했어요", showHints: "힌트 보기", releaseToSend: "놓으면 전송", sending: "전송 중…", typeSayIt: "말하고 싶은 내용을 입력하세요", typeTalk: "영어 또는 내 언어로 답하세요", messageLabel: "메시지", holdToSpeak: "길게 눌러 말하고 놓으면 전송", sendMessage: "메시지 보내기", voiceUnsupported: "이 브라우저에서는 음성 입력을 지원하지 않습니다. Chrome 또는 Edge를 사용해보세요.", micDenied: "마이크 권한이 거부되었습니다. 권한을 허용한 뒤 다시 시도해주세요.", voiceUnclear: "잘 듣지 못했어요. 다시 말해보세요.", sent: "전송됨", insightTranslate: "번역", insightGrammar: "문법", insightEmptyTitle: "텍스트를 선택하거나 입력하세요", insightEmptyBody: "Clara의 단어나 표현을 선택하거나 아래에 입력하면 뜻과 문법을 확인할 수 있어요.", selectedTranslateBody: "다음 대화에서 이해하고 바로 사용할 수 있는 자연스러운 문장입니다.", selectedGrammarBody: "어순과 일상적인 표현을 확인하고 소리 내어 한 번 말해보세요.", saveCard: "학습 카드 저장", lookupPlaceholder: "Clara의 단어나 표현을 입력하세요", lookupLabel: "단어 검색", privateNote: "대화는 비공개로 계정에 저장됩니다.", modal: { close: "언어 설정 닫기", eyebrow: "시작하기", title: "언어를 선택하세요", lead: "이미 할 수 있는 언어와 연습하고 싶은 언어를 알려주세요. 나중에 변경할 수 있습니다.", native: "내가 할 수 있는 언어", learning: "배우는 언어", level: "내 수준", later: "나중에 선택", start: "말하기 시작" }, languageNames: { Chinese: "중국어", English: "영어", Spanish: "스페인어", Japanese: "일본어", French: "프랑스어", Korean: "한국어" }, levels: { "Auto-detect": "자동 감지", Beginner: "초급", Intermediate: "중급", Advanced: "고급" } }
  },
  "zh-CN": {
    ...baseProduct,
    demo: createDemo({
      productName: "AI 语言导师",
      languagePairLabel: "当前语言组合",
      scenarioLabel: "会话场景",
      contextLabel: "场景",
      userLabel: "你",
      tutorLabel: "AI Tutor",
      userInstruction: "用你的话告诉 Tutor 意思",
      responseLabel: "目标语言表达",
      actions: ["听一遍", "翻译", "学会它"],
      moreNaturalLabel: "更自然的说法：",
      practiceCta: "练习这句话",
      learningFlow: ["用中文说明", "AI理解意思", "学习自然表达", "开口说"],
      scenarioNames: ["机场", "咖啡店", "餐厅", "酒店"],
      visualLabels: ["机场问路", "咖啡点单", "菜单问题", "办理入住"],
      visualMetas: ["明天 · 2号航站楼", "早上 · 柜台", "晚餐 · 点餐中", "晚上 · 前台"],
      visualDetails: ["24号登机口", "外带", "素食", "预订"],
      naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
    }),
    home: { ...baseProduct.home, flowSteps: ["开口说", "理解意思", "继续练"], flowNote: "不用先学完一整课。每一次对话都会告诉你下一步最需要练什么。" },
    auth: { ...baseProduct.auth, ariaLabel: "登录", closeLabel: "关闭登录", eyebrow: "AI 语言导师", title: "登录后继续练习", lead: "和 AI Tutor 练习真实对话，登录后可以保留你的会话和学习进度。", google: "使用 Google 继续", googleLoading: "正在连接 Google", emailLabel: "邮箱地址", emailPlaceholder: "you@example.com", emailCta: "使用邮箱继续", emailSending: "正在发送登录链接", emailSent: "请查收邮箱中的登录链接。新邮箱地址会自动注册。", invalidEmail: "请输入有效的邮箱地址。", emailError: "登录链接发送失败，请重试。", orContinueWith: "或使用邮箱继续", accountNote: "使用 Google 或邮箱登录后，你的 Tutor、会话记录和学习卡片会保存在同一个账号里。", demoMode: "当前是演示模式。配置 Supabase 环境变量后才能启用登录。", callbackError: "登录没有完成，请重试。", termsPrefix: "继续操作即表示你同意", termsLabel: "服务条款", termsAnd: "和", privacyLabel: "隐私政策。" },
    pricing: { ...baseProduct.pricing, back: "返回工作台", eyebrow: "价格", title: "先免费练习，准备好后再升级", lead: "先免费体验一次 AI 语言会话。", freeKicker: "先体验", freeName: "Free", freeTerm: "1分钟体验", freeSubtitle: "先完成你的第一次会话。", freeFeatures: ["1分钟 AI 会话", "语音输入", "AI 用目标语言回复", "即时翻译", "收听 AI 回复", "基础词汇解释", "基础发音反馈", "无需信用卡"], freeNote: "完整体验一次产品流程，不需要绑定信用卡。", freeCta: "免费体验", proKicker: "无限练习", proBadge: "最受欢迎", proSubtitle: "每天想练多久都可以。", proFeatures: ["无限 AI 会话", "语音对话", "目标语言回复", "即时翻译", "AI 语音 / TTS", "慢速播放", "单词和短语解释", "发音反馈", "语法纠正", "自然表达建议", "保存单词和短语", "会话历史", "个性化练习", "学习进度追踪"], proCta: "开始 Pro", annualKicker: "年付更划算", annualName: "Pro 年付", annualDescription: "一次付款，全年持续练习。", annualSavings: "节省 49%", annualCta: "选择 Pro", monthEquivalent: "$6.67 / month" },
    workbench: { ...baseProduct.workbench, nav: { home: "首页", history: "会话记录", cards: "学习卡片", reading: "英语阅读", partners: "Tutor", aria: "练习工作台" }, accountPlan: "免费方案", title: "AI 语言导师", mobileTitle: "首页", subtitle: "听英语，也可以用英语或中文回复。", upgradeCta: "开始 Pro", partnerGenderOrigin: "女性 · 来自瓦伦西亚", partnerDescription: "平静、细心，偶尔带点幽默", customize: "自定义", changePartner: "更换 Tutor", partnerSettings: "Tutor 设置", partnerReady: "Clara 已经准备好和你轻松聊一会儿了。", closePartner: "关闭 Tutor 设置", practiceMode: "练习模式", sayItMode: "Say It / 翻译", talkMode: "Talk / 对话", stats: ["分钟", "消息", "你的回合", "输入词数"], startConversation: "新建会话", startingConversation: "正在开始…", today: "今天", listen: "听一遍", slow: "慢速", hide: "隐藏", translation: "翻译", lost: "我没听懂", gotIt: "我明白了", showHints: "显示提示", releaseToSend: "松开发送", sending: "发送中…", typeSayIt: "输入你想表达的意思", typeTalk: "用英语或中文回复", messageLabel: "消息", holdToSpeak: "按住说话，松开发送", sendMessage: "发送消息", voiceUnsupported: "当前浏览器不支持语音输入，请使用 Chrome 或 Edge。", micDenied: "麦克风权限被拒绝，请允许使用麦克风后重试。", voiceUnclear: "没有听清，请再说一次。", sent: "已发送", insightTranslate: "翻译", insightGrammar: "语法", insightEmptyTitle: "选中或输入文字", insightEmptyBody: "选中 Clara 说的单词或短语，或者在下方输入，就能查看含义或语法。", selectedTranslateBody: "这是一句你可以理解并在下一次会话中使用的自然表达。", selectedGrammarBody: "留意词序和日常表达，然后大声说一遍。", saveCard: "保存为学习卡片", lookupPlaceholder: "输入 Clara 说的单词或短语", lookupLabel: "查词", privateNote: "你的会话是私密的，并会保存到账号中。", modal: { close: "关闭语言设置", eyebrow: "开始练习", title: "选择你的语言", lead: "告诉 Tutor 你会什么语言，以及想练习什么语言。之后可以随时更改。", native: "我会说", learning: "我正在学习", level: "我的水平", later: "以后再选", start: "开始说话" }, languageNames: { Chinese: "中文", English: "英语", Spanish: "西班牙语", Japanese: "日语", French: "法语", Korean: "韩语" }, levels: { "Auto-detect": "自动判断", Beginner: "初级", Intermediate: "中级", Advanced: "高级" } }
  },
  "zh-TW": {
    ...baseProduct,
    demo: createDemo({
      productName: "AI 語言導師",
      languagePairLabel: "目前語言組合",
      scenarioLabel: "對話情境",
      contextLabel: "情境",
      userLabel: "你",
      tutorLabel: "AI Tutor",
      userInstruction: "用你的話告訴 Tutor 意思",
      responseLabel: "目標語言表達",
      actions: ["聽一遍", "翻譯", "學會它"],
      moreNaturalLabel: "更自然的說法：",
      practiceCta: "練習這句話",
      learningFlow: ["用中文說明", "AI 理解意思", "學習自然表達", "開口說"],
      scenarioNames: ["機場", "咖啡店", "餐廳", "飯店"],
      visualLabels: ["機場詢問", "咖啡點單", "菜單問題", "辦理入住"],
      visualMetas: ["明天 · 第2航廈", "早上 · 櫃台", "晚餐 · 點餐中", "晚上 · 櫃台"],
      visualDetails: ["24號登機門", "外帶", "素食", "預訂"],
      naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
    }),
    home: { ...baseProduct.home, flowSteps: ["開口說", "理解意思", "繼續練"], flowNote: "不用先學完一整課。每一次對話都會告訴你下一步最需要練什麼。" },
    auth: { ...baseProduct.auth, ariaLabel: "登入", closeLabel: "關閉登入", eyebrow: "AI 語言導師", title: "登入後繼續練習", lead: "和 AI Tutor 練習真實對話，登入後可以保留你的會話和學習進度。", google: "使用 Google 繼續", googleLoading: "正在連線 Google", emailLabel: "電子郵件地址", emailPlaceholder: "you@example.com", emailCta: "使用電子郵件繼續", emailSending: "正在傳送登入連結", emailSent: "請查收電子郵件中的登入連結。新的電子郵件地址會自動註冊。", invalidEmail: "請輸入有效的電子郵件地址。", emailError: "登入連結傳送失敗，請重試。", orContinueWith: "或使用電子郵件繼續", accountNote: "使用 Google 或電子郵件登入後，你的 Tutor、會話記錄和學習卡片會保存在同一個帳號裡。", demoMode: "目前是展示模式。設定 Supabase 環境變數後才能啟用登入。", callbackError: "登入沒有完成，請重試。", termsPrefix: "繼續操作即表示你同意", termsLabel: "服務條款", termsAnd: "和", privacyLabel: "隱私政策。" },
    pricing: { ...baseProduct.pricing, back: "返回工作台", eyebrow: "價格", title: "先免費練習，準備好後再升級", lead: "先免費體驗一次 AI 語言會話。", freeKicker: "先體驗", freeName: "Free", freeTerm: "1分鐘體驗", freeSubtitle: "先完成你的第一次會話。", freeFeatures: ["1分鐘 AI 會話", "語音輸入", "AI 用目標語言回覆", "即時翻譯", "收聽 AI 回覆", "基礎詞彙解釋", "基礎發音回饋", "不需要信用卡"], freeNote: "完整體驗一次產品流程，不需要綁定信用卡。", freeCta: "免費體驗", proKicker: "無限練習", proBadge: "最受歡迎", proSubtitle: "每天想練多久都可以。", proFeatures: ["無限 AI 會話", "語音對話", "目標語言回覆", "即時翻譯", "AI 語音 / TTS", "慢速播放", "單字和片語解釋", "發音回饋", "文法修正", "自然表達建議", "儲存單字和片語", "會話歷史", "個人化練習", "學習進度追蹤"], proCta: "開始 Pro", annualKicker: "年付更划算", annualName: "Pro 年付", annualDescription: "一次付款，全年持續練習。", annualSavings: "節省 49%", annualCta: "選擇 Pro", monthEquivalent: "$6.67 / month" },
    workbench: { ...baseProduct.workbench, nav: { home: "首頁", history: "會話記錄", cards: "學習卡片", reading: "英語閱讀", partners: "Tutor", aria: "練習工作台" }, accountPlan: "免費方案", title: "AI 語言導師", mobileTitle: "首頁", subtitle: "聽英語，也可以用英語或中文回覆。", upgradeCta: "開始 Pro", partnerGenderOrigin: "女性 · 來自瓦倫西亞", partnerDescription: "平靜、細心，偶爾帶點幽默", customize: "自訂", changePartner: "更換 Tutor", partnerSettings: "Tutor 設定", partnerReady: "Clara 已經準備好和你輕鬆聊一會兒了。", closePartner: "關閉 Tutor 設定", practiceMode: "練習模式", sayItMode: "Say It / 翻譯", talkMode: "Talk / 對話", stats: ["分鐘", "訊息", "你的回合", "輸入字數"], startConversation: "新建會話", startingConversation: "正在開始…", today: "今天", listen: "聽一遍", slow: "慢速", hide: "隱藏", translation: "翻譯", lost: "我沒聽懂", gotIt: "我明白了", showHints: "顯示提示", releaseToSend: "放開傳送", sending: "傳送中…", typeSayIt: "輸入你想表達的意思", typeTalk: "用英語或中文回覆", messageLabel: "訊息", holdToSpeak: "按住說話，放開傳送", sendMessage: "傳送訊息", voiceUnsupported: "目前瀏覽器不支援語音輸入，請使用 Chrome 或 Edge。", micDenied: "麥克風權限被拒絕，請允許使用麥克風後重試。", voiceUnclear: "沒有聽清楚，請再說一次。", sent: "已傳送", insightTranslate: "翻譯", insightGrammar: "文法", insightEmptyTitle: "選取或輸入文字", insightEmptyBody: "選取 Clara 說的單字或片語，或在下方輸入，就能查看意思或文法。", selectedTranslateBody: "這是一句你可以理解並在下一次會話中使用的自然表達。", selectedGrammarBody: "留意詞序和日常表達，然後大聲說一次。", saveCard: "儲存為學習卡片", lookupPlaceholder: "輸入 Clara 說的單字或片語", lookupLabel: "查詞", privateNote: "你的會話是私密的，並會儲存到帳號中。", modal: { close: "關閉語言設定", eyebrow: "開始練習", title: "選擇你的語言", lead: "告訴 Tutor 你會什麼語言，以及想練習什麼語言。之後可以隨時更改。", native: "我會說", learning: "我正在學習", level: "我的程度", later: "以後再選", start: "開始說話" }, languageNames: { Chinese: "中文", English: "英語", Spanish: "西班牙語", Japanese: "日語", French: "法語", Korean: "韓語" }, levels: { "Auto-detect": "自動判斷", Beginner: "初級", Intermediate: "中級", Advanced: "高級" } }
  },
  es: {
    ...baseProduct,
    demo: createDemo({
      productName: "AI Language Tutor",
      languagePairLabel: "Combinación actual",
      scenarioLabel: "Situación de conversación",
      contextLabel: "contexto",
      userLabel: "Tú",
      tutorLabel: "AI Tutor",
      userInstruction: "Dile a tu tutor lo que quieres expresar",
      responseLabel: "Respuesta en el idioma que aprendes",
      actions: ["Escuchar", "Traducir", "Aprender"],
      moreNaturalLabel: "Una forma más natural:",
      practiceCta: "Practicar esta frase",
      learningFlow: ["Habla en tu idioma", "La AI entiende la idea", "Aprende la expresión natural", "Habla tú"],
      scenarioNames: ["Aeropuerto", "Cafetería", "Restaurante", "Hotel"],
      visualLabels: ["Pregunta en el aeropuerto", "Pedido en la cafetería", "Pregunta sobre el menú", "Llegada al hotel"],
      visualMetas: ["Mañana · Terminal 2", "Mañana · Mostrador", "Cena · Pidiendo", "Tarde · Recepción"],
      visualDetails: ["Puerta 24", "Para llevar", "Vegetariano", "Reserva"],
      naturalPhrases: ["Excuse me, where is Gate 24?", "Can I get this to go, please?", "Do you have any vegetarian dishes?", "Hi, I have a reservation under my name."]
    }),
    home: { ...baseProduct.home, flowSteps: ["Habla", "Entiende", "Practica"], flowNote: "No tienes que terminar una lección antes de hablar. Cada conversación te muestra qué practicar después." },
    auth: { ...baseProduct.auth, ariaLabel: "Iniciar sesión", closeLabel: "Cerrar inicio de sesión", eyebrow: "AI LANGUAGE TUTOR", title: "Inicia sesión para continuar", lead: "Practica conversaciones reales con tu tutor de AI y conserva tu progreso entre sesiones.", google: "Continuar con Google", googleLoading: "Conectando con Google", emailLabel: "Correo electrónico", emailPlaceholder: "you@example.com", emailCta: "Continuar con correo", emailSending: "Enviando enlace de acceso", emailSent: "Revisa tu correo para usar el enlace de acceso. Las nuevas direcciones se registrarán automáticamente.", invalidEmail: "Introduce un correo electrónico válido.", emailError: "No se pudo enviar el enlace de acceso. Inténtalo de nuevo.", orContinueWith: "o continuar con correo", accountNote: "Al iniciar sesión con Google o correo, tu tutor, tus conversaciones y tus tarjetas quedan guardados juntos.", demoMode: "El modo demo está activo. Añade las variables de Supabase para habilitar el inicio de sesión.", callbackError: "No se pudo completar el inicio de sesión. Inténtalo de nuevo.", termsPrefix: "Al continuar, aceptas nuestros", termsLabel: "Términos", termsAnd: "y", privacyLabel: "Política de privacidad." },
    pricing: { ...baseProduct.pricing, back: "Volver al espacio de práctica", eyebrow: "Precios", title: "Practica gratis y mejora cuando estés listo", lead: "Prueba tu primera conversación con AI sin pagar.", freeKicker: "Empieza probando", freeName: "Free", freeTerm: "Prueba de 1 minuto", freeSubtitle: "Descubre tu primera conversación.", freeFeatures: ["1 minuto de conversación con AI", "Entrada por voz", "Respuestas en el idioma que aprendes", "Traducción", "Escucha las respuestas", "Explicaciones básicas de palabras", "Comentarios básicos de pronunciación", "Sin tarjeta bancaria"], freeNote: "Prueba la experiencia completa sin añadir una tarjeta.", freeCta: "Probar gratis", proKicker: "Práctica ilimitada", proBadge: "Más popular", proSubtitle: "Practica cada día sin límites.", proFeatures: ["Conversaciones ilimitadas con AI", "Conversaciones por voz", "Respuestas en el idioma objetivo", "Traducción instantánea", "Voz AI / TTS", "Reproducción lenta", "Explicaciones de palabras y frases", "Comentarios de pronunciación", "Correcciones gramaticales", "Sugerencias naturales", "Palabras y frases guardadas", "Historial de conversaciones", "Práctica personalizada", "Seguimiento del progreso"], proCta: "Empezar Pro", annualKicker: "Ahorra con el plan anual", annualName: "Pro anual", annualDescription: "Paga una vez y practica durante todo el año.", annualSavings: "Ahorra un 49%", annualCta: "Elegir Pro", monthEquivalent: "$6.67 / month" },
    workbench: { ...baseProduct.workbench, nav: { home: "Inicio", history: "Historial de chats", cards: "Tarjetas guardadas", reading: "Lectura en inglés", partners: "Tutores", aria: "Espacio de práctica" }, accountPlan: "Plan gratuito", title: "AI Language Tutor", mobileTitle: "Inicio", subtitle: "Escucha en inglés y responde en inglés o en tu propio idioma.", upgradeCta: "Empezar Pro", partnerGenderOrigin: "Mujer · De Valencia", partnerDescription: "Tranquila, observadora y sutilmente ingeniosa", customize: "Personalizar", changePartner: "Cambiar tutor", partnerSettings: "Ajustes del tutor", partnerReady: "Clara está lista para una conversación tranquila.", closePartner: "Cerrar ajustes del tutor", practiceMode: "Modo de práctica", sayItMode: "Say It / Traducir", talkMode: "Talk / Conversación", stats: ["MINUTOS", "MENSAJES", "TUS TURNOS", "PALABRAS"], startConversation: "Nueva conversación", startingConversation: "Iniciando…", today: "HOY", listen: "Escuchar", slow: "Lento", hide: "Ocultar", translation: "Traducción", lost: "Me he perdido", gotIt: "¿Lo he entendido?", showHints: "Mostrar pistas", releaseToSend: "Suelta para enviar", sending: "Enviando…", typeSayIt: "Escribe lo que quieres decir", typeTalk: "Responde en inglés o en tu idioma", messageLabel: "Mensaje", holdToSpeak: "Mantén pulsado para hablar y suelta para enviar", sendMessage: "Enviar mensaje", voiceUnsupported: "Este navegador no admite entrada de voz. Prueba Chrome o Edge.", micDenied: "Se denegó el permiso del micrófono. Permítelo y vuelve a intentarlo.", voiceUnclear: "No te he entendido. Vuelve a intentarlo.", sent: "Enviado", insightTranslate: "Traducir", insightGrammar: "Gramática", insightEmptyTitle: "Selecciona o escribe texto", insightEmptyBody: "Selecciona una palabra o frase de Clara o escríbela abajo para ver su significado o gramática.", selectedTranslateBody: "Una frase natural que puedes entender y usar en tu próxima conversación.", selectedGrammarBody: "Fíjate en el orden de las palabras y en la expresión cotidiana. Dilo en voz alta.", saveCard: "Guardar tarjeta de aprendizaje", lookupPlaceholder: "Escribe una palabra o frase de Clara", lookupLabel: "Buscar palabra", privateNote: "Tu conversación es privada y se guarda en tu cuenta.", modal: { close: "Cerrar ajustes de idioma", eyebrow: "EMPEZAR", title: "Elige tus idiomas", lead: "Dile a tu tutor qué idioma ya hablas y cuál quieres practicar. Podrás cambiarlo más adelante.", native: "Hablo", learning: "Estoy aprendiendo", level: "Mi nivel", later: "Elegir más tarde", start: "Empezar a hablar" }, languageNames: { Chinese: "Chino", English: "Inglés", Spanish: "Español", Japanese: "Japonés", French: "Francés", Korean: "Coreano" }, levels: { "Auto-detect": "Detectar automáticamente", Beginner: "Principiante", Intermediate: "Intermedio", Advanced: "Avanzado" } }
  }
};

const localizedPricingUi: Record<Exclude<Locale, "en">, Partial<ProductCopy["pricing"]>> = {
  ja: {
    plansLabel: "料金プラン",
    freeName: "無料",
    month: "月",
    year: "年",
    monthEquivalent: "$6.67 / 月",
    supabaseNotice: "有料プランの購入を始める前に、ログイン機能の設定が必要です。",
    pendingNotice: "決済機能の設定がまだ完了していません。しばらくしてからもう一度お試しください。",
    checkoutNotice: "決済を開始できませんでした。もう一度お試しください。",
    popupBlockedNotice: "ブラウザによって決済タブがブロックされました。",
    openCheckout: "安全な決済ページを開く"
  },
  th: {
    plansLabel: "แพ็กเกจสมาชิก",
    freeName: "ฟรี",
    month: "เดือน",
    year: "ปี",
    monthEquivalent: "$6.67 / เดือน",
    supabaseNotice: "ต้องตั้งค่าระบบเข้าสู่ระบบก่อนเริ่มชำระเงินสำหรับแพ็กเกจแบบเสียค่าใช้จ่าย",
    pendingNotice: "ระบบชำระเงินยังตั้งค่าไม่เสร็จ กรุณาลองใหม่อีกครั้งในภายหลัง",
    checkoutNotice: "เริ่มขั้นตอนชำระเงินไม่ได้ กรุณาลองอีกครั้ง",
    popupBlockedNotice: "เบราว์เซอร์บล็อกแท็บชำระเงิน",
    openCheckout: "เปิดหน้าชำระเงินที่ปลอดภัย"
  },
  ko: {
    plansLabel: "구독 요금제",
    freeName: "무료",
    month: "개월",
    year: "년",
    monthEquivalent: "$6.67 / 월",
    supabaseNotice: "유료 결제를 시작하려면 먼저 로그인 기능을 설정해야 합니다.",
    pendingNotice: "결제 기능 설정이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.",
    checkoutNotice: "결제를 시작하지 못했습니다. 다시 시도해 주세요.",
    popupBlockedNotice: "브라우저에서 결제 탭을 차단했습니다.",
    openCheckout: "안전한 결제 페이지 열기"
  },
  "zh-CN": {
    plansLabel: "订阅方案",
    freeName: "免费",
    month: "月",
    year: "年",
    monthEquivalent: "$6.67 / 月",
    supabaseNotice: "开始付费结算前，需要先完成登录服务配置。",
    pendingNotice: "支付功能尚未配置完成，请稍后再试。",
    checkoutNotice: "无法开始支付，请重试。",
    popupBlockedNotice: "浏览器阻止了支付页面的新标签页。",
    openCheckout: "打开安全支付页面"
  },
  "zh-TW": {
    plansLabel: "訂閱方案",
    freeName: "免費",
    month: "月",
    year: "年",
    monthEquivalent: "$6.67 / 月",
    supabaseNotice: "開始付費結帳前，需要先完成登入服務設定。",
    pendingNotice: "付款功能尚未設定完成，請稍後再試。",
    checkoutNotice: "無法開始付款，請重試。",
    popupBlockedNotice: "瀏覽器封鎖了付款頁面的新分頁。",
    openCheckout: "開啟安全付款頁面"
  },
  es: {
    plansLabel: "Planes de suscripción",
    freeName: "Gratis",
    month: "mes",
    year: "año",
    monthEquivalent: "$6.67 / mes",
    supabaseNotice: "Es necesario configurar el inicio de sesión antes de iniciar un pago.",
    pendingNotice: "La configuración de pagos todavía no está completa. Inténtalo de nuevo más tarde.",
    checkoutNotice: "No se pudo iniciar el pago. Vuelve a intentarlo.",
    popupBlockedNotice: "El navegador bloqueó la pestaña de pago.",
    openCheckout: "Abrir pago seguro"
  }
};

const localizedWorkbenchUi: Record<Exclude<Locale, "en">, Pick<ProductCopy["workbench"], "languageSettingsLabel"> & { german: string }> = {
  ja: { languageSettingsLabel: "現在の言語ペア", german: "ドイツ語" },
  th: { languageSettingsLabel: "คู่ภาษาปัจจุบัน", german: "ภาษาเยอรมัน" },
  ko: { languageSettingsLabel: "현재 언어 조합", german: "독일어" },
  "zh-CN": { languageSettingsLabel: "当前语言组合", german: "德语" },
  "zh-TW": { languageSettingsLabel: "目前語言組合", german: "德語" },
  es: { languageSettingsLabel: "Combinación de idiomas actual", german: "Alemán" }
};

function originalProductCopy(locale: Locale): ProductCopy {
  if (locale === "en") {
    return {
      ...baseProduct,
      workbench: {
        ...baseProduct.workbench,
        languageNames: { ...baseProduct.workbench.languageNames, German: "German" }
      }
    };
  }

  const product = localized[locale];
  const workbenchUi = localizedWorkbenchUi[locale];
  return {
    ...product,
    pricing: { ...product.pricing, ...localizedPricingUi[locale] },
    workbench: {
      ...product.workbench,
      languageSettingsLabel: workbenchUi.languageSettingsLabel,
      languageNames: { ...product.workbench.languageNames, German: workbenchUi.german }
    }
  };
}

export function getProductCopy(locale: Locale): ProductCopy {
  const product = originalProductCopy(locale);
  const feedback = repeatCopy[locale];
  return {
    ...product,
    home: { ...product.home, pronunciation: {
      ...product.home.pronunciation,
      label: feedback.label,
      feedbackLabel: feedback.label,
      feedbackTitle: feedback.label,
      feedbackBody: feedback.note,
      copy: feedback.note
    } },
    pricing: { ...product.pricing,
      freeTerm: trialLabels[locale],
      freeNote: trialLabels[locale],
      proFallbackPrice: `$${monthlyUsd.toFixed(2)}`,
      annualFallbackPrice: `$${annualUsd.toFixed(2)}`,
      freeFeatures: product.pricing.freeFeatures.map((value, index) => index === 0 ? trialLabels[locale] : honestFeedbackLabel(value, locale)),
      proFeatures: product.pricing.proFeatures.map((value) => honestFeedbackLabel(value, locale))
    }
  };
}
