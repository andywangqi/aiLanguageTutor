import type { Locale } from "./config";

export type HomepageStep = { title: string; description: string };
export type HomepageScenario = { title: string; description: string; cta: string; badge?: string };

export type HomepageCopy = {
  heroEyebrow: string;
  heroTitleA: string;
  heroTitleB: string;
  heroLead: string;
  cta: string;
  noCard: string;
  ownPace: string;
  heroLangs: Array<{ code: string; name: string; flag: string }>;
  demoLang: string;
  demo: {
    q1: string;
    learner: string;
    helpTitle: string;
    trySaying: string;
    quote: string;
    listen: string;
    retry: string;
    followUp: string;
    tap: string;
  };
  how: { kicker: string; h2a: string; h2b: string; lead: string; steps: HomepageStep[] };
  scenarios: { h2: string; lead: string; cards: HomepageScenario[] };
  unstuck: { kicker: string; h2: string; lead: string; points: string[]; bubbleTop: string; bubbleMid: string };
  miniLangs: { kicker: string; h2: string; lead: string; viewAll: string };
  lessons: {
    h2: string;
    features: HomepageStep[];
    sumTitle: string;
    tabs: string[];
    sumItems: Array<{ title: string; sub: string }>;
  };
  betterway: { kicker: string; h2: string; features: HomepageStep[] };
  final: { h2: string; lead: string; cta: string; note: string; free: string; steps: string[] };
};

const en: HomepageCopy = {
  heroEyebrow: "AI Language Tutor · Real Conversation Practice",
  heroTitleA: "AI Language Tutor",
  heroTitleB: "Real Conversations",
  heroLead: "Practice speaking with an AI tutor that helps you say what you mean, get unstuck, and keep the conversation going — in the language you want to learn.",
  cta: "Start Speaking Free",
  noCard: "No credit card required",
  ownPace: "Practice at your own pace",
  heroLangs: [
    { code: "en", name: "English", flag: "us" },
    { code: "es", name: "Spanish", flag: "es" },
    { code: "fr", name: "French", flag: "fr" },
    { code: "de", name: "German", flag: "de" },
    { code: "ja", name: "Japanese", flag: "jp" }
  ],
  demoLang: "English",
  demo: {
    q1: "What did you do last weekend?",
    learner: "I… went to… um…",
    helpTitle: "Help Me Say It",
    trySaying: "Try saying:",
    quote: "I went hiking with some friends.",
    listen: "Listen",
    retry: "Try Again",
    followUp: "That sounds great! What was the best part of the trip?",
    tap: "Tap to speak"
  },
  how: {
    kicker: "THE MAGIC MOMENT",
    h2a: "Don't Know How to Say It?",
    h2b: "Keep Talking.",
    lead: "You don't need to know the perfect sentence. Tell your tutor what you mean, and get a natural expression in the language you're learning.",
    steps: [
      { title: "Tell It", description: "Explain what you mean in your own words." },
      { title: "Get Help", description: "Your AI tutor gives you a natural expression." },
      { title: "Say It", description: "Listen, repeat, and practice saying it." },
      { title: "Keep Talking", description: "Use it in the conversation and build your confidence." }
    ]
  },
  scenarios: {
    h2: "Practice Conversations You Actually Need",
    lead: "Choose a scenario and start practicing real conversations.",
    cards: [
      { title: "Job Interview", description: "Practice answering interview questions naturally.", cta: "Start Interview Practice", badge: "Most Popular" },
      { title: "Work", description: "Practice meetings, presentations, and everyday work conversations.", cta: "Start Work Practice" },
      { title: "Travel", description: "Practice the conversations you'll need while traveling.", cta: "Start Travel Practice" },
      { title: "Everyday", description: "Talk about your day, interests, and real-life situations.", cta: "Start Everyday Practice" }
    ]
  },
  unstuck: {
    kicker: "HELP ME SAY IT",
    h2: "Get Unstuck Without Ending the Conversation",
    lead: "Don't know the right words? Tell your tutor what you mean.",
    points: ["Get a natural expression", "Listen to it", "Say it again", "Keep talking"],
    bubbleTop: "I want to go hiking this weekend.",
    bubbleMid: "Here's a natural way to say it: “I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "30+ LANGUAGES",
    h2: "Learn the Language You Want to Speak",
    lead: "Use your own language when you need help. Practice in the language you're learning.",
    viewAll: "View all languages"
  },
  lessons: {
    h2: "Your Conversations Become Your Lessons",
    features: [
      { title: "Natural Corrections", description: "See a more natural way to express yourself." },
      { title: "Useful Phrases", description: "Save expressions you can use right away." },
      { title: "Vocabulary", description: "Build your vocabulary step by step." },
      { title: "Review & Practice", description: "Revisit your conversations and keep improving." }
    ],
    sumTitle: "Conversation Summary",
    tabs: ["Phrases", "Corrections", "New Words"],
    sumItems: [
      { title: "It was a great experience.", sub: "Natural expression" },
      { title: "I really enjoyed the trip.", sub: "Saved phrase" }
    ]
  },
  betterway: {
    kicker: "WHY AI LANGUAGE TUTOR",
    h2: "A Better Way to Practice Speaking",
    features: [
      { title: "Practice Without Pressure", description: "Make mistakes, ask questions, and learn at your own pace." },
      { title: "Speak at Your Own Pace", description: "Take your time, your AI tutor will wait." },
      { title: "Practice Anytime", description: "No tutor schedule. No classroom. Just start talking." }
    ]
  },
  final: {
    h2: "Say What You Mean. Keep Talking.",
    lead: "Start your first AI conversation and get help whenever you get stuck.",
    cta: "Start Speaking Free",
    note: "No credit card required",
    free: "Free conversation included",
    steps: ["Choose a scenario", "Start talking", "Get help when you're stuck"]
  }
};

