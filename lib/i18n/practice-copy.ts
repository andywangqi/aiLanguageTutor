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
  ja: { title: "AI Language Tutor | 言葉に詰まったときも話す練習", h1: "言いたいことを表現しながら、会話を練習", description: "母語で伝えたいことを入力し、自然な表現を聞いて会話で練習。翻訳や文法の説明を求め、役立つフレーズを保存できます。" },
  th: { title: "AI Language Tutor | ฝึกพูดพร้อมตัวช่วย", h1: "ฝึกพูดพร้อมตัวช่วยเมื่อคิดคำไม่ออก", description: "เปลี่ยนสิ่งที่อยากพูดเป็นประโยคที่เป็นธรรมชาติ ฟัง ฝึกสนทนา ขอคำแปลและคำอธิบายไวยากรณ์ แล้วบันทึกวลีที่มีประโยชน์" },
  ko: { title: "AI Language Tutor | 막힐 때 도움받는 말하기 연습", h1: "말이 막힐 때 도움받으며 회화를 연습하세요", description: "하고 싶은 말을 자연스러운 표현으로 바꾸고 듣고 대화에서 연습하세요. 필요할 때 번역과 문법 도움을 받고 유용한 표현을 저장하세요." },
  "zh-CN": { title: "AI Language Tutor | 卡住时有帮助的口语练习", h1: "想说却不知道怎么说？边求助，边练口语", description: "用母语输入想表达的意思，听自然表达，再放进对话中练习。按需获取翻译和语法解释，保存实用句子，方便下次使用。" },
  "zh-TW": { title: "AI Language Tutor | 卡住時有幫助的口說練習", h1: "想說卻不知道怎麼說？邊求助，邊練口說", description: "用母語輸入想表達的意思，聽自然表達，再放進對話中練習。按需取得翻譯和文法解釋，儲存實用句子，方便下次使用。" },
  es: { title: "AI Language Tutor | Practica con ayuda al hablar", h1: "Practica hablando con ayuda cuando te bloqueas", description: "Expresa lo que quieres decir, escucha frases naturales y úsalas en una conversación. Pide traducciones y ayuda gramatical, y guarda frases útiles." }
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
