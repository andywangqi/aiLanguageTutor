"use client";

import { useRef, useState } from "react";
import { ArrowRight, Mic, Sparkles, Volume2 } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";

type DemoCopy = {
  pair: string;
  exampleLabel: string;
  exampleMeaning: string;
  responseLabel: string;
  response: string;
  naturalLabel: string;
  listen: string;
  practice: string;
  listening: string;
  passed: string;
  tryAgain: string;
  unsupported: string;
};

const copy: Record<LandingDictionary["locale"], DemoCopy> = {
  en: { pair: "Your language → English", exampleLabel: "Example", exampleMeaning: "I want to ask for a day off.", responseLabel: "AI tutor example", response: "You could say:", naturalLabel: "Natural phrase", listen: "Listen", practice: "Repeat this phrase", listening: "Listening…", passed: "Great match. Your words match the phrase.", tryAgain: "Try again. Listen once more, then repeat the phrase.", unsupported: "Voice repetition is not supported here. You can still practice by reading the phrase aloud." },
  ja: { pair: "あなたの言語 → 英語", exampleLabel: "例", exampleMeaning: "休みを1日取りたいです。", responseLabel: "AIチューターの例", response: "こう言うと自然です：", naturalLabel: "自然な表現", listen: "聞く", practice: "この表現を復唱", listening: "聞き取り中…", passed: "よくできました。表現と一致しています。", tryAgain: "もう一度試しましょう。聞いてから復唱してください。", unsupported: "このブラウザでは音声確認に対応していません。文章を見ながら練習できます。" },
  th: { pair: "ภาษาของคุณ → อังกฤษ", exampleLabel: "ตัวอย่าง", exampleMeaning: "ฉันอยากขอลาหยุดหนึ่งวัน", responseLabel: "ตัวอย่างจาก AI Tutor", response: "พูดแบบนี้จะเป็นธรรมชาติมากขึ้น:", naturalLabel: "ประโยคธรรมชาติ", listen: "ฟัง", practice: "พูดตามประโยคนี้", listening: "กำลังฟัง…", passed: "ดีมาก คำที่พูดตรงกับประโยค", tryAgain: "ลองอีกครั้ง ฟังแล้วพูดตามประโยค", unsupported: "เบราว์เซอร์นี้ไม่รองรับการตรวจเสียง คุณยังฝึกโดยอ่านประโยคได้" },
  ko: { pair: "내 언어 → 영어", exampleLabel: "예시", exampleMeaning: "하루 쉬고 싶어요.", responseLabel: "AI 튜터 예시", response: "이렇게 말하면 자연스러워요:", naturalLabel: "자연스러운 표현", listen: "듣기", practice: "이 표현 따라 말하기", listening: "듣는 중…", passed: "잘했어요. 표현과 일치합니다.", tryAgain: "다시 시도해 보세요. 듣고 표현을 따라 말해 보세요.", unsupported: "이 브라우저에서는 음성 확인을 지원하지 않습니다. 문장을 읽으며 연습할 수 있어요." },
  "zh-CN": { pair: "你的语言 → 英语", exampleLabel: "示例演示", exampleMeaning: "我想请一天假。", responseLabel: "AI Tutor 示例", response: "你可以这样说：", naturalLabel: "自然表达", listen: "听一遍", practice: "复读这句话", listening: "正在听…", passed: "很好，你说的内容与句子匹配。", tryAgain: "再试一次，先听一遍，然后复读这句话。", unsupported: "当前浏览器不支持语音检查，你仍然可以看着句子练习。" },
  "zh-TW": { pair: "你的語言 → 英語", exampleLabel: "範例展示", exampleMeaning: "我想請一天假。", responseLabel: "AI Tutor 範例", response: "你可以這樣說：", naturalLabel: "自然表達", listen: "聽一遍", practice: "複誦這句話", listening: "正在聽…", passed: "很好，你說的內容與句子相符。", tryAgain: "再試一次，先聽一遍，然後複誦這句話。", unsupported: "目前瀏覽器不支援語音檢查，你仍然可以看著句子練習。" },
  es: { pair: "Tu idioma → inglés", exampleLabel: "Ejemplo", exampleMeaning: "Quiero pedir un día libre.", responseLabel: "Ejemplo del tutor", response: "Podrías decir:", naturalLabel: "Frase natural", listen: "Escuchar", practice: "Repetir esta frase", listening: "Escuchando…", passed: "Muy bien. Tus palabras coinciden con la frase.", tryAgain: "Inténtalo otra vez. Escucha y repite la frase.", unsupported: "Este navegador no admite la comprobación de voz. Puedes practicar leyendo la frase." }
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[’']/g, "").replace(/[\p{P}\p{S}\s]/gu, "").trim();
}

export function InteractiveDemo({ dictionary }: { dictionary: LandingDictionary }) {
  const demo = dictionary.product.demo;
  const text = copy[dictionary.locale];
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<any>(null);
  const phrase = "空港までの送迎はありますか？";
  const exampleMeaning = "我想问酒店有没有机场接送服务。";

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "ja-JP";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  function checkRepeat() {
    const browserWindow = window as any;
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) { setStatus(text.unsupported); return; }
    const recognition = new Recognition();
    recognition.lang = "ja-JP";
    recognitionRef.current = recognition;
    setStatus(text.listening);
    recognition.onresult = (event: any) => {
      const spoken = event.results[0]?.[0]?.transcript || "";
      const spokenText = normalize(spoken);
      const targetText = normalize(phrase);
      setStatus(spokenText && targetText && (spokenText.includes(targetText) || targetText.includes(spokenText)) ? text.passed : text.tryAgain);
    };
    recognition.onerror = () => setStatus(text.tryAgain);
    recognition.start();
  }

  return <div className="demo-panel hero-product-demo" id="demo">
    <div className="demo-product-header"><div><span className="demo-window-dot" aria-hidden="true" /><strong>{demo.productName}</strong></div><span className="demo-language-pair">简体中文 → 日本語</span></div>
    <div className="demo-input-area demo-example-heading"><span>Fixed example · not a live AI response</span><span>{exampleMeaning}</span></div>
    <div className="demo-conversation" aria-live="polite"><div className="demo-message-stack">
      <div className="demo-message-row user"><div className="demo-avatar">{demo.userLabel}</div><div className="demo-chat-bubble user"><span>What I want to say</span><strong>{exampleMeaning}</strong></div></div>
      <div className="demo-message-row tutor"><div className="demo-avatar tutor">AI</div><div className="demo-chat-bubble tutor"><span>Natural Japanese expression</span><strong>{phrase}</strong><div className="demo-learning-actions"><button type="button" onClick={speak}><Volume2 aria-hidden="true" size={15} />{text.listen}</button></div></div></div>
    </div><div className="demo-assist-card"><span><Sparkles aria-hidden="true" size={15} />{text.naturalLabel}</span><strong>{phrase}</strong></div></div>
    <div className="demo-practice-row"><button type="button" onClick={checkRepeat}><Mic aria-hidden="true" size={18} />{status === text.listening ? text.listening : text.practice}</button><div className="demo-mic-meter" aria-hidden="true"><span /><span /><span /><span /></div></div>
    {status && status !== text.listening ? <p className="demo-status" role="status">{status}</p> : null}
    <div className="demo-learning-flow" aria-label={demo.learningFlow.join(" → ")}>{demo.learningFlow.map((step, index) => <span key={step}>{step}{index < demo.learningFlow.length - 1 ? <ArrowRight aria-hidden="true" size={13} /> : null}</span>)}</div>
  </div>;
}
