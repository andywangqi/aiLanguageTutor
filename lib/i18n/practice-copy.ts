import type { Locale } from "./config";
import { trialMinutes } from "../billing/catalog";

export const trialLabels: Record<Locale, string> = {
  en: `${trialMinutes}-minute introductory trial`,
  ja: `初回${trialMinutes}分間の体験`,
  th: `ทดลองครั้งแรก ${trialMinutes} นาที`,
  ko: `첫 ${trialMinutes}분 체험`,
  "zh-CN": `首次 ${trialMinutes} 分钟试用`,
  "zh-TW": `首次 ${trialMinutes} 分鐘試用`,
  es: `Prueba inicial de ${trialMinutes} minuto`
};

export const positioning: Record<Exclude<Locale, "en">, { title: string; h1: string; description: string }> = {
  ja: { title: "AI Language Tutor | 言いたいことを自然な表現にして話す練習", h1: "言いたいことを伝えて、自然な表現で話す", description: "母語で伝えたいことを説明し、自然な表現を聞いて、実際の会話で練習。言葉に詰まっても翻訳や文法の助けを求められます。" },
  th: { title: "AI Language Tutor | บอกสิ่งที่อยากพูด แล้วฝึกพูดให้เป็นธรรมชาติ", h1: "บอกสิ่งที่อยากพูด แล้วฝึกพูดให้เป็นธรรมชาติ", description: "อธิบายสิ่งที่อยากพูดด้วยภาษาของคุณ รับประโยคที่เป็นธรรมชาติจาก AI Tutor แล้วนำไปฝึกในบทสนทนาจริง" },
  ko: { title: "AI Language Tutor | 말하고 싶은 뜻을 자연스럽게 말하기", h1: "말하고 싶은 뜻을 전하고, 자연스럽게 말해 보세요", description: "하고 싶은 말을 자신의 언어로 설명하고 자연스러운 표현을 받은 뒤 실제 대화에서 연습하세요. 막힐 때는 번역과 문법 도움을 요청할 수 있습니다." },
  "zh-CN": { title: "AI Language Tutor | 先说清楚意思，再自然地表达", h1: "先说清楚你想表达的意思，再自然地说出来", description: "先用自己的语言说明想表达的意思，获得自然表达，再把这句话放进真实对话中练习。卡住时还可以按需获取翻译和语法帮助。" },
  "zh-TW": { title: "AI Language Tutor | 先說清楚意思，再自然地表達", h1: "先說清楚你想表達的意思，再自然地說出來", description: "先用自己的語言說明想表達的意思，取得自然表達，再把這句話放進真實對話中練習。卡住時也能按需取得翻譯和文法協助。" },
  es: { title: "AI Language Tutor | Di lo que quieres decir y exprésalo con naturalidad", h1: "Di lo que quieres decir. Luego exprésalo con naturalidad.", description: "Explica lo que quieres decir en tu propio idioma, recibe una frase natural de tu tutor de AI y practícala en una conversación real." }
};

// Shared user-facing names for transcript-based feedback in every supported UI.
export const repeatCopy: Record<Locale, { label: string; note: string; correction: string; lead: string }> = {
  en: { label: "Repeat Check", note: "Compare recognized words with the target sentence. This is not an acoustic pronunciation score.", correction: "Ask for translation or grammar help", lead: "Use Help me say it for an expression, or request translation and grammar help when you need it." },
  ja: { label: "復唱チェック", note: "認識された単語と例文を比較します。音声による発音評価ではありません。", correction: "翻訳や文法のヘルプを求める", lead: "言い方の提案、翻訳、文法の説明を必要なときに選べます。" },
  th: { label: "ตรวจการพูดตาม", note: "เปรียบเทียบคำที่ระบบรู้จำกับประโยคเป้าหมาย ไม่ใช่คะแนนการออกเสียงจากเสียง", correction: "ขอคำแปลหรือคำอธิบายไวยากรณ์", lead: "ขอความช่วยเหลือในการเรียบเรียง คำแปล หรือไวยากรณ์เมื่อคุณต้องการ" },
  ko: { label: "따라 말하기 확인", note: "인식된 단어를 목표 문장과 비교합니다. 음성 기반 발음 점수가 아닙니다.", correction: "번역 또는 문법 도움 요청", lead: "필요할 때 표현, 번역, 문법 도움을 선택하세요." },
  "zh-CN": { label: "复述检查", note: "比较识别出的文字与目标句，不是音频级发音评分。", correction: "按需获取翻译和语法帮助", lead: "不知道怎么说时点击“帮我表达”，也可以按需查看翻译和语法解释。" },
  "zh-TW": { label: "複述檢查", note: "比較辨識出的文字與目標句，不是音訊級發音評分。", correction: "按需取得翻譯和文法協助", lead: "不知道怎麼說時點擊「幫我表達」，也可以按需查看翻譯和文法解釋。" },
  es: { label: "Comprobación de repetición", note: "Compara las palabras reconocidas con la frase. No es una puntuación acústica de pronunciación.", correction: "Pide ayuda con traducción o gramática", lead: "Pide una expresión natural, una traducción o una explicación gramatical cuando la necesites." }
};

export function honestFeedbackLabel(value: string, locale: Locale) {
  return value.replace(/Basic pronunciation feedback|Pronunciation feedback|pronunciation feedback|基本的な発音フィードバック|発音フィードバック|คำแนะนำการออกเสียงพื้นฐาน|คำแนะนำการออกเสียง|기본 발음 피드백|발음 피드백|基础发音反馈|发音反馈|基础发音纠正|发音纠正|基礎發音回饋|發音回饋|發音修正|Comentarios básicos de pronunciación|Comentarios de pronunciación|Feedback de pronunciación|Corrección de pronunciación/gi, repeatCopy[locale].label);
}