const ja: HomepageCopy = {
  heroEyebrow: "AI英会話 · 実際の会話で練習",
  heroTitleA: "AI英会話チューターで",
  heroTitleB: "リアルな会話を練習",
  heroLead: "言いたいことが言えないときも、AIチューターが自然な英語を教えてくれる。そのまま会話を続けながら、話せる英語を身につけよう。",
  cta: "無料で話してみる",
  noCard: "クレカ登録なし",
  ownPace: "自分のペースで練習",
  heroLangs: [
    { code: "en", name: "英語", flag: "us" },
    { code: "es", name: "スペイン語", flag: "es" },
    { code: "fr", name: "フランス語", flag: "fr" },
    { code: "de", name: "ドイツ語", flag: "de" },
    { code: "ja", name: "日本語", flag: "jp" }
  ],
  demoLang: "英語",
  demo: {
    q1: "週末は何をして過ごしたの?",
    learner: "えっと、その…うーん…",
    helpTitle: "言い方ヘルプ",
    trySaying: "こう言ってみよう:",
    quote: "I went hiking with some friends.",
    listen: "聞く",
    retry: "もう一度",
    followUp: "いいね!旅行で一番よかったのはどこ?",
    tap: "タップして話す"
  },
  how: {
    kicker: "つまずいても止まらない",
    h2a: "言い方がわからなくても、",
    h2b: "会話は続けられる。",
    lead: "完璧な文を考える必要はない。伝えたいことをそのまま話せば、学びたい言語での自然な言い方が返ってくる。",
    steps: [
      { title: "伝える", description: "言いたいことを自分の言葉で説明するだけ。" },
      { title: "教えてもらう", description: "AIチューターが自然な表現を提案してくれる。" },
      { title: "言ってみる", description: "聞いて、真似して、声に出して練習。" },
      { title: "会話に戻る", description: "覚えた表現をそのまま会話で使って、自信をつける。" }
    ]
  },
  scenarios: {
    h2: "本当に使う場面から練習できる",
    lead: "場面を選んで、今日から実践的な英会話を始めよう。",
    cards: [
      { title: "面接", description: "英語面接の質問に、自然に答える練習。", cta: "面接の練習を始める", badge: "一番人気" },
      { title: "仕事", description: "会議、プレゼン、日常の仕事のやり取りを練習。", cta: "仕事の英語を練習" },
      { title: "旅行", description: "旅先で本当に使う会話を練習。", cta: "旅行の英語を練習" },
      { title: "日常", description: "一日あったことや趣味など、身近な話題で話す。", cta: "日常の英語を練習" }
    ]
  },
  unstuck: {
    kicker: "言い方ヘルプ",
    h2: "会話を止めずに、つまずきを解消",
    lead: "ぴったりの言葉が出てこなくても大丈夫。伝えたいことを話してみよう。",
    points: ["自然な表現がもらえる", "音声で聞ける", "もう一度言ってみる", "そのまま会話を続ける"],
    bubbleTop: "週末にハイキングに行きたいんだよね。",
    bubbleMid: "自然な言い方はこう: “I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "30以上の言語に対応",
    h2: "学びたい言語で、そのまま練習",
    lead: "困ったときは日本語で聞ける。練習は学びたい言語で進められる。",
    viewAll: "すべての言語を見る"
  },
  lessons: {
    h2: "話した会話が、そのまま教材になる",
    features: [
      { title: "自然な言い直し", description: "もっと自然な言い方が一目でわかる。" },
      { title: "使えるフレーズ", description: "すぐ使える表現だけを保存できる。" },
      { title: "語彙", description: "会話に出た単語から少しずつ増やせる。" },
      { title: "復習と練習", description: "話した内容を振り返って、着実に伸ばせる。" }
    ],
    sumTitle: "会話のまとめ",
    tabs: ["フレーズ", "言い直し", "新出単語"],
    sumItems: [
      { title: "It was a great experience.", sub: "自然な表現" },
      { title: "I really enjoyed the trip.", sub: "保存したフレーズ" }
    ]
  },
  betterway: {
    kicker: "AI LANGUAGE TUTORが選ばれる理由",
    h2: "スピーキング練習の、もっといいやり方",
    features: [
      { title: "気負わず練習", description: "間違えても大丈夫。質問しながら自分のペースで。" },
      { title: "自分のペースで話せる", description: "急かされない。チューターは待ってくれる。" },
      { title: "いつでも練習", description: "予約も教室もいらない。話したいときにすぐ始められる。" }
    ]
  },
  final: {
    h2: "言いたいことを、そのまま言葉に。",
    lead: "最初のAI英会話を始めて、つまずいたらいつでも助けてもらおう。",
    cta: "無料で話してみる",
    note: "クレカ登録なし",
    free: "無料の会話つき",
    steps: ["場面を選ぶ", "話し始める", "困ったら助けてもらう"]
  }
};

