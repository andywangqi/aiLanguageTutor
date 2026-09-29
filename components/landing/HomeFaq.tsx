"use client";

import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const faqCopy: Record<Locale, { title: string; items: Array<{ q: string; a: string }> }> = {
  en: { title: "Frequently Asked Questions", items: [
    { q: "What is an AI Language Tutor?", a: "AI Language Tutor helps you practice speaking through real conversations with AI. Choose the language you want to learn, pick a situation, and start talking." },
    { q: "What if I don't know how to say something?", a: "You don't have to stop the conversation. You can explain what you want to say in your own language and get help expressing it in the language you're learning." },
    { q: "Do I have to speak the target language from the beginning?", a: "No. You can use your own language when you need help, then try saying the idea in the language you're learning. You can also practice directly in your target language." },
    { q: "Can I practice real-life conversations?", a: "Yes. You can practice situations such as travel, everyday conversations, work, and job interviews. The goal is to practice language you may actually need to use." },
    { q: "Will it correct my mistakes?", a: "Yes. When you say something incorrectly or unnaturally, the tutor can show you a better way to express it and let you try again." },
    { q: "Can I learn vocabulary while I practice speaking?", a: "Yes. You can learn words and phrases in the context of a conversation instead of studying them separately. Useful words and phrases can be reviewed later." },
    { q: "Can I see translations when I get stuck?", a: "Yes. Translation can be used as support when you need it, so you can understand the conversation without turning the whole experience into a translation exercise." },
    { q: "Do I need to prepare before starting a conversation?", a: "No. Choose a language and a situation, then start talking. If you don't know what to say, you can get help during the conversation and keep going." }
  ] },
  ja: { title: "よくある質問", items: [
    { q: "AI Language Tutorとは何ですか?", a: "AIとのリアルな会話でスピーキングを練習できます。学びたい言語とシーンを選んで、すぐ話し始められます。" },
    { q: "言い方がわからないときはどうすればいいですか?", a: "会話を止める必要はありません。自分の言葉で伝えたい内容を説明すれば、学んでいる言語での言い方を提案してもらえます。" },
    { q: "最初から目標言語で話さなければいけませんか?", a: "いいえ。困ったときは母語で助けを求め、その後で目標言語で言い直せます。最初から目標言語だけで練習することもできます。" },
    { q: "実生活の会話を練習できますか?", a: "はい。旅行、日常会話、仕事、面接などのシーンを練習できます。実際に使いそうな表現を身につけることが目標です。" },
    { q: "間違いを直してもらえますか?", a: "はい。間違いや不自然な表現があれば、より良い言い方を提案し、もう一度言い直すことができます。" },
    { q: "話しながら単語も覚えられますか?", a: "はい。単語やフレーズを会話の文脈で学べます。役立つ表現は後で復習できます。" },
    { q: "困ったときに翻訳を見られますか?", a: "はい。必要なときに翻訳をサポートとして使えるので、翻訳練習にならずに会話を理解できます。" },
    { q: "始める前に準備は必要ですか?", a: "いいえ。言語とシーンを選んですぐ話せます。何を言えばいいかわからなくても、会話中に助けを求めて続けられます。" }
  ] },
  th: { title: "คำถามที่พบบ่อย", items: [
    { q: "AI Language Tutor คืออะไร?", a: "ช่วยฝึกพูดผ่านบทสนทนาจริงกับ AI เลือกภาษาที่อยากเรียน เลือกสถานการณ์ แล้วเริ่มคุยได้เลย" },
    { q: "ถ้าพูดไม่เป็นจะทำอย่างไร?", a: "ไม่ต้องหยุดบทสนทนา อธิบายสิ่งที่อยากพูดด้วยภาษาของคุณ แล้วขอวิธีพูดในภาษาที่กำลังเรียนได้" },
    { q: "ต้องพูดภาษาเป้าหมายตั้งแต่แรกไหม?", a: "ไม่ต้อง ใช้ภาษาของคุณขอความช่วยเหลือก่อน แล้วค่อยลองพูดในภาษาที่เรียน หรือจะฝึกภาษาเป้าหมายโดยตรงก็ได้" },
    { q: "ฝึกบทสนทนาในชีวิตจริงได้ไหม?", a: "ได้ ฝึกได้ทั้งท่องเที่ยว บทสนทนาประจำวัน การทำงาน และสัมภาษณ์งาน เพื่อใช้ได้จริง" },
    { q: "จะช่วยแก้ข้อผิดพลาดไหม?", a: "ใช่ เมื่อพูดผิดหรือไม่เป็นธรรมชาติ ติวเตอร์จะเสนอวิธีพูดที่ดีกว่าให้ลองพูดใหม่อีกครั้ง" },
    { q: "เรียนคำศัพท์ขณะฝึกพูดได้ไหม?", a: "ได้ เรียนคำและวลีในบริบทบทสนทนาแทนการท่องแยก และกลับมาทบทวนได้ภายหลัง" },
    { q: "ดูคำแปลตอนติดขัดได้ไหม?", a: "ได้ ใช้คำแปลเป็นตัวช่วยเมื่อจำเป็น เพื่อเข้าใจบทสนทนาโดยไม่กลายเป็นแบบฝึกแปล" },
    { q: "ต้องเตรียมตัวก่อนเริ่มไหม?", a: "ไม่ต้อง เลือกภาษาและสถานการณ์แล้วเริ่มคุยได้เลย ถ้าไม่รู้จะพูดอะไรก็ขอความช่วยเหลือระหว่างคุยได้" }
  ] },
  ko: { title: "자주 묻는 질문", items: [
    { q: "AI Language Tutor란 무엇인가요?", a: "AI와의 실제 대화를 통해 말하기를 연습할 수 있습니다. 배우고 싶은 언어와 상황을 고르고 바로 말해보세요." },
    { q: "말을 모르면 어떻게 하나요?", a: "대화를 멈출 필요가 없습니다. 자기 말로 하고 싶은 내용을 설명하면 배우는 언어로 표현하는 법을 알려줍니다." },
    { q: "처음부터 목표 언어로 말해야 하나요?", a: "아니요. 필요할 때는 모국어로 도움을 받고 목표 언어로 다시 말해보세요. 처음부터 목표 언어로만 연습할 수도 있습니다." },
    { q: "실생활 대화를 연습할 수 있나요?", a: "네. 여행, 일상 대화, 업무, 면접 등 실제 쓸 법한 상황을 연습합니다." },
    { q: "틀린 부분을 고쳐주나요?", a: "네. 틀리거나 어색한 표현이 있으면 더 좋은 표현을 보여주고 다시 말해볼 수 있습니다." },
    { q: "말하면서 단어도 배울 수 있나요?", a: "네. 대화 문맥에서 단어와 구절을 배우고, 유용한 표현은 나중에 복습할 수 있습니다." },
    { q: "막히면 번역을 볼 수 있나요?", a: "네. 필요할 때 번역을 보조로 쓸 수 있어 번역 연습이 되지 않으면서 이해할 수 있습니다." },
    { q: "시작 전에 준비가 필요한가요?", a: "아니요. 언어와 상황을 고르고 바로 시작하세요. 막히면 대화 중에 도움을 받고 계속할 수 있습니다." }
  ] },
  "zh-CN": { title: "常见问题", items: [
    { q: "什么是 AI Language Tutor?", a: "通过和 AI 进行真实对话来练口语。选好想学的语言和场景，就可以直接开口说了。" },
    { q: "不会说的时候怎么办?", a: "不用停下来。用你自己的话把想说的意思讲清楚，就能得到目标语言的地道说法。" },
    { q: "一开始就必须全程说目标语言吗?", a: "不用。需要时可以用母语求助，再试着用目标语言说一遍，也可以直接全程用目标语言练。" },
    { q: "能练真实生活里的对话吗?", a: "可以。可以练旅行、日常、工作、面试等场景，目标就是练真正用得上的说法。" },
    { q: "会纠正我的错误吗?", a: "会。说错或不地道时，导师会给你更好的说法，并让你再说一遍。" },
    { q: "练口语时能顺便学词汇吗?", a: "可以。单词和短语都在对话语境里学，而不是孤立背诵，实用的表达以后还能复习。" },
    { q: "卡住时能看翻译吗?", a: "可以。需要时可以用翻译辅助理解，而不会把整个练习变成翻译题。" },
    { q: "开始前需要准备吗?", a: "不用。选好语言和场景直接开聊，不知道说什么时可以在对话中求助并继续。" }
  ] },
  "zh-TW": { title: "常見問題", items: [
    { q: "什麼是 AI Language Tutor?", a: "透過和 AI 進行真實對話來練口說。選好想學的語言和情境，就可以直接開口說了。" },
    { q: "不會說的時候怎麼辦?", a: "不用停下來。用你自己的話把想說的意思講清楚，就能得到目標語言的道地說法。" },
    { q: "一開始就必須全程說目標語言嗎?", a: "不用。需要時可以用母語求助，再試著用目標語言說一遍，也可以直接全程用目標語言練。" },
    { q: "能練真實生活裡的對話嗎?", a: "可以。可以練旅行、日常、工作、面試等情境，目標就是練真正用得上的說法。" },
    { q: "會糾正我的錯誤嗎?", a: "會。說錯或不道地時，導師會給你更好的說法，並讓你再說一遍。" },
    { q: "練口說時能順便學詞彙嗎?", a: "可以。單字和短語都在對話語境裡學，而不是孤立背誦，實用的表達以後還能複習。" },
    { q: "卡住時能看翻譯嗎?", a: "可以。需要時可以用翻譯輔助理解，而不會把整個練習變成翻譯題。" },
    { q: "開始前需要準備嗎?", a: "不用。選好語言和情境直接開聊，不知道說什麼時可以在對話中求助並繼續。" }
  ] },
  es: { title: "Preguntas frecuentes", items: [
    { q: "¿Qué es AI Language Tutor?", a: "Te ayuda a practicar hablando con conversaciones reales con IA. Elige el idioma, elige una situación y empieza a hablar." },
    { q: "¿Qué hago si no sé cómo decir algo?", a: "No tienes que detener la conversación. Explica lo que quieres decir en tu idioma y recibe ayuda para expresarlo en el idioma que aprendes." },
    { q: "¿Tengo que hablar el idioma meta desde el principio?", a: "No. Puedes usar tu idioma para pedir ayuda y luego intentarlo en el idioma que aprendes, o practicar directamente en tu idioma meta." },
    { q: "¿Puedo practicar conversaciones reales?", a: "Sí. Practica viajes, conversación diaria, trabajo y entrevistas. El objetivo es usar el idioma que realmente necesitas." },
    { q: "¿Corrige mis errores?", a: "Sí. Si dices algo incorrecto o poco natural, el tutor te muestra una mejor forma y puedes intentarlo de nuevo." },
    { q: "¿Puedo aprender vocabulario mientras hablo?", a: "Sí. Aprendes palabras y frases en el contexto de la conversación y puedes repasarlas después." },
    { q: "¿Puedo ver traducciones si me bloqueo?", a: "Sí. La traducción sirve de apoyo cuando la necesitas, sin convertir todo en un ejercicio de traducción." },
    { q: "¿Necesito prepararme antes de empezar?", a: "No. Elige un idioma y una situación y empieza. Si no sabes qué decir, pide ayuda durante la conversación." }
  ] }
};

export function HomeFaq({ locale }: { locale: Locale }) {
  const faq = faqCopy[locale];
  return (
    <section className="home-v1-faq-section" aria-label="FAQ">
      <div className="home-v1-section-heading"><h2>{faq.title}</h2></div>
      <div className="home-v1-faq-grid">
        {faq.items.map((item, i) => (
          <details className="home-v1-faq" key={item.q} open={i === 0}>
            <summary>{item.q}<ChevronDown size={15} /></summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
