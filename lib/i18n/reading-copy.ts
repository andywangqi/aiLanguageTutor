import type { Locale } from "./config";

export type ReadingCopy = {
  metadata: { title: string; description: string };
  nav: { aria: string; how: string; demo: string; signIn: string; start: string };
  hero: {
    kicker: string;
    title: string;
    lead: string;
    demoCta: string;
    materialCta: string;
    benefitsAria: string;
    levelBenefit: string;
    notesBenefit: string;
  };
  preview: {
    aria: string;
    workspace: string;
    live: string;
    today: string;
    minutes: string;
    listen: string;
    highlightMeaning: string;
  };
  workspace: {
    kicker: string;
    title: string;
    lead: string;
    practice: string;
    languageLevel: string;
    progress: string;
    stepOne: string;
    stepTwo: string;
    toolsAria: string;
    tabs: [string, string, string, string];
    uploadLead: string;
    importText: string;
    signedInFormats: string;
    yourMaterial: string;
    sampleLesson: string;
    words: string;
    stop: string;
    listen: string;
    reset: string;
  };
  status: {
    ready: string;
    txtOnly: string;
    empty: string;
    loaded: string;
    readError: string;
  };
  article: {
    category: string;
    duration: string;
    keyIdea: string;
    tipTitle: string;
    tipBody: string;
  };
  vocabulary: { kicker: string; title: string; count: string; listenTo: string; meanings: [string, string, string] };
  comprehension: { kicker: string; title: string };
  notes: {
    kicker: string;
    title: string;
    savedHere: string;
    label: string;
    placeholder: string;
    saved: string;
    private: string;
    accountCta: string;
  };
  method: {
    kicker: string;
    title: string;
    lead: string;
    benefits: Array<{ title: string; body: string }>;
  };
  cta: { kicker: string; title: string; action: string };
  footer: { description: string; home: string };
};