const th: HomepageCopy = {
  heroEyebrow: "AI Language Tutor · ฝึกจากบทสนทนาจริง",
  heroTitleA: "ติวเตอร์ AI ที่ช่วยให้",
  heroTitleB: "พูดได้จริงในชีวิตจริง",
  heroLead: "นึกคำไม่ออกก็ไม่ต้องหยุดคุย AI Tutor จะช่วยหาประโยคที่เป็นธรรมชาติให้ แล้วคุณก็ฝึกพูดต่อได้เลย ในภาษาที่อยากเก่ง",
  cta: "เริ่มพูดฟรี",
  noCard: "ไม่ต้องใช้บัตรเครดิต",
  ownPace: "ฝึกตามจังหวะของตัวเอง",
  heroLangs: [
    { code: "en", name: "อังกฤษ", flag: "us" },
    { code: "es", name: "สเปน", flag: "es" },
    { code: "fr", name: "ฝรั่งเศส", flag: "fr" },
    { code: "de", name: "เยอรมัน", flag: "de" },
    { code: "ja", name: "ญี่ปุ่น", flag: "jp" }
  ],
  demoLang: "อังกฤษ",
  demo: {
    q1: "สุดสัปดาห์ที่ผ่านมาไปทำอะไรมา?",
    learner: "เอ่อ…ไป…อืม…",
    helpTitle: "ช่วยหาคำพูด",
    trySaying: "ลองพูดแบบนี้:",
    quote: "I went hiking with some friends.",
    listen: "ฟัง",
    retry: "ลองอีกครั้ง",
    followUp: "ดีจัง! ส่วนที่ดีที่สุดของทริปคืออะไร?",
    tap: "แตะเพื่อพูด"
  },
  how: {
    kicker: "จุดที่เปลี่ยนทุกอย่าง",
    h2a: "นึกคำไม่ออกก็ไม่เป็นไร",
    h2b: "คุยต่อได้เลย",
    lead: "ไม่ต้องรู้ประโยคที่สมบูรณ์แบบ แค่บอก Tutor ว่าอยากสื่ออะไร แล้วรับประโยคที่เป็นธรรมชาติในภาษาที่กำลังเรียน",
    steps: [
      { title: "บอกสิ่งที่อยากสื่อ", description: "อธิบายด้วยคำพูดของคุณเองง่าย ๆ" },
      { title: "รับความช่วยเหลือ", description: "AI Tutor หาประโยคที่เป็นธรรมชาติให้" },
      { title: "ลองพูด", description: "ฟัง พูดตาม แล้วฝึกออกเสียง" },
      { title: "คุยต่อ", description: "เอาประโยคใหม่ไปใช้คุยต่อ สร้างความมั่นใจ" }
    ]
  },
  scenarios: {
    h2: "ฝึกบทสนทนาที่ได้ใช้จริง",
    lead: "เลือกสถานการณ์แล้วเริ่มฝึกพูดได้เลย",
    cards: [
      { title: "สัมภาษณ์งาน", description: "ฝึกตอบคำถามสัมภาษณ์อย่างเป็นธรรมชาติ", cta: "เริ่มฝึกสัมภาษณ์งาน", badge: "ยอดนิยม" },
      { title: "ที่ทำงาน", description: "ฝึกประชุม พรีเซนต์ และบทสนทนาในที่ทำงาน", cta: "เริ่มฝึกภาษาที่ทำงาน" },
      { title: "ท่องเที่ยว", description: "ฝึกบทสนทนาที่ต้องใช้ตอนเที่ยวจริง", cta: "เริ่มฝึกภาษาท่องเที่ยว" },
      { title: "ชีวิตประจำวัน", description: "คุยเรื่องวันนี้ ความสนใจ และชีวิตจริง", cta: "เริ่มฝึกทุกวัน" }
    ]
  },
  unstuck: {
    kicker: "ช่วยหาคำพูด",
    h2: "ติดขัดตรงไหนก็ไปต่อได้ ไม่ต้องจบบทสนทนา",
    lead: "หาคำที่ใช่ไม่เจอใช่ไหม แค่บอก Tutor ว่าอยากสื่ออะไร",
    points: ["ได้ประโยคที่เป็นธรรมชาติ", "ฟังเสียงได้", "พูดตามอีกครั้ง", "คุยต่อได้เลย"],
    bubbleTop: "สุดสัปดาห์นี้อยากไปเดินป่า",
    bubbleMid: "พูดให้เป็นธรรมชาติแบบนี้: “I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "30+ ภาษา",
    h2: "อยากเก่งภาษาไหน ก็ฝึกภาษานั้น",
    lead: "ติดตรงไหนถามเป็นภาษาไทยได้ ส่วนตอนฝึกใช้ภาษาที่กำลังเรียน",
    viewAll: "ดูภาษาทั้งหมด"
  },
  lessons: {
    h2: "ทุกบทสนทนากลายเป็นบทเรียนของคุณ",
    features: [
      { title: "แก้ให้เป็นธรรมชาติ", description: "เห็นวิธีพูดที่ดีกว่าของประโยคตัวเอง" },
      { title: "วลีใช้ได้จริง", description: "เซฟสำนวนที่หยิบไปใช้ได้ทันที" },
      { title: "คำศัพท์", description: "สะสมคำศัพท์ทีละนิดจากบทสนทนา" },
      { title: "ทบทวนและฝึก", description: "กลับมาดูบทสนทนาเก่าแล้วพัฒนาต่อ" }
    ],
    sumTitle: "สรุปบทสนทนา",
    tabs: ["วลี", "ที่แก้ไข", "คำใหม่"],
    sumItems: [
      { title: "It was a great experience.", sub: "ประโยคที่เป็นธรรมชาติ" },
      { title: "I really enjoyed the trip.", sub: "วลีที่เซฟไว้" }
    ]
  },
  betterway: {
    kicker: "ทำไมต้อง AI LANGUAGE TUTOR",
    h2: "วิธีฝึกพูดที่ดีกว่าเดิม",
    features: [
      { title: "ฝึกแบบไม่กดดัน", description: "พูดผิดได้ ถามได้ เรียนตามจังหวะตัวเอง" },
      { title: "พูดตามจังหวะตัวเอง", description: "ไม่ต้องรีบ AI Tutor รอคุณได้" },
      { title: "ฝึกเมื่อไรก็ได้", description: "ไม่ต้องนัด ไม่ต้องเข้าห้องเรียน อยากพูดก็เริ่มเลย" }
    ]
  },
  final: {
    h2: "อยากสื่ออะไร ก็พูดออกมาเลย",
    lead: "เริ่มบทสนทนาแรกกับ AI แล้วขอความช่วยเหลือได้ทุกครั้งที่ติดขัด",
    cta: "เริ่มพูดฟรี",
    note: "ไม่ต้องใช้บัตรเครดิต",
    free: "แถมบทสนทนาฟรี",
    steps: ["เลือกสถานการณ์", "เริ่มพูด", "ติดตรงไหนก็ขอความช่วยเหลือ"]
  }
};

