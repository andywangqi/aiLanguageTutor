"use client";

import { useRef, useState } from "react";
import { ArrowRight, BookOpen, Languages, Mic, Sparkles, Volume2 } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";

type DemoCopy = { pair: string; inputLabel: string; placeholder: string; getPhrase: string; userFallback: string; responseLabel: string; response: string; naturalLabel: string; naturalPhrase: string; listen: string; translate: string; learn: string; practice: string; listening: string; passed: string; tryAgain: string; unsupported: string };

const copy: Record<LandingDictionary["locale"], DemoCopy> = {
  en: { pair: "Your language → English", inputLabel: "What do you want to say?", placeholder: "I want to ask for a day off…", getPhrase: "Get natural phrase", userFallback: "I want to say this naturally.", responseLabel: "AI tutor response", response: "You could say:", naturalLabel: "Natural phrase", naturalPhrase: "I’d like to take a day off.", listen: "Listen", translate: "Translate", learn: "Learn", practice: "Repeat this phrase", listening: "Listening…", passed: "Great match. Your words match the phrase.", tryAgain: "Try again. Listen once more, then repeat the phrase.", unsupported: "Voice repetition is not supported here. You can still practice by reading the phrase aloud." },
  ja: { pair: "あなたの言語 → 英語", inputLabel: "何と言いたいですか？", placeholder: "休みを取りたい…", getPhrase: "自然な表現を見る", userFallback: "自然に言えるように練習したいです。", responseLabel: "AIチューターの返答", response: "こう言うと自然です：", naturalLabel: "自然な表現", naturalPhrase: "I’d like to take a day off.", listen: "聞く", translate: "翻訳", learn: "学ぶ", practice: "この表現を復唱", listening: "聞き取り中…", passed: "よくできました。表現と一致しています。", tryAgain: "もう一度試しましょう。聞いてから復唱してください。", unsupported: "このブラウザでは音声確認に対応していません。文章を見ながら練習できます。" },
  th: { pair: "ภาษาของคุณ → อังกฤษ", inputLabel: "คุณอยากพูดอะไร?", placeholder: "ฉันอยากขอลาหยุด…", getPhrase: "ดูประโยคธรรมชาติ", userFallback: "ฉันอยากพูดให้เป็นธรรมชาติ", responseLabel: "คำตอบจาก AI Tutor", response: "พูดแบบนี้จะเป็นธรรมชาติมากขึ้น:", naturalLabel: "ประโยคธรรมชาติ", naturalPhrase: "I’d like to take a day off.", listen: "ฟัง", translate: "แปล", learn: "เรียนรู้", practice: "พูดตามประโยคนี้", listening: "กำลังฟัง…", passed: "ดีมาก คำที่พูดตรงกับประโยค", tryAgain: "ลองอีกครั้ง ฟังแล้วพูดตามประโยค", unsupported: "เบราว์เซอร์นี้ไม่รองรับการตรวจเสียง คุณยังฝึกโดยอ่านประโยคได้" },
  ko: { pair: "내 언어 → 영어", inputLabel: "무엇을 말하고 싶나요?", placeholder: "하루 쉬고 싶다고 말하고 싶어요…", getPhrase: "자연스러운 표현 보기", userFallback: "이 말을 자연스럽게 하고 싶어요.", responseLabel: "AI 튜터 응답", response: "이렇게 말하면 자연스러워요:", naturalLabel: "자연스러운 표현", naturalPhrase: "I’d like to take a day off.", listen: "듣기", translate: "번역", learn: "배우기", practice: "이 표현 따라 말하기", listening: "듣는 중…", passed: "잘했어요. 표현과 일치합니다.", tryAgain: "다시 시도해 보세요. 듣고 표현을 따라 말해 보세요.", unsupported: "이 브라우저에서는 음성 확인을 지원하지 않습니다. 문장을 읽으며 연습할 수 있어요." },
  "zh-CN": { pair: "你的语言 → 英语", inputLabel: "你想表达什么？", placeholder: "我想请一天假……", getPhrase: "获取自然表达", userFallback: "我想更自然地表达这句话。", responseLabel: "AI Tutor 回复", response: "你可以这样说：", naturalLabel: "自然表达", naturalPhrase: "I’d like to take a day off.", listen: "听一遍", translate: "翻译", learn: "学习", practice: "复读这句话", listening: "正在听…", passed: "很好，你说的内容与句子匹配。", tryAgain: "再试一次，先听一遍，然后复读这句话。", unsupported: "当前浏览器不支持语音检查，你仍然可以看着句子练习。" },
  "zh-TW": { pair: "你的語言 → 英語", inputLabel: "你想表達什麼？", placeholder: "我想請一天假……", getPhrase: "取得自然表達", userFallback: "我想更自然地表達這句話。", responseLabel: "AI Tutor 回覆", response: "你可以這樣說：", naturalLabel: "自然表達", naturalPhrase: "I’d like to take a day off.", listen: "聽一遍", translate: "翻譯", learn: "學習", practice: "複誦這句話", listening: "正在聽…", passed: "很好，你說的內容與句子相符。", tryAgain: "再試一次，先聽一遍，然後複誦這句話。", unsupported: "目前瀏覽器不支援語音檢查，你仍然可以看著句子練習。" },
  es: { pair: "Tu idioma → inglés", inputLabel: "¿Qué quieres decir?", placeholder: "Quiero pedir un día libre…", getPhrase: "Ver frase natural", userFallback: "Quiero decirlo de forma natural.", responseLabel: "Respuesta del tutor", response: "Podrías decir:", naturalLabel: "Frase natural", naturalPhrase: "I’d like to take a day off.", listen: "Escuchar", translate: "Traducir", learn: "Aprender", practice: "Repetir esta frase", listening: "Escuchando…", passed: "Muy bien. Tus palabras coinciden con la frase.", tryAgain: "Inténtalo otra vez. Escucha y repite la frase.", unsupported: "Este navegador no admite la comprobación de voz. Puedes practicar leyendo la frase." }
};