export const readingCopy: Record<Locale, ReadingCopy> = {
  en: {
    metadata: { title: "English Reading Practice with AI | AI Language Tutor", description: "Practice English reading with vocabulary, comprehension checks, study notes, and browser listening. Bring real material into your reading routine." },
    nav: { aria: "Reading practice navigation", how: "How it works", demo: "Try the demo", signIn: "Sign in", start: "Start practicing" },
    hero: { kicker: "English reading practice", title: "Read something real. Learn what stays with you.", lead: "Turn an article, note, or short story into a focused English lesson with vocabulary, comprehension checks, and speaking practice in one place.", demoCta: "Try the reading demo", materialCta: "Use your own material", benefitsAria: "Reading practice benefits", levelBenefit: "Read at your level", notesBenefit: "Save notes as you go" },
    preview: { aria: "Reading practice preview", workspace: "Reading workspace", live: "Live preview", today: "TODAY'S READING", minutes: "3 min lesson", listen: "Listen to the sample reading", highlightMeaning: "focus on something" },
    workspace: { kicker: "A complete practice loop", title: "One text, four ways to learn.", lead: "Start with a short sample, then explore the tools a language tutor puts beside the words you are already reading.", practice: "Reading practice", languageLevel: "English - B1", progress: "Lesson progress", stepOne: "1 of 4", stepTwo: "2 of 4", toolsAria: "Reading lesson tools", tabs: ["Read", "Vocabulary", "Comprehension", "Study Notes"], uploadLead: "Bring a short text to practice with.", importText: "Import text", signedInFormats: "PDF and DOCX with Tutor", yourMaterial: "YOUR MATERIAL", sampleLesson: "SAMPLE LESSON", words: "words", stop: "Stop", listen: "Listen", reset: "Reset to sample" },
    status: { ready: "Sample text ready", txtOnly: "For this preview, choose a .txt file. PDF and DOCX import is available after sign in.", empty: "That file did not contain readable text.", loaded: "Loaded {file}", readError: "The file could not be read. Try another text file." },
    article: { category: "Everyday English", duration: "3 min read", keyIdea: "Key idea: habits", tipTitle: "Reading tip", tipBody: "Do not translate every word. First, find the main idea of each paragraph." },
    vocabulary: { kicker: "KEY WORDS", title: "Words worth keeping", count: "3 words", listenTo: "Listen to {word}", meanings: ["to influence how something develops", "the ability to concentrate on something", "easy to do again regularly"] },
    comprehension: { kicker: "CHECK YOUR UNDERSTANDING", title: "Can you remember the main idea?" },
    notes: { kicker: "YOUR REVIEW", title: "Keep the useful part.", savedHere: "Saved in this browser", label: "Write a phrase, question, or summary to revisit later.", placeholder: "I want to remember...", saved: "Your note is saved automatically.", private: "Your notes stay private on this device.", accountCta: "Save notes to your account" },
    method: { kicker: "Designed for steady progress", title: "Make reading feel active.", lead: "Good reading practice is more than finishing a page. It helps you notice useful language, test your understanding, and return tomorrow with a little more confidence.", benefits: [{ title: "Read with a clear focus", body: "See the main idea first, then slow down for phrases that are useful in your own life." }, { title: "Practice what you notice", body: "Listen to new words, answer a quick question, and connect meaning with context." }, { title: "Build your personal library", body: "Bring your own materials into the Tutor and keep the notes you want to use again." }] },
    cta: { kicker: "Your next lesson can start with one page", title: "Read, speak, and remember more.", action: "Open your reading workspace" },
    footer: { description: "English reading practice for real life.", home: "Back to home" }
  },
  ja: {
    metadata: { title: "AIで英語リーディング練習 | AI Language Tutor", description: "語彙、理解度チェック、学習メモ、読み上げ機能を使って英語の読解を練習できます。" },
    nav: { aria: "リーディング練習のナビゲーション", how: "使い方", demo: "デモを試す", signIn: "ログイン", start: "練習を始める" },
    hero: { kicker: "英語リーディング練習", title: "本物の英文を読み、使える英語を残そう。", lead: "記事、メモ、短い物語を、語彙、理解度チェック、スピーキングを含む集中型の英語レッスンに変えられます。", demoCta: "リーディングデモを試す", materialCta: "自分の教材を使う", benefitsAria: "リーディング練習の特長", levelBenefit: "自分のレベルで読む", notesBenefit: "読みながらメモを残す" },
    preview: { aria: "リーディング練習のプレビュー", workspace: "リーディングワークスペース", live: "ライブプレビュー", today: "今日の英文", minutes: "3分のレッスン", listen: "サンプル英文を聞く", highlightMeaning: "何かに集中すること" },
    workspace: { kicker: "一連の練習をひとつに", title: "ひとつの英文を、4つの方法で学ぶ。", lead: "短いサンプルから始めて、読んでいる英文のそばで使える学習ツールを試しましょう。", practice: "リーディング練習", languageLevel: "英語 - B1", progress: "レッスンの進捗", stepOne: "4つ中1つ目", stepTwo: "4つ中2つ目", toolsAria: "リーディング学習ツール", tabs: ["読む", "語彙", "理解度チェック", "学習メモ"], uploadLead: "練習したい短い英文を用意しましょう。", importText: "テキストを読み込む", signedInFormats: "ログインしてPDF・DOCXを使う", yourMaterial: "自分の教材", sampleLesson: "サンプルレッスン", words: "語", stop: "停止", listen: "聞く", reset: "サンプルに戻す" },
    status: { ready: "サンプル英文を準備しました", txtOnly: "このプレビューでは.txtファイルを選んでください。PDFとDOCXはログイン後に読み込めます。", empty: "ファイルに読み取れるテキストがありません。", loaded: "{file}を読み込みました", readError: "ファイルを読み取れませんでした。別のテキストファイルをお試しください。" },
    article: { category: "日常英語", duration: "3分で読めます", keyIdea: "主題：習慣", tipTitle: "読み方のヒント", tipBody: "すべての単語を訳す必要はありません。まず各段落の要点をつかみましょう。" },
    vocabulary: { kicker: "重要語句", title: "覚えておきたい言葉", count: "3語", listenTo: "{word}の発音を聞く", meanings: ["何かがどのように発展するかに影響を与えること", "何かに集中する能力", "定期的に繰り返しやすいこと"] },
    comprehension: { kicker: "理解度を確認", title: "要点を覚えていますか？" },
    notes: { kicker: "今回の復習", title: "役立つ部分を残しましょう。", savedHere: "このブラウザに保存済み", label: "あとで見直したいフレーズ、質問、要約を書きましょう。", placeholder: "覚えておきたいこと…", saved: "メモは自動で保存されます。", private: "メモはこの端末内だけに保存されます。", accountCta: "アカウントにメモを保存" },
    method: { kicker: "着実な上達のための設計", title: "読む時間を、能動的な練習に。", lead: "よいリーディング練習は、読み終えるだけではありません。役立つ表現に気づき、理解を確かめ、次の練習につなげます。", benefits: [{ title: "目的を持って読む", body: "先に要点をつかみ、自分でも使いたい表現をじっくり確認します。" }, { title: "気づいた言葉を練習", body: "新しい単語を聞き、短い問題に答え、文脈と意味を結びつけます。" }, { title: "自分だけの教材集を作る", body: "自分の教材をTutorに追加し、また使いたいメモを残せます。" }] },
    cta: { kicker: "次のレッスンは、1ページから", title: "読んで、話して、もっと覚える。", action: "リーディングワークスペースを開く" },
    footer: { description: "実生活で使える英語リーディング練習。", home: "ホームに戻る" }
  },
  th: {
    metadata: { title: "ฝึกอ่านภาษาอังกฤษด้วย AI | AI Language Tutor", description: "ฝึกอ่านอังกฤษพร้อมคำศัพท์ แบบทดสอบความเข้าใจ โน้ต และเสียงอ่านจากเบราว์เซอร์" },
    nav: { aria: "เมนูฝึกอ่าน", how: "วิธีใช้งาน", demo: "ลองเดโม", signIn: "เข้าสู่ระบบ", start: "เริ่มฝึก" },
    hero: { kicker: "ฝึกอ่านภาษาอังกฤษ", title: "อ่านเรื่องจริง แล้วเก็บสิ่งที่ได้เรียนรู้ไว้", lead: "เปลี่ยนบทความ โน้ต หรือเรื่องสั้นให้เป็นบทเรียนภาษาอังกฤษที่มีคำศัพท์ แบบทดสอบความเข้าใจ และการฝึกพูดในที่เดียว", demoCta: "ลองเดโมฝึกอ่าน", materialCta: "ใช้เนื้อหาของคุณ", benefitsAria: "ประโยชน์ของการฝึกอ่าน", levelBenefit: "อ่านตามระดับของคุณ", notesBenefit: "จดโน้ตระหว่างอ่าน" },
    preview: { aria: "ตัวอย่างการฝึกอ่าน", workspace: "พื้นที่ฝึกอ่าน", live: "ตัวอย่างแบบสด", today: "บทอ่านวันนี้", minutes: "บทเรียน 3 นาที", listen: "ฟังบทอ่านตัวอย่าง", highlightMeaning: "ความสามารถในการจดจ่อกับบางสิ่ง" },
    workspace: { kicker: "วงจรการฝึกที่ครบถ้วน", title: "หนึ่งบทอ่าน เรียนได้สี่แบบ", lead: "เริ่มจากตัวอย่างสั้น ๆ แล้วลองใช้เครื่องมือที่ Tutor วางไว้ข้างเนื้อหาที่คุณกำลังอ่าน", practice: "ฝึกอ่าน", languageLevel: "อังกฤษ - B1", progress: "ความคืบหน้าบทเรียน", stepOne: "1 จาก 4", stepTwo: "2 จาก 4", toolsAria: "เครื่องมือบทเรียนอ่าน", tabs: ["อ่าน", "คำศัพท์", "ความเข้าใจ", "โน้ตการเรียน"], uploadLead: "นำข้อความสั้น ๆ มาฝึกอ่าน", importText: "นำเข้าข้อความ", signedInFormats: "ใช้ PDF และ DOCX เมื่อเข้าสู่ระบบ", yourMaterial: "เนื้อหาของคุณ", sampleLesson: "บทเรียนตัวอย่าง", words: "คำ", stop: "หยุด", listen: "ฟัง", reset: "กลับไปยังตัวอย่าง" },
    status: { ready: "ข้อความตัวอย่างพร้อมแล้ว", txtOnly: "ตัวอย่างนี้รองรับไฟล์ .txt ส่วน PDF และ DOCX ใช้ได้หลังเข้าสู่ระบบ", empty: "ไฟล์นี้ไม่มีข้อความที่อ่านได้", loaded: "โหลด {file} แล้ว", readError: "อ่านไฟล์ไม่ได้ กรุณาลองไฟล์ข้อความอื่น" },
    article: { category: "อังกฤษในชีวิตประจำวัน", duration: "อ่าน 3 นาที", keyIdea: "ใจความสำคัญ: นิสัย", tipTitle: "เคล็ดลับการอ่าน", tipBody: "ไม่ต้องแปลทุกคำ ให้หาใจความสำคัญของแต่ละย่อหน้าก่อน" },
    vocabulary: { kicker: "คำสำคัญ", title: "คำที่ควรจำ", count: "3 คำ", listenTo: "ฟังคำว่า {word}", meanings: ["มีอิทธิพลต่อการพัฒนาของบางสิ่ง", "ความสามารถในการจดจ่อกับบางสิ่ง", "ทำซ้ำเป็นประจำได้ง่าย"] },
    comprehension: { kicker: "ตรวจสอบความเข้าใจ", title: "คุณจำใจความสำคัญได้ไหม" },
    notes: { kicker: "ทบทวนของคุณ", title: "เก็บส่วนที่เป็นประโยชน์ไว้", savedHere: "บันทึกในเบราว์เซอร์นี้", label: "เขียนวลี คำถาม หรือสรุปที่อยากกลับมาดูภายหลัง", placeholder: "ฉันอยากจำ…", saved: "โน้ตของคุณบันทึกอัตโนมัติแล้ว", private: "โน้ตของคุณเก็บเป็นส่วนตัวในอุปกรณ์นี้", accountCta: "บันทึกโน้ตลงในบัญชี" },
    method: { kicker: "ออกแบบเพื่อการพัฒนาอย่างต่อเนื่อง", title: "ทำให้การอ่านเป็นการฝึกที่ได้ลงมือทำ", lead: "การฝึกอ่านที่ดีไม่ใช่แค่อ่านให้จบ แต่ช่วยให้คุณสังเกตภาษาที่ใช้ได้จริง ทดสอบความเข้าใจ และกลับมาฝึกต่ออย่างมั่นใจ", benefits: [{ title: "อ่านอย่างมีเป้าหมาย", body: "หาใจความสำคัญก่อน แล้วค่อยดูวลีที่นำไปใช้ในชีวิตได้" }, { title: "ฝึกสิ่งที่สังเกตเห็น", body: "ฟังคำใหม่ ตอบคำถามสั้น ๆ และเชื่อมโยงความหมายกับบริบท" }, { title: "สร้างคลังการเรียนรู้ของคุณ", body: "นำเนื้อหาของคุณมาใช้กับ Tutor และเก็บโน้ตไว้ทบทวน" }] },
    cta: { kicker: "บทเรียนถัดไปเริ่มได้จากหนึ่งหน้า", title: "อ่าน พูด และจำได้มากขึ้น", action: "เปิดพื้นที่ฝึกอ่าน" },
    footer: { description: "ฝึกอ่านภาษาอังกฤษสำหรับชีวิตจริง", home: "กลับหน้าหลัก" }
  },
  ko: {
    metadata: { title: "AI 영어 읽기 연습 | AI Language Tutor", description: "어휘, 이해도 확인, 학습 메모, 브라우저 듣기 기능으로 영어 읽기를 연습하세요." },
    nav: { aria: "읽기 연습 탐색", how: "사용 방법", demo: "데모 체험", signIn: "로그인", start: "연습 시작" },
    hero: { kicker: "영어 읽기 연습", title: "실제 글을 읽고, 배운 내용을 오래 기억하세요.", lead: "기사, 메모, 짧은 이야기를 어휘, 이해도 확인, 말하기가 포함된 집중 영어 수업으로 바꿔보세요.", demoCta: "읽기 데모 체험", materialCta: "내 자료 사용", benefitsAria: "읽기 연습 장점", levelBenefit: "내 수준에 맞게 읽기", notesBenefit: "읽으며 메모 저장" },
    preview: { aria: "읽기 연습 미리보기", workspace: "읽기 학습 공간", live: "실시간 미리보기", today: "오늘의 읽기", minutes: "3분 수업", listen: "예시 글 듣기", highlightMeaning: "무언가에 집중하는 것" },
    workspace: { kicker: "완성된 연습 과정", title: "하나의 글을 네 가지 방법으로 배우세요.", lead: "짧은 예시로 시작한 뒤 읽고 있는 글 옆에서 Tutor의 학습 도구를 활용해 보세요.", practice: "읽기 연습", languageLevel: "영어 - B1", progress: "수업 진행률", stepOne: "4개 중 1개", stepTwo: "4개 중 2개", toolsAria: "읽기 수업 도구", tabs: ["읽기", "어휘", "이해도", "학습 메모"], uploadLead: "연습할 짧은 글을 가져오세요.", importText: "텍스트 가져오기", signedInFormats: "로그인 후 PDF 및 DOCX 사용", yourMaterial: "내 자료", sampleLesson: "예시 수업", words: "단어", stop: "중지", listen: "듣기", reset: "예시로 되돌리기" },
    status: { ready: "예시 글이 준비되었습니다", txtOnly: "이 미리보기에서는 .txt 파일을 선택하세요. PDF와 DOCX는 로그인 후 가져올 수 있습니다.", empty: "파일에 읽을 수 있는 텍스트가 없습니다.", loaded: "{file} 파일을 불러왔습니다", readError: "파일을 읽을 수 없습니다. 다른 텍스트 파일을 사용해 보세요." },
    article: { category: "생활 영어", duration: "3분 읽기", keyIdea: "핵심 주제: 습관", tipTitle: "읽기 도움말", tipBody: "모든 단어를 번역하지 마세요. 먼저 각 문단의 중심 내용을 찾아보세요." },
    vocabulary: { kicker: "핵심 단어", title: "기억해 둘 단어", count: "단어 3개", listenTo: "{word} 듣기", meanings: ["무언가가 발전하는 방식에 영향을 주는 것", "무언가에 집중하는 능력", "정기적으로 다시 하기 쉬운 것"] },
    comprehension: { kicker: "이해도 확인", title: "중심 내용을 기억하고 있나요?" },
    notes: { kicker: "나의 복습", title: "유용한 내용을 남겨두세요.", savedHere: "이 브라우저에 저장됨", label: "나중에 다시 볼 표현, 질문 또는 요약을 적으세요.", placeholder: "기억하고 싶은 내용…", saved: "메모가 자동으로 저장되었습니다.", private: "메모는 이 기기에 비공개로 저장됩니다.", accountCta: "계정에 메모 저장" },
    method: { kicker: "꾸준한 성장을 위한 설계", title: "읽기를 능동적인 연습으로 바꾸세요.", lead: "좋은 읽기 연습은 한 페이지를 끝내는 데 그치지 않습니다. 유용한 표현을 발견하고 이해도를 확인해 다음 연습으로 이어갑니다.", benefits: [{ title: "목표를 갖고 읽기", body: "먼저 중심 내용을 파악한 뒤 실제 생활에서 쓸 수 있는 표현을 자세히 살펴보세요." }, { title: "발견한 내용을 연습하기", body: "새 단어를 듣고 짧은 질문에 답하며 문맥과 의미를 연결하세요." }, { title: "나만의 자료실 만들기", body: "내 자료를 Tutor로 가져오고 다시 사용할 메모를 보관하세요." }] },
    cta: { kicker: "다음 수업은 한 페이지에서 시작됩니다", title: "읽고, 말하고, 더 오래 기억하세요.", action: "읽기 학습 공간 열기" },
    footer: { description: "실생활을 위한 영어 읽기 연습.", home: "홈으로 돌아가기" }
  },
  "zh-CN": {
    metadata: { title: "AI 英语阅读练习 | AI Language Tutor", description: "通过词汇学习、阅读理解、学习笔记和浏览器朗读练习英语阅读。" },
    nav: { aria: "阅读练习导航", how: "使用方法", demo: "试用演示", signIn: "登录", start: "开始练习" },
    hero: { kicker: "英语阅读练习", title: "阅读真实内容，留下真正有用的知识。", lead: "把文章、笔记或短篇故事变成一节专注的英语课，在同一处学习词汇、检查理解并练习口语。", demoCta: "试用阅读演示", materialCta: "使用自己的材料", benefitsAria: "阅读练习优势", levelBenefit: "按自己的水平阅读", notesBenefit: "边读边保存笔记" },
    preview: { aria: "阅读练习预览", workspace: "阅读练习区", live: "实时预览", today: "今日阅读", minutes: "3 分钟课程", listen: "收听示例文章", highlightMeaning: "专注于某件事" },
    workspace: { kicker: "完整的练习闭环", title: "一篇文章，四种学习方式。", lead: "先从简短示例开始，再使用语言导师提供的工具理解你正在阅读的内容。", practice: "阅读练习", languageLevel: "英语 - B1", progress: "课程进度", stepOne: "第 1 项，共 4 项", stepTwo: "第 2 项，共 4 项", toolsAria: "阅读课程工具", tabs: ["阅读", "词汇", "理解测试", "学习笔记"], uploadLead: "导入一段简短文字开始练习。", importText: "导入文本", signedInFormats: "登录后使用 PDF 和 DOCX", yourMaterial: "你的材料", sampleLesson: "示例课程", words: "个英文单词", stop: "停止", listen: "收听", reset: "恢复示例" },
    status: { ready: "示例文本已就绪", txtOnly: "当前预览请选择 .txt 文件；登录后可导入 PDF 和 DOCX。", empty: "该文件中没有可读取的文本。", loaded: "已载入 {file}", readError: "无法读取该文件，请尝试其他文本文件。" },
    article: { category: "日常英语", duration: "阅读约 3 分钟", keyIdea: "核心概念：习惯", tipTitle: "阅读提示", tipBody: "不必逐词翻译。先找出每个段落的主要意思。" },
    vocabulary: { kicker: "重点词汇", title: "值得记住的单词", count: "3 个单词", listenTo: "收听 {word}", meanings: ["影响某件事的发展方式", "集中注意力的能力", "容易定期重复进行"] },
    comprehension: { kicker: "检查你的理解", title: "你还记得文章的主要意思吗？" },
    notes: { kicker: "你的复习", title: "把有用的内容留下来。", savedHere: "已保存在当前浏览器", label: "写下以后想复习的短语、问题或摘要。", placeholder: "我想记住……", saved: "笔记已自动保存。", private: "笔记只保存在当前设备上。", accountCta: "将笔记保存到账号" },
    method: { kicker: "为稳步进步而设计", title: "让阅读成为主动练习。", lead: "好的阅读练习不只是读完一页。它能帮助你发现有用的语言、检查理解，并更有信心地继续学习。", benefits: [{ title: "带着明确目标阅读", body: "先抓住主要意思，再仔细理解生活中能用到的表达。" }, { title: "练习你注意到的内容", body: "收听新单词、回答简短问题，把词义和语境联系起来。" }, { title: "建立自己的学习资料库", body: "把自己的材料导入导师，并保存以后还想使用的笔记。" }] },
    cta: { kicker: "下一节课，可以从一页内容开始", title: "多阅读，多开口，记得更牢。", action: "打开阅读练习区" },
    footer: { description: "面向真实生活的英语阅读练习。", home: "返回首页" }
  },
  "zh-TW": {
    metadata: { title: "AI 英語閱讀練習 | AI Language Tutor", description: "透過詞彙學習、閱讀理解、學習筆記和瀏覽器朗讀練習英語閱讀。" },
    nav: { aria: "閱讀練習導覽", how: "使用方式", demo: "試用示範", signIn: "登入", start: "開始練習" },
    hero: { kicker: "英語閱讀練習", title: "閱讀真實內容，留下真正有用的知識。", lead: "把文章、筆記或短篇故事變成一堂專注的英語課，在同一處學習詞彙、檢查理解並練習口說。", demoCta: "試用閱讀示範", materialCta: "使用自己的教材", benefitsAria: "閱讀練習優勢", levelBenefit: "依自己的程度閱讀", notesBenefit: "邊讀邊儲存筆記" },
    preview: { aria: "閱讀練習預覽", workspace: "閱讀練習區", live: "即時預覽", today: "今日閱讀", minutes: "3 分鐘課程", listen: "聆聽範例文章", highlightMeaning: "專注於某件事" },
    workspace: { kicker: "完整的練習循環", title: "一篇文章，四種學習方式。", lead: "先從簡短範例開始，再使用語言導師提供的工具理解你正在閱讀的內容。", practice: "閱讀練習", languageLevel: "英語 - B1", progress: "課程進度", stepOne: "第 1 項，共 4 項", stepTwo: "第 2 項，共 4 項", toolsAria: "閱讀課程工具", tabs: ["閱讀", "詞彙", "理解測驗", "學習筆記"], uploadLead: "匯入一段簡短文字開始練習。", importText: "匯入文字", signedInFormats: "登入後使用 PDF 和 DOCX", yourMaterial: "你的教材", sampleLesson: "範例課程", words: "個英文單字", stop: "停止", listen: "聆聽", reset: "還原範例" },
    status: { ready: "範例文字已就緒", txtOnly: "目前預覽請選擇 .txt 檔案；登入後可匯入 PDF 和 DOCX。", empty: "該檔案中沒有可讀取的文字。", loaded: "已載入 {file}", readError: "無法讀取該檔案，請嘗試其他文字檔案。" },
    article: { category: "日常英語", duration: "閱讀約 3 分鐘", keyIdea: "核心概念：習慣", tipTitle: "閱讀提示", tipBody: "不必逐字翻譯。先找出每個段落的主要意思。" },
    vocabulary: { kicker: "重點詞彙", title: "值得記住的單字", count: "3 個單字", listenTo: "聆聽 {word}", meanings: ["影響某件事的發展方式", "集中注意力的能力", "容易定期重複進行"] },
    comprehension: { kicker: "檢查你的理解", title: "你還記得文章的主要意思嗎？" },
    notes: { kicker: "你的複習", title: "把有用的內容留下來。", savedHere: "已儲存在目前瀏覽器", label: "寫下以後想複習的片語、問題或摘要。", placeholder: "我想記住……", saved: "筆記已自動儲存。", private: "筆記只會儲存在目前裝置上。", accountCta: "將筆記儲存到帳號" },
    method: { kicker: "為穩定進步而設計", title: "讓閱讀成為主動練習。", lead: "好的閱讀練習不只是讀完一頁。它能幫助你發現實用語言、檢查理解，並更有信心地繼續學習。", benefits: [{ title: "帶著明確目標閱讀", body: "先掌握主要意思，再仔細理解生活中能用到的表達。" }, { title: "練習你注意到的內容", body: "聆聽新單字、回答簡短問題，把詞義和語境連結起來。" }, { title: "建立自己的學習資料庫", body: "把自己的教材匯入導師，並儲存以後還想使用的筆記。" }] },
    cta: { kicker: "下一堂課，可以從一頁內容開始", title: "多閱讀、多開口，記得更牢。", action: "開啟閱讀練習區" },
    footer: { description: "面向真實生活的英語閱讀練習。", home: "返回首頁" }
  },
  es: {
    metadata: { title: "Práctica de lectura en inglés con AI | AI Language Tutor", description: "Practica la lectura en inglés con vocabulario, preguntas de comprensión, notas y lectura en voz alta." },
    nav: { aria: "Navegación de práctica de lectura", how: "Cómo funciona", demo: "Probar la demo", signIn: "Iniciar sesión", start: "Empezar a practicar" },
    hero: { kicker: "Práctica de lectura en inglés", title: "Lee textos reales. Conserva lo que aprendes.", lead: "Convierte un artículo, una nota o un relato breve en una lección de inglés con vocabulario, comprensión y práctica oral en un solo lugar.", demoCta: "Probar la demo de lectura", materialCta: "Usar tu propio material", benefitsAria: "Ventajas de la práctica de lectura", levelBenefit: "Lee a tu nivel", notesBenefit: "Guarda notas mientras lees" },
    preview: { aria: "Vista previa de la práctica de lectura", workspace: "Espacio de lectura", live: "Vista previa en directo", today: "LECTURA DE HOY", minutes: "Lección de 3 min", listen: "Escuchar la lectura de ejemplo", highlightMeaning: "concentrarse en algo" },
    workspace: { kicker: "Un ciclo de práctica completo", title: "Un texto, cuatro formas de aprender.", lead: "Empieza con un ejemplo breve y explora las herramientas que el Tutor coloca junto al texto que estás leyendo.", practice: "Práctica de lectura", languageLevel: "Inglés - B1", progress: "Progreso de la lección", stepOne: "1 de 4", stepTwo: "2 de 4", toolsAria: "Herramientas de la lección de lectura", tabs: ["Leer", "Vocabulario", "Comprensión", "Notas de estudio"], uploadLead: "Añade un texto breve para practicar.", importText: "Importar texto", signedInFormats: "PDF y DOCX al iniciar sesión", yourMaterial: "TU MATERIAL", sampleLesson: "LECCIÓN DE EJEMPLO", words: "palabras", stop: "Detener", listen: "Escuchar", reset: "Restablecer el ejemplo" },
    status: { ready: "Texto de ejemplo preparado", txtOnly: "Para esta vista previa, elige un archivo .txt. Podrás importar PDF y DOCX después de iniciar sesión.", empty: "El archivo no contiene texto legible.", loaded: "Se ha cargado {file}", readError: "No se pudo leer el archivo. Prueba con otro archivo de texto." },
    article: { category: "Inglés cotidiano", duration: "Lectura de 3 min", keyIdea: "Idea clave: los hábitos", tipTitle: "Consejo de lectura", tipBody: "No traduzcas cada palabra. Primero, identifica la idea principal de cada párrafo." },
    vocabulary: { kicker: "PALABRAS CLAVE", title: "Palabras que vale la pena recordar", count: "3 palabras", listenTo: "Escuchar {word}", meanings: ["influir en cómo se desarrolla algo", "la capacidad de concentrarse en algo", "fácil de repetir con regularidad"] },
    comprehension: { kicker: "COMPRUEBA TU COMPRENSIÓN", title: "¿Recuerdas la idea principal?" },
    notes: { kicker: "TU REPASO", title: "Conserva lo que te resulte útil.", savedHere: "Guardado en este navegador", label: "Escribe una frase, una pregunta o un resumen para revisarlo más adelante.", placeholder: "Quiero recordar…", saved: "Tu nota se guarda automáticamente.", private: "Tus notas permanecen privadas en este dispositivo.", accountCta: "Guardar notas en tu cuenta" },
    method: { kicker: "Diseñado para avanzar con constancia", title: "Convierte la lectura en una práctica activa.", lead: "Una buena práctica de lectura es más que terminar una página. Te ayuda a detectar expresiones útiles, comprobar lo que entiendes y seguir aprendiendo con confianza.", benefits: [{ title: "Lee con un objetivo claro", body: "Identifica primero la idea principal y después detente en las frases que puedes usar en tu vida." }, { title: "Practica lo que observas", body: "Escucha palabras nuevas, responde una pregunta breve y relaciona el significado con el contexto." }, { title: "Crea tu biblioteca personal", body: "Añade tus propios materiales al Tutor y conserva las notas que quieras volver a usar." }] },
    cta: { kicker: "Tu próxima lección puede empezar con una página", title: "Lee, habla y recuerda más.", action: "Abrir el espacio de lectura" },
    footer: { description: "Práctica de lectura en inglés para la vida real.", home: "Volver al inicio" }
  }
};