const ko: HomepageCopy = {
  heroEyebrow: "AI Language Tutor · 실제 대화로 연습",
  heroTitleA: "실제 대화가 되는",
  heroTitleB: "AI 언어 튜터",
  heroLead: "하고 싶은 말이 떠오르지 않아도 괜찮아요. AI 튜터가 자연스러운 표현을 찾아주고, 그 표현으로 대화를 이어가며 배우는 언어를 익혀보세요.",
  cta: "무료로 말하기 시작",
  noCard: "카드 등록 필요 없음",
  ownPace: "내 속도에 맞춰 연습",
  heroLangs: [
    { code: "en", name: "영어", flag: "us" },
    { code: "es", name: "스페인어", flag: "es" },
    { code: "fr", name: "프랑스어", flag: "fr" },
    { code: "de", name: "독일어", flag: "de" },
    { code: "ja", name: "일본어", flag: "jp" }
  ],
  demoLang: "영어",
  demo: {
    q1: "지난 주말에 뭐 했어?",
    learner: "음… 그게… 어…",
    helpTitle: "표현 도와주기",
    trySaying: "이렇게 말해봐:",
    quote: "I went hiking with some friends.",
    listen: "듣기",
    retry: "다시 해보기",
    followUp: "좋았네! 여행에서 가장 좋았던 건 뭐야?",
    tap: "탭して 말하기"
  },
  how: {
    kicker: "막히는 순간이 기회예요",
    h2a: "어떻게 말할지 몰라도,",
    h2b: "대화는 계속돼요.",
    lead: "완벽한 문장을 알 필요 없어요. 하고 싶은 말을 전하면, 배우는 언어로 자연스러운 표현을 받을 수 있어요.",
    steps: [
      { title: "伝えたいこと 전하기", description: "하고 싶은 말을 내 식대로 설명해요." },
      { title: "도움 받기", description: "AI 튜터가 자연스러운 표현을 제안해줘요." },
      { title: "따라 말하기", description: "듣고, 따라 하고, 직접 말해봐요." },
      { title: "대화 이어가기", description: "배운 표현을 바로 써먹으며 자신감을 키워요." }
    ]
  },
  scenarios: {
    h2: "정말 필요한 대화를 연습하세요",
    lead: "상황을 고르고 실제 대화를 바로 시작해요.",
    cards: [
      { title: "면접", description: "면접 질문에 자연스럽게 답하는 연습.", cta: "면접 연습 시작", badge: "가장 인기" },
      { title: "직장", description: "회의, 발표, 일상 업무 대화를 연습.", cta: "직장 영어 연습" },
      { title: "여행", description: "여행 중에 꼭 필요한 대화를 연습.", cta: "여행 영어 연습" },
      { title: "일상", description: "하루 일과, 관심사, 실제 상황을 이야기.", cta: "일상 영어 연습" }
    ]
  },
  unstuck: {
    kicker: "표현 도와주기",
    h2: "대화를 끊지 않고 막힘 해결하기",
    lead: "적당한 단어가 생각나지 않나요? 하고 싶은 말을 편하게 전해보세요.",
    points: ["자연스러운 표현 받기", "음성으로 듣기", "다시 말해보기", "계속 대화하기"],
    bubbleTop: "이번 주말에 등산 가고 싶어.",
    bubbleMid: "자연스럽게는 이렇게: “I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "30개 이상 언어",
    h2: "배우고 싶은 언어로 연습하세요",
    lead: "막힐 땐 모국어로 물어보고, 연습은 배우는 언어로 진행해요.",
    viewAll: "모든 언어 보기"
  },
  lessons: {
    h2: " 나눈 대화가 그대로 레슨이 돼요",
    features: [
      { title: "자연스러운 교정", description: "내 말을 더 자연스럽게 바꾸는 법 확인." },
      { title: "바로 쓰는 표현", description: "당장 써먹을 표현만 저장." },
      { title: "어휘", description: "대화에 나온 단어부터 차근차근." },
      { title: "복습과 연습", description: "지난 대화를 돌아보며 계속 성장." }
    ],
    sumTitle: "대화 요약",
    tabs: ["표현", "교정", "새 단어"],
    sumItems: [
      { title: "It was a great experience.", sub: "자연스러운 표현" },
      { title: "I really enjoyed the trip.", sub: "저장한 표현" }
    ]
  },
  betterway: {
    kicker: "AI LANGUAGE TUTOR를 선택하는 이유",
    h2: "말하기 연습, 더 좋은 방법",
    features: [
      { title: "부담 없이 연습", description: "틀려도 돼요. 질문하며 내 속도로." },
      { title: "내 속도로 말하기", description: "서두르지 마세요. AI 튜터가 기다려줘요." },
      { title: "언제든 연습", description: "예약도 교실도 필요 없어요. 하고 싶을 때 바로." }
    ]
  },
  final: {
    h2: "하고 싶은 말, 그대로 말하세요.",
    lead: "AI와 첫 대화를 시작하고, 막힐 때마다 도움을 받아보세요.",
    cta: "무료로 말하기 시작",
    note: "카드 등록 필요 없음",
    free: "무료 대화 포함",
    steps: ["상황 고르기", "말 시작하기", "막히면 도움 받기"]
  }
};

