import type { Locale } from "./config";

export const practiceActions: Record<Locale, { skip: string; type: string; help: string; helpEmpty: string; note: string }> = {
  en: { skip: "Skip for now", type: "Continue by typing", help: "Help me say it", helpEmpty: "Type what you want to say in your own language, then choose Help me say it.", note: "Repeat Check compares recognized words with the sentence. It does not assess sounds, stress, or accent." },
  ja: { skip: "今はスキップ", type: "文字で続ける", help: "言い方を教えて", helpEmpty: "母語で伝えたいことを入力して、このボタンを押してください。", note: "復唱チェックは認識された単語を比較します。音・強勢・アクセントの評価ではありません。" },
  th: { skip: "ข้ามก่อน", type: "พิมพ์เพื่อฝึกต่อ", help: "ช่วยบอกวิธีพูด", helpEmpty: "พิมพ์สิ่งที่อยากพูดเป็นภาษาแม่ แล้วกดปุ่มนี้", note: "ตรวจคำที่ระบบรู้จำเทียบกับประโยค ไม่ได้ประเมินเสียง การลงน้ำหนัก หรือสำเนียง" },
  ko: { skip: "지금 건너뛰기", type: "입력으로 계속", help: "표현 도와주기", helpEmpty: "모국어로 하고 싶은 말을 입력한 다음 이 버튼을 누르세요.", note: "따라 말하기 확인은 인식된 단어를 비교합니다. 발음, 강세, 억양 평가는 아닙니다." },
  "zh-CN": { skip: "暂时跳过", type: "改用文字继续", help: "帮我表达", helpEmpty: "先用母语输入想说的意思，再点击“帮我表达”。", note: "复述检查比较识别出的文字与目标句，不评估音素、重音或口音。" },
  "zh-TW": { skip: "暫時跳過", type: "改用文字繼續", help: "幫我表達", helpEmpty: "先用母語輸入想說的意思，再點擊「幫我表達」。", note: "複述檢查比較辨識出的文字與目標句，不評估音素、重音或口音。" },
  es: { skip: "Omitir por ahora", type: "Continuar escribiendo", help: "Ayúdame a decirlo", helpEmpty: "Escribe lo que quieres decir en tu idioma y pulsa este botón.", note: "La comprobación compara palabras reconocidas con la frase. No evalúa sonidos, acento ni entonación." }
};
