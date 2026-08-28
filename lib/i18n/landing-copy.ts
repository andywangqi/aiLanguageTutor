import type { Locale } from "./config";
import type { LandingDictionary } from "./types";

type LandingSections = LandingDictionary["sections"];
type LocalizedLandingSections = Record<Exclude<Locale, "en">, LandingSections>;

const localizedLandingSections: LocalizedLandingSections = {
  ja: {
    learn: {
      eyebrow: "会話から身につく語学力",
      h2: "勉強するだけでなく、実際に話せるように",
      lead: "AI Tutor と会話しながら、言葉に詰まった瞬間も乗り越えて、学んでいる言語で話し続けられます。",
      cards: [
        { title: "Talk", description: "自然なやり取りを続けながら、実際の場面で使える会話を練習します。" },
        { title: "ヘルプを求める", description: "言い方が分からないときは、母語で意味を伝えるだけで大丈夫です。" },
        { title: "もう一度言ってみる", description: "自然な表現を聞き、声に出して練習してから会話に戻れます。" }
      ]
    },
    modes: {
      eyebrow: "言いたいことを、まず母語で",
      h2: "言い方が分からなくても、会話を止めなくていい。",
      lead: "伝えたい内容を自分の言葉で説明すると、AI Tutor が学習中の言語で自然な表現を提案します。練習したら、そのまま次の会話へ進めます。",
      items: [
        { title: "こう言いたい", description: "母語で意図を伝えると、場面に合う自然な表現がすぐに見つかります。" },
        { title: "会話を続ける", description: "フレーズを口に出してから、Tutor の次の質問に答えて会話を続けましょう。" }
      ]
    },
    corrections: {
      eyebrow: "その場で気づけるフィードバック",
      h2: "話しながら、より自然な言い方に近づける",
      lead: "間違いをただ直すだけではありません。なぜそう言うのかを理解して、次の返答でよりよい表現を使えます。",
      points: ["文法", "語彙", "自然な言い回し", "発音"]
    },
    stuck: {
      eyebrow: "発音練習",
      h2: "聞く、話す、そして発音を磨く",
      lead: "Tutor の発音を聞いて、自分でも声に出してみましょう。伝わりやすさに直結するポイントを絞って確認できます。",
      points: ["Tutor の音声を聞く", "フレーズを繰り返す", "話し方のフィードバックを受ける", "もう一度試す"]
    },
    lesson: {
      eyebrow: "会話で増える語彙",
      h2: "自分の会話から、使える単語が増えていく",
      lead: "その日に話したいことから出会う単語やフレーズだから、覚えたあとも実際の会話で使いやすくなります。",
      steps: ["新しい単語", "役立つフレーズ", "声に出して練習", "あとで復習", "少しずつ上達"]
    },
    personal: {
      eyebrow: "自分のための復習",
      h2: "話した内容が、次の練習につながる",
      lead: "会話で出てきた表現、修正、単語をまとめて残せるので、必要なときに自分のペースで振り返れます。",
      stats: [
        { label: "今回の復習", value: "過去形" },
        { label: "練習のスタイル", value: "あなた向け" },
        { label: "会話の速さ", value: "レベルに合わせて調整" }
      ]
    },
    languages: {
      eyebrow: "学びたい言語で話す",
      h2: "話せるようになりたい言語を、会話で練習",
      lead: "旅行、仕事、日常のために。目的に合わせて、学びたい言語で実践的な会話を始められます。",
      items: ["英語", "スペイン語", "日本語", "韓国語", "中国語", "フランス語", "ドイツ語"]
    },
    why: {
      eyebrow: "AI Tutor で学ぶ理由",
      h2: "AI Language Tutor なら、話す時間をすぐ作れる",
      lead: "旅行や仕事、面接、雑談まで。自分のレベルと時間に合わせて、必要な会話をいつでも練習できます。",
      cards: [
        { title: "現実の場面を練習", description: "旅先、職場、初対面の会話など、使う予定のある場面を言葉にします。" },
        { title: "自分のレベルで進める", description: "難しすぎる会話に置いていかれず、理解しやすいペースで続けられます。" },
        { title: "気負わずに話せる", description: "間違いを気にしすぎず、何度でも話して、自信を少しずつ育てられます。" }
      ]
    },
    faq: {
      eyebrow: "よくある質問",
      h2: "AI Language Tutor についてよくある質問",
      lead: "使い方、会話の進め方、学習できる言語についての質問にお答えします。",
      items: [
        { question: "AI Language Tutor とは何ですか？", answer: "会話を通して語学を練習できる AI の先生です。話す内容に合わせて、自然な表現やフィードバックを提案します。" },
        { question: "AI Language Tutor はどのように使いますか？", answer: "話したいことを入力または音声で伝えるだけです。Tutor が目標言語で返し、必要に応じて言い方や発音のヒントを出します。" },
        { question: "母語で質問できますか？", answer: "はい。目標言語でどう言えばよいか分からないときは、まず母語で意味を伝えられます。" },
        { question: "AI Tutor と会話練習はできますか？", answer: "できます。日常会話、旅行、仕事などのテーマで、返答しながら会話を続ける練習ができます。" },
        { question: "Tutor の発音を聞けますか？", answer: "はい。音声を聞いたり、ゆっくり再生したりして、自分で話す前に確認できます。" },
        { question: "どの言語を学べますか？", answer: "英語をはじめ、スペイン語、日本語、韓国語、中国語などの会話練習に対応しています。対応言語は順次広がります。" }
      ]
    },
    cta: { h2: "今日から、話す練習を始めよう", lead: "AI Tutor と話して、使える表現を増やしていきましょう。", primaryCta: "無料で話してみる", secondaryCta: "料金を見る" }
  },
  th: {
    learn: {
      eyebrow: "เรียนภาษาได้จากบทสนทนา",
      h2: "ฝึกพูดให้ใช้ได้จริง ไม่ใช่แค่ท่องจำ",
      lead: "คุยกับ AI Tutor ขอความช่วยเหลือได้ทันทีเมื่อคิดคำไม่ออก แล้วฝึกพูดต่อในภาษาที่คุณกำลังเรียน",
      cards: [
        { title: "Talk", description: "ฝึกบทสนทนาที่ไหลลื่น โดย Tutor ช่วยตอบและชวนคุยต่ออย่างเป็นธรรมชาติ" },
        { title: "ขอความช่วยเหลือ", description: "ถ้ายังไม่รู้จะพูดอย่างไร บอกความหมายเป็นภาษาแม่ของคุณได้เลย" },
        { title: "ลองพูดอีกครั้ง", description: "เรียนรู้ประโยคที่ฟังเป็นธรรมชาติ พูดตาม แล้วกลับไปคุยต่อได้ทันที" }
      ]
    },
    modes: {
      eyebrow: "เริ่มจากสิ่งที่คุณอยากสื่อ",
      h2: "นึกคำไม่ออก ก็ไม่ต้องหยุดบทสนทนา",
      lead: "บอก Tutor ว่าคุณหมายถึงอะไรด้วยภาษาที่ถนัด แล้วรับประโยคที่เป็นธรรมชาติในภาษาที่กำลังเรียน ฝึกพูดเสร็จแล้วคุยต่อได้เลย",
      items: [
        { title: "ช่วยบอกวิธีพูด", description: "อธิบายความหมายด้วยภาษาแม่ แล้วรับประโยคที่เหมาะกับสถานการณ์ทันที" },
        { title: "คุยต่อ", description: "ลองพูดประโยคใหม่ แล้วตอบคำถามถัดไปจาก Tutor เพื่อให้บทสนทนาดำเนินต่อ" }
      ]
    },
    corrections: {
      eyebrow: "แก้ให้ตรงจุด",
      h2: "พูดไปด้วย ปรับให้ดีขึ้นไปด้วย",
      lead: "เห็นข้อผิดพลาดในจังหวะที่ยังจำได้ เข้าใจทางเลือกที่ฟังเป็นธรรมชาติกว่า แล้วนำไปใช้ในประโยคถัดไป",
      points: ["ไวยากรณ์", "คำศัพท์", "สำนวนที่เป็นธรรมชาติ", "การออกเสียง"]
    },
    stuck: {
      eyebrow: "ฝึกออกเสียง",
      h2: "ฟัง พูด และปรับการออกเสียงให้ชัดขึ้น",
      lead: "ฟังเสียงจาก Tutor แล้วลองพูดตาม รับคำแนะนำเฉพาะจุดเพื่อให้พูดชัดและมั่นใจขึ้น",
      points: ["ฟัง Tutor", "พูดตามประโยค", "รับฟีดแบ็กการพูด", "ลองใหม่อีกครั้ง"]
    },
    lesson: {
      eyebrow: "คำศัพท์จากสิ่งที่คุณพูด",
      h2: "เก็บคำที่มีประโยชน์จากบทสนทนาของคุณเอง",
      lead: "คำและวลีที่เจอระหว่างคุยคือสิ่งที่สอดคล้องกับสิ่งที่คุณอยากสื่อ จึงนำไปใช้ต่อในชีวิตจริงได้ง่ายกว่า",
      steps: ["คำใหม่", "วลีที่ใช้ได้จริง", "ฝึกพูด", "ทบทวน", "เห็นพัฒนาการ"]
    },
    personal: {
      eyebrow: "ทบทวนในแบบของคุณ",
      h2: "ทุกบทสนทนาเป็นส่วนหนึ่งของการเรียนต่อไป",
      lead: "เก็บวลี คำศัพท์ และจุดที่ควรแก้จากบทสนทนาไว้ในที่เดียว เพื่อกลับมาฝึกในเวลาที่เหมาะกับคุณ",
      stats: [
        { label: "หัวข้อทบทวน", value: "อดีตกาล" },
        { label: "รูปแบบการฝึก", value: "ปรับให้คุณ" },
        { label: "จังหวะการพูด", value: "ปรับตามระดับ" }
      ]
    },
    languages: {
      eyebrow: "พูดในภาษาที่อยากใช้จริง",
      h2: "ฝึกภาษาที่คุณอยากพูดได้คล่อง",
      lead: "เตรียมตัวสำหรับการเดินทาง งาน หรือชีวิตประจำวัน ผ่านบทสนทนาที่ใช้ได้จริงในภาษาที่คุณกำลังเรียน",
      items: ["อังกฤษ", "สเปน", "ญี่ปุ่น", "เกาหลี", "จีน", "ฝรั่งเศส", "เยอรมัน"]
    },
    why: {
      eyebrow: "ทำไมต้องเรียนกับ AI Tutor",
      h2: "เพราะการพูดได้ ต้องได้พูดบ่อยพอ",
      lead: "ฝึกเรื่องท่องเที่ยว งาน สัมภาษณ์ หรือคุยเล่นได้ทุกเมื่อ และปรับความยากให้เหมาะกับระดับของคุณ",
      cards: [
        { title: "ซ้อมสถานการณ์จริง", description: "เตรียมภาษาไว้ใช้ตอนเดินทาง ทำงาน หรือพบคนใหม่ ๆ ด้วยบทสนทนาที่มีความหมาย" },
        { title: "เรียนตามระดับของคุณ", description: "Tutor ปรับภาษา ความเร็ว และคำอธิบายให้คุณตามทันและค่อย ๆ ก้าวหน้า" },
        { title: "กล้าพูดมากขึ้น", description: "ลองผิดลองถูกได้อย่างสบายใจ แล้วสร้างความมั่นใจจากการพูดซ้ำอย่างต่อเนื่อง" }
      ]
    },
    faq: {
      eyebrow: "คำถามที่พบบ่อย",
      h2: "คำถามเกี่ยวกับ AI Language Tutor",
      lead: "คำตอบสั้น ๆ เกี่ยวกับการใช้งาน การฝึกสนทนา และภาษาที่รองรับ",
      items: [
        { question: "AI Language Tutor คืออะไร?", answer: "คือผู้ช่วยเรียนภาษาด้วย AI ที่ให้คุณฝึกจากการสนทนา พร้อมประโยคที่เป็นธรรมชาติและคำแนะนำระหว่างเรียน" },
        { question: "ใช้งานอย่างไร?", answer: "พิมพ์หรือพูดสิ่งที่ต้องการสื่อ แล้ว Tutor จะตอบในภาษาเป้าหมาย พร้อมช่วยอธิบายหรือแก้ไขเมื่อจำเป็น" },
        { question: "ใช้ภาษาแม่ถามได้ไหม?", answer: "ได้ เมื่อยังไม่รู้ว่าจะพูดภาษาเป้าหมายอย่างไร คุณเริ่มจากภาษาแม่เพื่อบอกความหมายได้" },
        { question: "ฝึกคุยกับ AI Tutor ได้ไหม?", answer: "ได้ คุณฝึกบทสนทนาต่อเนื่องในหัวข้อประจำวัน การเดินทาง งาน และสถานการณ์ที่เลือกได้" },
        { question: "ฟังเสียงจาก Tutor ได้ไหม?", answer: "ได้ คุณฟังเสียงปกติหรือแบบช้าลง เพื่อจับจังหวะและออกเสียงตามก่อนตอบ" },
        { question: "เรียนภาษาอะไรได้บ้าง?", answer: "เริ่มฝึกสนทนาได้ในภาษาอังกฤษ สเปน ญี่ปุ่น เกาหลี จีน และภาษาอื่น ๆ ที่จะเพิ่มต่อไป" }
      ]
    },
    cta: { h2: "เริ่มฝึกพูดได้ตั้งแต่วันนี้", lead: "คุยกับ AI Tutor แล้วเปลี่ยนสิ่งที่อยากพูดให้กลายเป็นประโยคที่ใช้ได้จริง", primaryCta: "เริ่มพูดฟรี", secondaryCta: "ดูราคา" }
  },
  ko: {
    learn: {
      eyebrow: "대화로 익히는 언어",
      h2: "공부만 하지 말고, 실제로 말해 보세요",
      lead: "AI Tutor와 대화하며 막히는 순간에는 도움을 받고, 배우는 언어로 끝까지 말하는 연습을 이어 갈 수 있습니다.",
      cards: [
        { title: "Talk", description: "Tutor가 자연스럽게 반응하고 대화를 이어 주는 실제 상황 중심의 회화를 연습합니다." },
        { title: "도움 받기", description: "어떻게 말해야 할지 모르겠다면, 먼저 모국어로 뜻을 알려 주세요." },
        { title: "다시 말해 보기", description: "더 자연스러운 표현을 익히고 소리 내어 연습한 뒤 대화로 돌아갈 수 있습니다." }
      ]
    },
    modes: {
      eyebrow: "말하고 싶은 뜻부터",
      h2: "표현이 떠오르지 않아도 대화를 멈출 필요는 없어요",
      lead: "모국어로 의도를 알려 주면 AI Tutor가 학습 언어에서 자연스러운 표현을 찾아 줍니다. 한 번 말해 본 뒤 바로 다음 대화로 이어 가세요.",
      items: [
        { title: "이렇게 말하고 싶어요", description: "모국어로 뜻을 설명하면 상황에 맞는 자연스러운 표현을 바로 받을 수 있습니다." },
        { title: "대화 이어 가기", description: "새 표현을 소리 내어 말한 다음 Tutor의 다음 질문에 답하며 흐름을 이어 갑니다." }
      ]
    },
    corrections: {
      eyebrow: "바로 이해하는 교정",
      h2: "말하면서 더 자연스러운 표현을 익히세요",
      lead: "틀린 부분만 표시하지 않습니다. 왜 바꾸는지 이해하고, 다음 답변에서 더 좋은 표현을 쓸 수 있도록 도와줍니다.",
      points: ["문법", "어휘", "자연스러운 표현", "발음"]
    },
    stuck: {
      eyebrow: "발음 연습",
      h2: "듣고, 따라 말하고, 발음을 다듬으세요",
      lead: "Tutor의 발음을 들은 뒤 직접 말해 보세요. 더 또렷하게 전달하기 위해 필요한 부분에 집중해서 피드백을 받을 수 있습니다.",
      points: ["Tutor 발음 듣기", "문장 따라 말하기", "말하기 피드백 받기", "다시 시도하기"]
    },
    lesson: {
      eyebrow: "대화에서 만나는 어휘",
      h2: "내가 나눈 대화에서 쓸모 있는 단어를 배우세요",
      lead: "내가 실제로 말하고 싶은 내용에서 나온 단어와 표현이라서, 외운 뒤에도 다음 대화에서 더 쉽게 활용할 수 있습니다.",
      steps: ["새 단어", "유용한 표현", "말해 보기", "복습", "성장 확인"]
    },
    personal: {
      eyebrow: "나를 위한 복습",
      h2: "대화 한 번이 다음 연습으로 이어집니다",
      lead: "대화 중 배운 표현, 교정, 단어를 한곳에 모아 두고 필요할 때마다 내 속도로 다시 연습할 수 있습니다.",
      stats: [
        { label: "복습 포인트", value: "과거 시제" },
        { label: "연습 방식", value: "나에게 맞춤" },
        { label: "말하기 속도", value: "수준에 맞게 조절" }
      ]
    },
    languages: {
      eyebrow: "원하는 언어로 말하기",
      h2: "정말 말하고 싶은 언어를 대화로 연습하세요",
      lead: "여행, 업무, 일상에 필요한 언어를 목표 언어의 실제 대화로 연습할 수 있습니다.",
      items: ["영어", "스페인어", "일본어", "한국어", "중국어", "프랑스어", "독일어"]
    },
    why: {
      eyebrow: "AI Tutor로 배우는 이유",
      h2: "말하기는 실제로 말할 때 늘어납니다",
      lead: "여행, 업무, 면접, 가벼운 대화까지. 원하는 시간에 내 수준에 맞는 주제로 말하기 연습을 시작할 수 있습니다.",
      cards: [
        { title: "현실적인 상황 연습", description: "여행이나 업무, 처음 만난 사람과의 대화처럼 곧 사용할 장면을 미리 연습합니다." },
        { title: "내 수준에 맞춘 학습", description: "어려운 표현에 멈추지 않도록 언어와 속도, 도움의 양을 조절해 줍니다." },
        { title: "부담 없이 말하기", description: "실수해도 괜찮은 환경에서 여러 번 말하며 자신감을 쌓을 수 있습니다." }
      ]
    },
    faq: {
      eyebrow: "자주 묻는 질문",
      h2: "AI Language Tutor에 대해 자주 묻는 질문",
      lead: "사용 방법, 대화 연습, 지원 언어에 관한 답변을 확인해 보세요.",
      items: [
        { question: "AI Language Tutor란 무엇인가요?", answer: "대화를 통해 언어를 연습할 수 있는 AI 선생님입니다. 말하고 싶은 내용에 맞춰 자연스러운 표현과 피드백을 제공합니다." },
        { question: "어떻게 사용하나요?", answer: "말하고 싶은 내용을 입력하거나 말하면 Tutor가 목표 언어로 응답합니다. 필요할 때 표현과 발음에 대한 도움도 받을 수 있습니다." },
        { question: "모국어로 질문해도 되나요?", answer: "네. 목표 언어로 어떻게 말해야 할지 모를 때는 먼저 모국어로 뜻을 전달할 수 있습니다." },
        { question: "AI Tutor와 회화 연습을 할 수 있나요?", answer: "네. 일상, 여행, 업무 등의 주제로 답변을 주고받으며 대화를 이어 가는 연습을 할 수 있습니다." },
        { question: "Tutor의 발음을 들을 수 있나요?", answer: "네. 음성을 듣거나 느린 속도로 재생해 보고, 직접 말하기 전에 표현을 확인할 수 있습니다." },
        { question: "어떤 언어를 배울 수 있나요?", answer: "영어를 비롯해 스페인어, 일본어, 한국어, 중국어 등의 회화 연습을 지원하며 계속 확장하고 있습니다." }
      ]
    },
    cta: { h2: "오늘, 한 문장부터 말해 보세요", lead: "AI Tutor와 대화하며 내가 실제로 쓸 표현을 늘려 가세요.", primaryCta: "무료로 말하기 시작", secondaryCta: "요금 보기" }
  },
  "zh-CN": {
    learn: {
      eyebrow: "在真实对话中学语言",
      h2: "不是多背一点，而是多开口一点",
      lead: "和 AI 导师聊真实场景。不会说时随时求助，再把新表达用回下一句对话里。",
      cards: [
        { title: "Talk", description: "像真实交流一样练习，导师会自然回应，并带着你把话题聊下去。" },
        { title: "获得帮助", description: "一时想不到目标语言怎么说，就先用你自己的语言说明意思。" },
        { title: "再说一遍", description: "学到更自然的说法，开口练一遍，再回到刚才的对话。" }
      ]
    },
    modes: {
      eyebrow: "先说清你的意思",
      h2: "不会说，也不用让对话停下来。",
      lead: "用你熟悉的语言告诉 Tutor 你想表达什么，它会给出贴合情境的目标语言说法。练一遍，就能接着聊。",
      items: [
        { title: "我想这样说", description: "用自己的语言解释意思，马上得到听起来自然、能直接用的表达。" },
        { title: "继续聊下去", description: "先把新句子说出来，再回答 Tutor 的追问，让交流真正发生。" }
      ]
    },
    corrections: {
      eyebrow: "即时纠错",
      h2: "边说边改，下一句就说得更自然",
      lead: "不只是告诉你哪里错了，也帮你理解更适合这个场景的表达，让改正真正用在下一轮对话里。",
      points: ["语法", "词汇", "自然表达", "发音"]
    },
    stuck: {
      eyebrow: "发音练习",
      h2: "先听，再说，让发音更清楚",
      lead: "听 Tutor 怎么说，再自己开口。获得针对性的提示，逐步说得更清晰、更有把握。",
      points: ["听 Tutor 示范", "跟读句子", "获得口语反馈", "再试一次"]
    },
    lesson: {
      eyebrow: "从对话里积累词汇",
      h2: "你需要的单词，会从你的对话里长出来",
      lead: "你在聊天中遇到的词和短语，正是你想表达的内容，所以更容易记住，也更容易在现实里用出来。",
      steps: ["新单词", "实用短语", "开口练习", "稍后复习", "看到进步"]
    },
    personal: {
      eyebrow: "为你保留的复习",
      h2: "每次对话，都会成为下一次进步的材料",
      lead: "把对话里的好表达、纠错和新词留在一起，之后可以按自己的节奏重新练习。",
      stats: [
        { label: "本次复习重点", value: "过去时" },
        { label: "练习方式", value: "为你定制" },
        { label: "对话节奏", value: "随水平调整" }
      ]
    },
    languages: {
      eyebrow: "用你想说的语言练习",
      h2: "想说哪门语言，就从真实对话开始",
      lead: "为了旅行、工作或日常沟通，在你正在学的语言里练习真正会遇到的场景。",
      items: ["英语", "西班牙语", "日语", "韩语", "中文", "法语", "德语"]
    },
    why: {
      eyebrow: "为什么选择 AI 导师",
      h2: "因为语言不是学会了才开口，而是开口后才会进步",
      lead: "旅行、工作、面试、闲聊，想练的时候就能练。内容和节奏会根据你的水平调整。",
      cards: [
        { title: "练真实场景", description: "提前练习旅行、职场和日常社交中真正会用到的对话。" },
        { title: "按你的水平来", description: "Tutor 会调整语言难度、速度和提示，让你跟得上，也能持续前进。" },
        { title: "没有压力地开口", description: "不用担心说错。多说几次，表达会越来越顺，自信也会慢慢建立。" }
      ]
    },
    faq: {
      eyebrow: "常见问题",
      h2: "关于 AI Language Tutor 的常见问题",
      lead: "这里回答关于使用方式、对话练习和支持语言的常见疑问。",
      items: [
        { question: "AI Language Tutor 是什么？", answer: "它是一位通过对话帮助你学语言的 AI 导师。你可以练习表达、获得自然说法和即时反馈。" },
        { question: "AI Language Tutor 怎么用？", answer: "输入或说出你想表达的内容，Tutor 会用目标语言回应。需要时，它也会解释表达、给出纠错建议。" },
        { question: "我可以用母语提问吗？", answer: "可以。还不知道目标语言怎么说时，先用母语告诉 Tutor 你想表达的意思即可。" },
        { question: "可以和 AI 导师练习对话吗？", answer: "可以。你可以围绕日常、旅行、工作等主题持续对话，练习如何自然回应。" },
        { question: "我能听到 Tutor 的发音吗？", answer: "可以。你可以试听或慢速播放，在自己开口前先熟悉句子的声音和节奏。" },
        { question: "我可以学哪些语言？", answer: "目前可用于英语、西班牙语、日语、韩语、中文等语言的会话练习，支持范围会持续增加。" }
      ]
    },
    cta: { h2: "今天就开始，把想说的话说出来", lead: "和 AI Tutor 练一次真实对话，让下一次开口更自然。", primaryCta: "免费开始对话", secondaryCta: "查看方案" }
  },
  "zh-TW": {
    learn: {
      eyebrow: "在真實對話裡學語言",
      h2: "不只讀和背，更要真的開口",
      lead: "和 AI 導師聊真實情境。卡住時隨時求助，再把剛學會的說法放回下一句對話裡。",
      cards: [
        { title: "Talk", description: "像真實交流一樣練習，導師會自然回應，帶著你把話題聊下去。" },
        { title: "取得幫助", description: "一時想不到目標語言怎麼說，就先用你熟悉的語言說明意思。" },
        { title: "再說一次", description: "學到更自然的說法，自己開口練一遍，再回到剛才的對話。" }
      ]
    },
    modes: {
      eyebrow: "先說清楚你想表達的意思",
      h2: "不知道怎麼說，也不用讓對話中斷。",
      lead: "用你習慣的語言告訴 Tutor 你的意思，它會給你符合情境的目標語言表達。練習過後，就能直接接著聊。",
      items: [
        { title: "我想這樣說", description: "用自己的語言解釋意思，馬上得到自然、能直接使用的表達。" },
        { title: "繼續聊下去", description: "先把新句子說出來，再回答 Tutor 的追問，讓交流繼續進行。" }
      ]
    },
    corrections: {
      eyebrow: "即時修正",
      h2: "一邊說，一邊學會更自然的表達",
      lead: "不只標示錯誤，也會告訴你這個情境裡更合適的說法，讓你下一句就能用得更好。",
      points: ["文法", "詞彙", "自然表達", "發音"]
    },
    stuck: {
      eyebrow: "發音練習",
      h2: "先聽，再說，讓發音更清楚",
      lead: "聽 Tutor 怎麼說，再自己開口練。透過重點提示，逐步說得更清晰、更有自信。",
      points: ["聽 Tutor 示範", "跟讀句子", "取得口說回饋", "再試一次"]
    },
    lesson: {
      eyebrow: "從對話累積詞彙",
      h2: "你真正需要的單字，就在你的對話裡",
      lead: "聊天時遇到的單字與片語，正好是你想表達的內容，因此更容易記住，也更容易在現實中用出來。",
      steps: ["新單字", "實用片語", "開口練習", "稍後複習", "看見進步"]
    },
    personal: {
      eyebrow: "為你保留的複習",
      h2: "每一次對話，都會變成下一次進步的材料",
      lead: "把對話中的好表達、修正與新詞整理在一起，之後可以依照自己的節奏再練一次。",
      stats: [
        { label: "這次複習重點", value: "過去式" },
        { label: "練習方式", value: "為你調整" },
        { label: "對話節奏", value: "依程度調整" }
      ]
    },
    languages: {
      eyebrow: "用想說的語言來練習",
      h2: "想把哪一種語言說好，就從對話開始",
      lead: "為了旅行、工作或日常溝通，在你正在學的語言裡練習真正會遇到的情境。",
      items: ["英語", "西班牙語", "日語", "韓語", "中文", "法語", "德語"]
    },
    why: {
      eyebrow: "為什麼選擇 AI 導師",
      h2: "因為開口練習，才會真的進步",
      lead: "旅行、工作、面試或日常閒聊，想練的時候隨時能開始。內容與節奏會跟著你的程度調整。",
      cards: [
        { title: "練習真實情境", description: "先練習旅行、職場與生活中真正會遇到的對話。" },
        { title: "依你的程度調整", description: "Tutor 會調整難度、速度與提示，讓你跟得上，也能持續往前。" },
        { title: "自在地開口", description: "不必害怕說錯。多說幾次，表達會越來越順，信心也會慢慢累積。" }
      ]
    },
    faq: {
      eyebrow: "常見問題",
      h2: "關於 AI Language Tutor 的常見問題",
      lead: "這裡整理使用方式、對話練習與支援語言的常見問題。",
      items: [
        { question: "AI Language Tutor 是什麼？", answer: "它是一位透過對話陪你練語言的 AI 導師。你可以練習表達、取得自然說法與即時回饋。" },
        { question: "AI Language Tutor 怎麼使用？", answer: "輸入或說出想表達的內容，Tutor 會用目標語言回應；需要時也會解釋說法並給你修正建議。" },
        { question: "可以用母語提問嗎？", answer: "可以。還不知道目標語言怎麼說時，先用母語告訴 Tutor 你想表達的意思即可。" },
        { question: "可以和 AI 導師練習對話嗎？", answer: "可以。你能圍繞日常、旅行、工作等主題持續對話，練習自然回應。" },
        { question: "我可以聽 Tutor 的發音嗎？", answer: "可以。可試聽或慢速播放，在自己開口前先熟悉句子的聲音和節奏。" },
        { question: "可以學哪些語言？", answer: "目前可用於英語、西班牙語、日語、韓語、中文等語言的會話練習，支援範圍會持續擴充。" }
      ]
    },
    cta: { h2: "今天就開始，把想說的話說出來", lead: "和 AI Tutor 練一次真實對話，讓下一次開口更自然。", primaryCta: "免費開始對話", secondaryCta: "查看方案" }
  },
  es: {
    learn: {
      eyebrow: "Aprende en conversaciones reales",
      h2: "No solo estudies: empieza a hablar",
      lead: "Habla con tu AI Tutor, pide ayuda cuando te falten palabras y sigue practicando en el idioma que estás aprendiendo.",
      cards: [
        { title: "Talk", description: "Practica una conversación de verdad: tu tutor responde de forma natural y mantiene el intercambio en marcha." },
        { title: "Pide ayuda", description: "Cuando no sepas cómo decir algo, explica primero la idea en el idioma que te resulte más cómodo." },
        { title: "Dilo otra vez", description: "Aprende la frase natural, practícala en voz alta y vuelve a la conversación." }
      ]
    },
    modes: {
      eyebrow: "Empieza por lo que quieres decir",
      h2: "Si no sabes cómo decirlo, la conversación no tiene por qué parar.",
      lead: "Cuéntale a tu Tutor la idea en tu propio idioma. Recibirás una forma natural de expresarla en tu idioma meta y podrás usarla en el siguiente turno.",
      items: [
        { title: "Quiero decir esto", description: "Explica la idea en tu idioma y recibe al momento una frase natural que encaja con la situación." },
        { title: "Sigue conversando", description: "Di la nueva frase y responde a la siguiente pregunta del Tutor para mantener viva la charla." }
      ]
    },
    corrections: {
      eyebrow: "Correcciones al momento",
      h2: "Mejora mientras hablas",
      lead: "No se trata solo de marcar un error. Entiende una alternativa más natural y úsala en tu siguiente respuesta.",
      points: ["Gramática", "Vocabulario", "Expresiones naturales", "Pronunciación"]
    },
    stuck: {
      eyebrow: "Práctica de pronunciación",
      h2: "Escucha, habla y afina tu pronunciación",
      lead: "Escucha al Tutor, repite la frase y recibe observaciones concretas para que tu forma de hablar se entienda mejor.",
      points: ["Escucha al Tutor", "Repite la frase", "Recibe feedback al hablar", "Inténtalo otra vez"]
    },
    lesson: {
      eyebrow: "Vocabulario que sale de ti",
      h2: "Aprende palabras útiles de tus propias conversaciones",
      lead: "Las palabras y frases que aparecen mientras hablas están conectadas con lo que de verdad quieres comunicar, así que es más fácil volver a usarlas.",
      steps: ["Palabras nuevas", "Frases útiles", "Práctica oral", "Repaso", "Progreso"]
    },
    personal: {
      eyebrow: "Repaso personal",
      h2: "Cada conversación deja material para seguir aprendiendo",
      lead: "Guarda expresiones, correcciones y palabras de tus conversaciones para retomarlas y practicarlas a tu ritmo.",
      stats: [
        { label: "En qué repasar", value: "Pasado" },
        { label: "Estilo de práctica", value: "Personalizado" },
        { label: "Ritmo al hablar", value: "Adaptado a ti" }
      ]
    },
    languages: {
      eyebrow: "Habla el idioma que quieres usar",
      h2: "Practica el idioma que quieres llegar a hablar",
      lead: "Para viajar, trabajar o moverte con más soltura en el día a día, practica conversaciones en el idioma que estás aprendiendo.",
      items: ["Inglés", "Español", "Japonés", "Coreano", "Chino", "Francés", "Alemán"]
    },
    why: {
      eyebrow: "Por qué aprender con un AI Tutor",
      h2: "Hablar más es la forma más directa de ganar soltura",
      lead: "Practica para viajes, trabajo, entrevistas, conversaciones cotidianas o lo que necesites, cuando te venga bien y a tu nivel.",
      cards: [
        { title: "Practica situaciones reales", description: "Prepárate para viajes, trabajo o conversaciones de todos los días con situaciones que sí vas a usar." },
        { title: "Aprende a tu nivel", description: "El Tutor ajusta la dificultad, el ritmo y las ayudas para que puedas avanzar sin perderte." },
        { title: "Habla sin presión", description: "Equivocarte forma parte del proceso. Prueba, repite y gana confianza antes de usar el idioma fuera." }
      ]
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      h2: "Preguntas frecuentes sobre AI Language Tutor",
      lead: "Respuestas rápidas sobre cómo funciona, cómo practicar y los idiomas disponibles.",
      items: [
        { question: "¿Qué es un AI Language Tutor?", answer: "Es un profesor con AI que te ayuda a practicar un idioma conversando. Te propone formas naturales de expresarte y te da feedback mientras avanzas." },
        { question: "¿Cómo funciona?", answer: "Escribe o di lo que quieres comunicar. El Tutor responde en tu idioma meta y, si lo necesitas, explica expresiones, gramática o pronunciación." },
        { question: "¿Puedo empezar desde mi idioma nativo?", answer: "Sí. Si no sabes cómo decir algo en el idioma que estudias, puedes explicar primero lo que quieres decir en tu propio idioma." },
        { question: "¿Puedo practicar conversaciones con el AI Tutor?", answer: "Sí. Puedes mantener conversaciones sobre situaciones cotidianas, viajes, trabajo y otros temas que quieras practicar." },
        { question: "¿Puedo escuchar al Tutor?", answer: "Sí. Escucha la respuesta o reprodúcela más despacio para captar el sonido y el ritmo antes de hablar." },
        { question: "¿Qué idiomas puedo practicar?", answer: "Puedes practicar conversaciones en inglés, español, japonés, coreano, chino y otros idiomas que iremos incorporando." }
      ]
    },
    cta: { h2: "Empieza a hablar hoy", lead: "Ten una conversación con tu AI Tutor y convierte lo que quieres decir en frases que puedas usar.", primaryCta: "Empieza gratis", secondaryCta: "Ver planes" }
  }
};

export function getLandingSections(locale: Exclude<Locale, "en">): LandingSections {
  return localizedLandingSections[locale];
}