const zhCN: HomepageCopy = {
  heroEyebrow: "AI Language Tutor · 在真实对话里练口语",
  heroTitleA: "AI 语言导师",
  heroTitleB: "真实对话",
  heroLead: "想说说不出来？别停。AI 导师帮你找到地道的说法，你跟着说、接着聊，在对话里把这门语言练到嘴上。",
  cta: "免费开口说",
  noCard: "不用绑卡",
  ownPace: "按自己的节奏练",
  heroLangs: [
    { code: "en", name: "英语", flag: "us" },
    { code: "es", name: "西班牙语", flag: "es" },
    { code: "fr", name: "法语", flag: "fr" },
    { code: "de", name: "德语", flag: "de" },
    { code: "ja", name: "日语", flag: "jp" }
  ],
  demoLang: "英语",
  demo: {
    q1: "上周末干什么去了？",
    learner: "呃…去…那个…",
    helpTitle: "帮你组织语言",
    trySaying: "可以这样说：",
    quote: "I went hiking with some friends.",
    listen: "听一听",
    retry: "再说一遍",
    followUp: "听起来不错！旅行里最开心的是哪一段？",
    tap: "点一下，开口说"
  },
  how: {
    kicker: "开口的关键时刻",
    h2a: "不知道怎么说？",
    h2b: "接着往下说。",
    lead: "不用憋完美的句子。把想表达的意思告诉导师，地道的说法马上就来，拿过来就能用。",
    steps: [
      { title: "说出想法", description: "用自己的话讲清楚想表达什么。" },
      { title: "拿到说法", description: "AI 导师给你地道的表达。" },
      { title: "开口跟说", description: "听一遍，跟读一遍，再自己说一遍。" },
      { title: "聊了回去", description: "把刚学的表达用回对话，越说越顺。" }
    ]
  },
  scenarios: {
    h2: "练的都是用得上的对话",
    lead: "选个场景，现在就开始练真实对话。",
    cards: [
      { title: "求职面试", description: "面试问题，用英语自然地答出来。", cta: "开始面试练习", badge: "最受欢迎" },
      { title: "职场", description: "开会、汇报、日常工作交流全覆盖。", cta: "开始职场练习" },
      { title: "旅行", description: "出门在外要说的英语，提前练熟。", cta: "开始旅行练习" },
      { title: "日常", description: "聊今天、聊爱好、聊真实生活。", cta: "开始日常练习" }
    ]
  },
  unstuck: {
    kicker: "帮你组织语言",
    h2: "卡住也不用结束对话",
    lead: "一时找不到词？把意思讲出来就行。",
    points: ["拿到地道表达", "听一遍发音", "自己再说一遍", "接着往下聊"],
    bubbleTop: "这个周末想去爬山。",
    bubbleMid: "地道的说法是：“I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "30+ 种语言",
    h2: "想学哪门，就练哪门",
    lead: "求助可以用母语，练习用的是你要学的语言。",
    viewAll: "查看全部语言"
  },
  lessons: {
    h2: "聊过的每一句，都变成你的课",
    features: [
      { title: "地道纠正", description: "看看同一句话更自然的讲法。" },
      { title: "实用表达", description: "能直接拿去用的句子，存下来。" },
      { title: "词汇", description: "从对话里一点点攒词汇。" },
      { title: "复习和练习", description: "回看聊过的内容，稳步进步。" }
    ],
    sumTitle: "对话小结",
    tabs: ["表达", "纠正", "生词"],
    sumItems: [
      { title: "It was a great experience.", sub: "地道表达" },
      { title: "I really enjoyed the trip.", sub: "已收藏的句子" }
    ]
  },
  betterway: {
    kicker: "为什么选 AI LANGUAGE TUTOR",
    h2: "练口语，有更好的办法",
    features: [
      { title: "零压力开口", description: "说错没关系，边问边学，按自己节奏来。" },
      { title: "自己的节奏", description: "慢慢来，AI 导师会等你。" },
      { title: "随时开练", description: "不用约课，不用进教室，想说就说。" }
    ]
  },
  final: {
    h2: "想说什么，就说什么。",
    lead: "开始和 AI 的第一次对话，卡住随时有人帮。",
    cta: "免费开口说",
    note: "不用绑卡",
    free: "含免费对话",
    steps: ["选个场景", "开口聊", "卡住就求助"]
  }
};