function normalize(value: string) { return value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }

export function InteractiveDemo({ dictionary }: { dictionary: LandingDictionary }) {
  const demo = dictionary.product.demo;
  const text = copy[dictionary.locale];
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<any>(null);
  const phrase = text.naturalPhrase;

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  function checkRepeat() {
    const browserWindow = window as any;
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) { setStatus(text.unsupported); return; }
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    setStatus(text.listening);
    recognition.onresult = (event: any) => {
      const spoken = event.results[0]?.[0]?.transcript || "";
      setStatus(normalize(spoken).includes(normalize(phrase)) || normalize(phrase).includes(normalize(spoken)) ? text.passed : text.tryAgain);
    };
    recognition.onerror = () => setStatus(text.tryAgain);
    recognition.start();
  }

  return <div className="demo-panel hero-product-demo" id="demo">
    <div className="demo-product-header"><div><span className="demo-window-dot" aria-hidden="true" /><strong>{demo.productName}</strong></div><span className="demo-language-pair"><Languages aria-hidden="true" size={16} />{text.pair}</span></div>
    <div className="demo-input-area"><label htmlFor="hero-demo-input">{text.inputLabel}</label><div className="demo-input-row"><input id="hero-demo-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={text.placeholder} /><button type="button" onClick={() => setSubmitted(true)}>{text.getPhrase}</button></div></div>
    <div className="demo-conversation" aria-live="polite"><div className="demo-message-stack"><div className="demo-message-row user"><div className="demo-avatar">{demo.userLabel}</div><div className="demo-chat-bubble user"><span>{demo.userInstruction}</span><strong>{input.trim() || text.userFallback}</strong></div></div>{submitted ? <div className="demo-message-row tutor"><div className="demo-avatar tutor">AI</div><div className="demo-chat-bubble tutor"><span>{text.responseLabel}</span><strong>{text.response} {phrase}</strong><div className="demo-learning-actions" aria-label={`${text.listen}, ${text.translate}, ${text.learn}`}><button type="button" onClick={speak}><Volume2 aria-hidden="true" size={15} />{text.listen}</button><button type="button"><Languages aria-hidden="true" size={15} />{text.translate}</button><button type="button"><BookOpen aria-hidden="true" size={15} />{text.learn}</button></div></div></div> : null}</div>{submitted ? <div className="demo-assist-card"><span><Sparkles aria-hidden="true" size={15} />{text.naturalLabel}</span><strong>{phrase}</strong></div> : null}</div>
    {submitted ? <div className="demo-practice-row"><button type="button" onClick={checkRepeat}><Mic aria-hidden="true" size={18} />{status === text.listening ? text.listening : text.practice}</button><div className="demo-mic-meter" aria-hidden="true"><span /><span /><span /><span /></div></div> : null}
    {status && status !== text.listening ? <p className="demo-status" role="status">{status}</p> : null}
    <div className="demo-learning-flow" aria-label={demo.learningFlow.join(" → ")}>{demo.learningFlow.map((step, index) => <span key={step}>{step}{index < demo.learningFlow.length - 1 ? <ArrowRight aria-hidden="true" size={13} /> : null}</span>)}</div>
  </div>;
}
