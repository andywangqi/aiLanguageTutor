"use client";

import { ArrowRight, BookOpen, Languages, Mic, Sparkles, Volume2 } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";

const genericDemoCopy = {
  en: { pair: "Your language → English", user: "I want to say this naturally.", response: "You could say it more naturally this way.", assist: "Learn a natural phrase and use it in your next turn." },
  ja: { pair: "あなたの言語 → 英語", user: "これを自然に言いたいです。", response: "このように言うと、より自然です。", assist: "自然な表現を学び、次の会話で使いましょう。" },
  th: { pair: "ภาษาของคุณ → อังกฤษ", user: "ฉันอยากพูดสิ่งนี้ให้เป็นธรรมชาติ", response: "คุณสามารถพูดให้เป็นธรรมชาติมากขึ้นได้แบบนี้", assist: "เรียนรู้วลีที่เป็นธรรมชาติ แล้วใช้ในรอบถัดไป" },
  ko: { pair: "내 언어 → 영어", user: "이 말을 자연스럽게 하고 싶어요.", response: "이렇게 말하면 더 자연스러워요.", assist: "자연스러운 표현을 배우고 다음 대화에서 사용해 보세요." },
  "zh-CN": { pair: "你的语言 → 英语", user: "我想更自然地表达这句话。", response: "你可以这样说，会更自然。", assist: "学会自然表达，在下一轮对话中使用。" },
  "zh-TW": { pair: "你的語言 → 英語", user: "我想更自然地表達這句話。", response: "你可以這樣說，會更自然。", assist: "學會自然表達，在下一輪對話中使用。" },
  es: { pair: "Tu idioma → inglés", user: "Quiero decirlo de forma natural.", response: "Puedes decirlo de una forma más natural.", assist: "Aprende una expresión natural y úsala en tu próxima conversación." }
} as const;

export function InteractiveDemo({ dictionary }: { dictionary: LandingDictionary }) {
  const demo = dictionary.product.demo;
  const copy = genericDemoCopy[dictionary.locale];

  return (
    <div className="demo-panel hero-product-demo" id="demo">
      <div className="demo-product-header">
        <div>
          <span className="demo-window-dot" aria-hidden="true" />
          <strong>{demo.productName}</strong>
        </div>
        <button className="demo-language-pair" type="button" aria-label={demo.languagePairLabel}>
          <Languages aria-hidden="true" size={16} />
          {copy.pair}
        </button>
      </div>

      <div className="demo-conversation" aria-live="polite">
        <div className="demo-message-stack">
          <div className="demo-message-row user">
            <div className="demo-avatar">{demo.userLabel}</div>
            <div className="demo-chat-bubble user">
              <span>{demo.userInstruction}</span>
              <strong>{copy.user}</strong>
            </div>
          </div>

          <div className="demo-message-row tutor">
            <div className="demo-avatar tutor">AI</div>
            <div className="demo-chat-bubble tutor">
              <span>{demo.responseLabel}</span>
              <strong>{copy.response}</strong>
              <div className="demo-learning-actions" aria-label={demo.actions.join(", ")}>
                <button type="button">
                  <Volume2 aria-hidden="true" size={15} />
                  {demo.actions[0]}
                </button>
                <button type="button">
                  <Languages aria-hidden="true" size={15} />
                  {demo.actions[1]}
                </button>
                <button type="button">
                  <BookOpen aria-hidden="true" size={15} />
                  {demo.actions[2]}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-assist-card">
          <span>
            <Sparkles aria-hidden="true" size={15} />
            {demo.moreNaturalLabel}
          </span>
          <strong>{copy.assist}</strong>
        </div>
      </div>

      <div className="demo-practice-row">
        <button type="button">
          <Mic aria-hidden="true" size={18} />
          {demo.practiceCta}
        </button>
        <div className="demo-mic-meter" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="demo-learning-flow" aria-label={demo.learningFlow.join(" → ")}>
        {demo.learningFlow.map((step, index) => (
          <span key={step}>
            {step}
            {index < demo.learningFlow.length - 1 ? <ArrowRight aria-hidden="true" size={13} /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