const zhTW: HomepageCopy = {
  heroEyebrow: "AI Language Tutor · 在真實對話裡練口說",
  heroTitleA: "AI 語言導師",
  heroTitleB: "真實對話",
  heroLead: "想說說不出來？別停。AI 導師幫你找到道地的說法，你跟著說、接著聊，在對話裡把這門語言練到嘴上。",
  cta: "免費開口說",
  noCard: "不用綁卡",
  ownPace: "照自己的節奏練",
  heroLangs: [
    { code: "en", name: "英語", flag: "us" },
    { code: "es", name: "西班牙語", flag: "es" },
    { code: "fr", name: "法語", flag: "fr" },
    { code: "de", name: "德語", flag: "de" },
    { code: "ja", name: "日語", flag: "jp" }
  ],
  demoLang: "英語",
  demo: {
    q1: "上週末去做了什麼？",
    learner: "呃…去…那個…",
    helpTitle: "幫你組織語言",
    trySaying: "可以這樣說：",
    quote: "I went hiking with some friends.",
    listen: "聽聽看",
    retry: "再說一次",
    followUp: "聽起來不錯！旅行中最開心的是哪一段？",
    tap: "點一下，開口說"
  },
  how: {
    kicker: "開口的關鍵時刻",
    h2a: "不知道怎麼說？",
    h2b: "接著往下說。",
    lead: "不用憋完美的句子。把想表達的意思告訴導師，道地的說法馬上就來，拿過來就能用。",
    steps: [
      { title: "說出想法", description: "用自己的話講清楚想表達什麼。" },
      { title: "拿到說法", description: "AI 導師給你道地的表達。" },
      { title: "開口跟說", description: "聽一遍，跟讀一遍，再自己說一遍。" },
      { title: "聊了回去", description: "把剛學的表達用回對話，越說越順。" }
    ]
  },
  scenarios: {
    h2: "練的都是用得上的對話",
    lead: "選個場景，現在就開始練真實對話。",
    cards: [
      { title: "求職面試", description: "面試問題，用英語自然地答出來。", cta: "開始面試練習", badge: "最受歡迎" },
      { title: "職場", description: "開會、報告、日常工作交流全覆蓋。", cta: "開始職場練習" },
      { title: "旅行", description: "出門在外要說的英語，提前練熟。", cta: "開始旅行練習" },
      { title: "日常", description: "聊今天、聊興趣、聊真實生活。", cta: "開始日常練習" }
    ]
  },
  unstuck: {
    kicker: "幫你組織語言",
    h2: "卡住也不用結束對話",
    lead: "一時找不到詞？把意思講出來就好。",
    points: ["拿到道地表達", "聽一遍發音", "自己再說一遍", "接著往下聊"],
    bubbleTop: "這個週末想去爬山。",
    bubbleMid: "道地的說法是：“I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "30+ 種語言",
    h2: "想學哪門，就練哪門",
    lead: "求助可以用母語，練習用的是你要學的語言。",
    viewAll: "查看全部語言"
  },
  lessons: {
    h2: "聊過的每一句，都變成你的課",
    features: [
      { title: "道地修正", description: "看看同一句話更自然的講法。" },
      { title: "實用表達", description: "能直接拿去用的句子，存下來。" },
      { title: "單字", description: "從對話裡一點一點累積單字。" },
      { title: "複習和練習", description: "回看聊過的內容，穩步進步。" }
    ],
    sumTitle: "對話小結",
    tabs: ["表達", "修正", "生詞"],
    sumItems: [
      { title: "It was a great experience.", sub: "道地表達" },
      { title: "I really enjoyed the trip.", sub: "已收藏的句子" }
    ]
  },
  betterway: {
    kicker: "為什麼選 AI LANGUAGE TUTOR",
    h2: "練口說，有更好的辦法",
    features: [
      { title: "零壓力開口", description: "說錯沒關係，邊問邊學，照自己節奏來。" },
      { title: "自己的節奏", description: "慢慢來，AI 導師會等你。" },
      { title: "隨時開練", description: "不用約課，不用進教室，想說就說。" }
    ]
  },
  final: {
    h2: "想說什麼，就說什麼。",
    lead: "開始和 AI 的第一次對話，卡住隨時有人幫。",
    cta: "免費開口說",
    note: "不用綁卡",
    free: "含免費對話",
    steps: ["選個場景", "開口聊", "卡住就求助"]
  }
};

const es: HomepageCopy = {
  heroEyebrow: "AI Language Tutor · Práctica con conversaciones reales",
  heroTitleA: "Tu tutor de idiomas con IA",
  heroTitleB: "conversaciones reales",
  heroLead: "¿No te sale la palabra? No te detengas. Tu tutor te da la forma natural de decirlo y sigues hablando, en el idioma que quieres aprender.",
  cta: "Empieza gratis",
  noCard: "Sin tarjeta",
  ownPace: "A tu ritmo",
  heroLangs: [
    { code: "en", name: "Inglés", flag: "us" },
    { code: "es", name: "Español", flag: "es" },
    { code: "fr", name: "Francés", flag: "fr" },
    { code: "de", name: "Alemán", flag: "de" },
    { code: "ja", name: "Japonés", flag: "jp" }
  ],
  demoLang: "Inglés",
  demo: {
    q1: "¿Qué hiciste el fin de semana?",
    learner: "Eh… fui a… esto…",
    helpTitle: "Ayúdame a decirlo",
    trySaying: "Puedes decir:",
    quote: "I went hiking with some friends.",
    listen: "Escuchar",
    retry: "Otra vez",
    followUp: "¡Qué bien! ¿Qué fue lo mejor del viaje?",
    tap: "Toca para hablar"
  },
  how: {
    kicker: "EL MOMENTO CLAVE",
    h2a: "¿No sabes cómo decirlo?",
    h2b: "Sigue hablando.",
    lead: "No necesitas la frase perfecta. Cuéntale a tu tutor lo que quieres decir y recibe una expresión natural en el idioma que aprendes.",
    steps: [
      { title: "Cuéntalo", description: "Explica con tus palabras lo que quieres decir." },
      { title: "Recibe ayuda", description: "Tu tutor te da la expresión natural." },
      { title: "Dilo", description: "Escucha, repite y practícalo en voz alta." },
      { title: "Sigue hablando", description: "Úsalo en la conversación y gana confianza." }
    ]
  },
  scenarios: {
    h2: "Practica las conversaciones que sí necesitas",
    lead: "Elige una situación y empieza a practicar de verdad.",
    cards: [
      { title: "Entrevista de trabajo", description: "Responde preguntas de entrevista con naturalidad.", cta: "Practicar entrevistas", badge: "Lo más popular" },
      { title: "Trabajo", description: "Reuniones, presentaciones y el día a día en la oficina.", cta: "Practicar para el trabajo" },
      { title: "Viajes", description: "Las conversaciones que necesitarás viajando.", cta: "Practicar para viajar" },
      { title: "Vida diaria", description: "Habla de tu día, tus gustos y tu vida real.", cta: "Practicar cada día" }
    ]
  },
  unstuck: {
    kicker: "AYÚDAME A DECIRLO",
    h2: "Desbloquéate sin terminar la conversación",
    lead: "¿No encuentras la palabra? Cuéntale a tu tutor lo que quieres decir.",
    points: ["Recibe una expresión natural", "Escúchala", "Dila de nuevo", "Sigue hablando"],
    bubbleTop: "Este finde quiero ir de excursión.",
    bubbleMid: "Dilo así, suena natural: “I'm planning to go hiking this weekend.”"
  },
  miniLangs: {
    kicker: "MÁS DE 30 IDIOMAS",
    h2: "Aprende el idioma que quieres hablar",
    lead: "Pide ayuda en tu idioma. Practica en el idioma que aprendes.",
    viewAll: "Ver todos los idiomas"
  },
  lessons: {
    h2: "Tus conversaciones se convierten en tus lecciones",
    features: [
      { title: "Correcciones naturales", description: "Mira una forma más natural de decir lo tuyo." },
      { title: "Frases útiles", description: "Guarda expresiones para usarlas hoy mismo." },
      { title: "Vocabulario", description: "Amplía tu vocabulario poco a poco." },
      { title: "Repasa y practica", description: "Vuelve a tus conversaciones y sigue mejorando." }
    ],
    sumTitle: "Resumen de la conversación",
    tabs: ["Frases", "Correcciones", "Palabras nuevas"],
    sumItems: [
      { title: "It was a great experience.", sub: "Expresión natural" },
      { title: "I really enjoyed the trip.", sub: "Frase guardada" }
    ]
  },
  betterway: {
    kicker: "POR QUÉ AI LANGUAGE TUTOR",
    h2: "Una mejor forma de practicar speaking",
    features: [
      { title: "Practica sin presión", description: "Equivócate, pregunta y aprende a tu ritmo." },
      { title: "Habla a tu ritmo", description: "Tómate tu tiempo, tu tutor te espera." },
      { title: "Practica cuando quieras", description: "Sin horarios ni aulas. Ponte a hablar." }
    ]
  },
  final: {
    h2: "Di lo que quieres decir. Sigue hablando.",
    lead: "Empieza tu primera conversación con IA y recibe ayuda cada vez que te trabes.",
    cta: "Empieza gratis",
    note: "Sin tarjeta",
    free: "Conversación gratis incluida",
    steps: ["Elige una situación", "Ponte a hablar", "Pide ayuda si te trabas"]
  }
};

export const homepageCopy: Record<Locale, HomepageCopy> = {
  en,
  ja,
  th,
  ko,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  es
};
