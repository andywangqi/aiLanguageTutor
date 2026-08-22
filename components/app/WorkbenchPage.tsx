"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  EyeOff,
  Globe2,
  History,
  Home,
  Languages,
  Lightbulb,
  Mic,
  MicOff,
  PanelRight,
  Plus,
  RotateCcw,
  Send,
  Settings2,
  Sparkles,
  Users,
  Volume2,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";

type NavItem = "Home" | "Chat history" | "Saved cards" | "Partners";
type WorkbenchMode = "sayIt" | "talk";
type InsightMode = "Translate" | "Grammar";
type Message = {
  id: number;
  role: "tutor" | "user";
  text: string;
};

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const navItems: Array<{ label: NavItem; icon: typeof Home }> = [
  { label: "Home", icon: Home },
  { label: "Chat history", icon: History },
  { label: "Saved cards", icon: BookOpen },
  { label: "Partners", icon: Users }
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "tutor",
    text: "What would you like to do this weekend?"
  }
];

export function WorkbenchPage() {
  const [activeNav, setActiveNav] = useState<NavItem>("Home");
  const [mode, setMode] = useState<WorkbenchMode>("sayIt");
  const [insightMode, setInsightMode] = useState<InsightMode>("Translate");
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(true);
  const [nativeLanguage, setNativeLanguage] = useState("Chinese");
  const [learningLanguage, setLearningLanguage] = useState("English");
  const [level, setLevel] = useState("Auto-detect");
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voiceTranscriptRef = useRef("");

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const workspaceTitle = useMemo(() => {
    if (activeNav === "Chat history") return "Chat history";
    if (activeNav === "Saved cards") return "Saved cards";
    if (activeNav === "Partners") return "Your partners";
    return "AI Language Tutor";
  }, [activeNav]);

  function startConversation() {
    setMessages([
      {
        id: Date.now(),
        role: "tutor",
        text: mode === "sayIt" ? "What would you like to say in English?" : "What would you like to talk about today?"
      }
    ]);
    setSelectedPhrase("");
    setInput("");
  }

  function switchMode(nextMode: WorkbenchMode) {
    setMode(nextMode);
    setMessages([
      {
        id: Date.now(),
        role: "tutor",
        text:
          nextMode === "sayIt"
            ? "What would you like to say in English?"
            : "What would you like to talk about today?"
      }
    ]);
    setSelectedPhrase("");
  }

  function sendMessageText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: trimmed },
      {
        id: Date.now() + 1,
        role: "tutor",
        text:
          mode === "sayIt"
            ? "Nice. I understand you. Try saying it once more in English, and I’ll help you make it sound natural."
            : "Nice. Keep the conversation going. I’ll reply in English and adjust the pace to your level."
      }
    ]);
    setInput("");
  }

  function sendMessage() {
    sendMessageText(input);
  }

  function startVoiceInput() {
    if (isListening) return;

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceNotice("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = mode === "sayIt" ? getSpeechLocale(nativeLanguage) : getSpeechLocale(learningLanguage);
    recognition.continuous = false;
    recognition.interimResults = true;
    voiceTranscriptRef.current = "";
    recognition.onstart = () => {
      setVoiceNotice("Release to send");
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index][0].transcript)
        .join(" ")
        .trim();
      voiceTranscriptRef.current = transcript;
      setInput(transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      voiceTranscriptRef.current = "";
      setVoiceNotice(
        event.error === "not-allowed"
          ? "Microphone permission was denied. Allow microphone access and try again."
          : "I couldn’t hear that. Please try again."
      );
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      const transcript = voiceTranscriptRef.current.trim();
      voiceTranscriptRef.current = "";
      if (transcript) {
        sendMessageText(transcript);
        setVoiceNotice("Sent");
      }
    };
    recognitionRef.current = recognition;
    setVoiceNotice("");
    recognition.start();
  }

  function stopVoiceInput() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setVoiceNotice("Sending…");
  }

  return (
    <main className="workbench-shell">
      <aside className="workbench-sidebar">
        <BrandMark />
        <nav className="workbench-nav" aria-label="Workbench">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={activeNav === label ? "active" : ""}
              key={label}
              type="button"
              onClick={() => setActiveNav(label)}
            >
              <Icon size={21} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="workbench-account">
          <span className="account-avatar">A</span>
          <span>
            <strong>alex.tutor</strong>
            <small>Free plan</small>
          </span>
          <ChevronDown size={17} aria-hidden="true" />
        </div>
      </aside>

      <section className="workbench-main">
        <header className="workbench-topbar">
          <div>
            <span className="workbench-mobile-nav">{activeNav}</span>
            <h1>{workspaceTitle}</h1>
            <p>Listen in English. Reply in English or your own language.</p>
          </div>
          <div className="workbench-top-actions">
            <button className="language-settings-button" type="button" onClick={() => setLanguageModalOpen(true)}>
              <Globe2 size={18} aria-hidden="true" />
              <span>
                {nativeLanguage} → {learningLanguage}
              </span>
            </button>
            <Link className="upgrade-button" href="#">
              <CreditCard size={18} aria-hidden="true" />
              Upgrade
            </Link>
          </div>
        </header>

        <section className="partner-banner">
          <div className="partner-identity">
            <div className="partner-avatar">
              <span>✦</span>
            </div>
            <div>
              <h2>Clara Ruiz</h2>
              <strong>Female · From Valencia</strong>
              <p>Calm, observant, gently witty</p>
            </div>
          </div>
          <div className="partner-actions">
            <button type="button" onClick={() => setPartnerOpen((open) => !open)}>
              <Settings2 size={17} aria-hidden="true" />
              Customize
            </button>
            <button type="button" onClick={() => setPartnerOpen(true)}>
              <Users size={17} aria-hidden="true" />
              Change partner
            </button>
          </div>
        </section>

        {partnerOpen ? (
          <section className="partner-popover">
            <div>
              <span className="panel-label">Partner settings</span>
              <strong>Clara is ready for a relaxed conversation.</strong>
            </div>
            <button type="button" onClick={() => setPartnerOpen(false)} aria-label="Close partner settings">
              <X size={17} aria-hidden="true" />
            </button>
          </section>
        ) : null}

        <section className="workbench-mode-switcher" aria-label="Practice mode">
          <div>
            <span className="panel-label">Practice mode</span>
            <strong>{mode === "sayIt" ? "Say It / Translate" : "Talk / Conversation"}</strong>
          </div>
          <div className="workbench-mode-tabs" role="tablist">
            <button
              className={mode === "sayIt" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "sayIt"}
              onClick={() => switchMode("sayIt")}
            >
              <Languages size={17} aria-hidden="true" />
              Say It / Translate
            </button>
            <button
              className={mode === "talk" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "talk"}
              onClick={() => switchMode("talk")}
            >
              <MessageCircleIcon />
              Talk / Conversation
            </button>
          </div>
        </section>

        <section className="workbench-grid">
          <div className="conversation-card">
            <div className="conversation-header">
              <div className="conversation-person">
                <div className="partner-avatar small">
                  <span>✦</span>
                </div>
                <div>
                  <strong>Clara Ruiz</strong>
                  <span>AI tutor</span>
                </div>
              </div>
              <div className="conversation-stats">
                <Stat value="1" label="MINUTES" />
                <Stat value={String(messages.length)} label="MESSAGES" />
                <Stat value="0" label="YOUR TURNS" />
                <Stat value="8" label="INPUT WORDS" />
              </div>
              <button className="new-conversation" type="button" onClick={startConversation}>
                <RotateCcw size={17} aria-hidden="true" />
                New conversation
              </button>
            </div>

            <div className="conversation-body">
              <div className="today-label">TODAY</div>
              <div className="message-list">
                {messages.map((message) => (
                  <div className={`workbench-message ${message.role}`} key={message.id}>
                    <div className="partner-avatar mini">
                      <span>✦</span>
                    </div>
                    <div className="message-bubble">
                      {message.role === "tutor" ? (
                        <button
                          className="phrase-button"
                          type="button"
                          onClick={() => setSelectedPhrase(message.text)}
                        >
                          {message.text}
                        </button>
                      ) : (
                        message.text
                      )}
                      {message.role === "tutor" ? (
                        <div className="message-tools">
                          <button type="button">
                            <Volume2 size={15} aria-hidden="true" />
                            Listen
                          </button>
                          <button type="button">
                            <Clock3 size={15} aria-hidden="true" />
                            Slow
                          </button>
                          <button type="button" onClick={() => setSelectedPhrase("")}>
                            <EyeOff size={15} aria-hidden="true" />
                            Hide
                          </button>
                          <button type="button" onClick={() => setSelectedPhrase(message.text)}>
                            <Languages size={15} aria-hidden="true" />
                            Translation
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="conversation-footer">
              <div className="conversation-shortcuts">
                <button className="lost" type="button">
                  <AlertCircle size={16} aria-hidden="true" />
                  I&apos;m lost
                </button>
                <button className="got-it" type="button">
                  <Brain size={16} aria-hidden="true" />
                  Did I get it?
                </button>
                <button className="show-hints" type="button">
                  Show hints
                </button>
              </div>
              <div className="message-composer">
                {isListening ? (
                  <div className="voice-wave-overlay" aria-live="polite">
                    <span className="voice-wave-label">Release to send</span>
                    <span className="voice-wave" aria-hidden="true">
                      {[18, 30, 44, 26, 38, 52, 31, 20, 42, 27].map((height, index) => (
                        <i key={index} style={{ height: `${height}%` }} />
                      ))}
                    </span>
                  </div>
                ) : null}
                <input
                  className={isListening ? "voice-input-hidden" : ""}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder={mode === "sayIt" ? "Type what you want to say" : "Reply in English or your own language"}
                  aria-label="Message"
                />
                <button
                  className={isListening ? "voice-button listening" : "voice-button"}
                  type="button"
                  onPointerDown={startVoiceInput}
                  onPointerUp={stopVoiceInput}
                  onPointerCancel={stopVoiceInput}
                  onPointerLeave={stopVoiceInput}
                  aria-label="Hold to speak"
                  aria-pressed={isListening}
                  title="Hold to speak, release to send"
                >
                  {isListening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                </button>
                <button className="send-button" type="button" onClick={sendMessage} aria-label="Send message">
                  <Send size={18} aria-hidden="true" />
                </button>
              </div>
              {voiceNotice ? <p className="voice-notice">{voiceNotice}</p> : null}
            </div>
          </div>

          <aside className="insight-panel">
            <div className="insight-tabs">
              <button
                className={insightMode === "Translate" ? "active" : ""}
                type="button"
                onClick={() => setInsightMode("Translate")}
              >
                <Languages size={17} aria-hidden="true" />
                Translate
              </button>
              <button
                className={insightMode === "Grammar" ? "active" : ""}
                type="button"
                onClick={() => setInsightMode("Grammar")}
              >
                <Brain size={17} aria-hidden="true" />
                Grammar
              </button>
            </div>
            <div className="insight-content">
              {selectedPhrase ? (
                <div className="selected-insight">
                  <span className="insight-icon">
                    {insightMode === "Translate" ? <Languages size={22} /> : <Brain size={22} />}
                  </span>
                  <span className="panel-label">{insightMode}</span>
                  <h2>{selectedPhrase}</h2>
                  <p>
                    {insightMode === "Translate"
                      ? "A natural sentence you can understand and use in your next conversation."
                      : "Notice the word order and the everyday expression. Try saying it out loud once."}
                  </p>
                  <button type="button">
                    <Plus size={17} aria-hidden="true" />
                    Save learning card
                  </button>
                </div>
              ) : (
                <div className="insight-empty">
                  <span className="insight-icon">
                    <Sparkles size={24} aria-hidden="true" />
                  </span>
                  <h2>Highlight or type text</h2>
                  <p>Select a word or phrase from Clara Ruiz, or type it below, to see meaning or grammar.</p>
                </div>
              )}
            </div>
            <div className="insight-input">
              <textarea placeholder="Type a word or phrase from Clara Ruiz" aria-label="Word lookup" />
              <div className="insight-actions">
                <button type="button">
                  <Volume2 size={16} aria-hidden="true" />
                  Listen
                </button>
                <button className="translate" type="button" onClick={() => setInsightMode("Translate")}>
                  <Languages size={16} aria-hidden="true" />
                  Translate
                </button>
                <button className="grammar" type="button" onClick={() => setInsightMode("Grammar")}>
                  <Brain size={16} aria-hidden="true" />
                  Grammar
                </button>
              </div>
            </div>
          </aside>
        </section>

        <div className="workbench-footer-note">
          <PanelRight size={15} aria-hidden="true" />
          Your conversation is private and saved to your account.
          <ArrowRight size={14} aria-hidden="true" />
        </div>
      </section>

      {languageModalOpen ? (
        <LanguageSetupModal
          nativeLanguage={nativeLanguage}
          learningLanguage={learningLanguage}
          level={level}
          onNativeLanguageChange={setNativeLanguage}
          onLearningLanguageChange={setLearningLanguage}
          onLevelChange={setLevel}
          onClose={() => setLanguageModalOpen(false)}
        />
      ) : null}
    </main>
  );
}

function MessageCircleIcon() {
  return (
    <span className="mode-icon" aria-hidden="true">
      <Users size={17} />
    </span>
  );
}

function getSpeechLocale(language: string) {
  const locales: Record<string, string> = {
    Chinese: "zh-CN",
    English: "en-US",
    Spanish: "es-ES",
    Japanese: "ja-JP",
    French: "fr-FR",
    Korean: "ko-KR"
  };

  return locales[language] ?? "en-US";
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="conversation-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function LanguageSetupModal({
  nativeLanguage,
  learningLanguage,
  level,
  onNativeLanguageChange,
  onLearningLanguageChange,
  onLevelChange,
  onClose
}: {
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  onNativeLanguageChange: (value: string) => void;
  onLearningLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onClose: () => void;
}) {
  const languages = ["Chinese", "English", "Spanish", "Japanese", "French", "Korean"];
  const levels = ["Auto-detect", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="language-modal-backdrop" role="presentation">
      <section className="language-modal" role="dialog" aria-modal="true" aria-labelledby="language-modal-title">
        <button className="language-modal-close" type="button" onClick={onClose} aria-label="Close language setup">
          <X size={18} aria-hidden="true" />
        </button>
        <span className="language-modal-icon">
          <Globe2 size={25} aria-hidden="true" />
        </span>
        <span className="panel-label">GET STARTED</span>
        <h2 id="language-modal-title">Choose your languages</h2>
        <p className="language-modal-lead">
          Tell your tutor what you already speak and what you want to practice. You can change this later.
        </p>

        <div className="language-form-grid">
          <label>
            <span>I speak</span>
            <select value={nativeLanguage} onChange={(event) => onNativeLanguageChange(event.target.value)}>
              {languages.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>
          <label>
            <span>I&apos;m learning</span>
            <select value={learningLanguage} onChange={(event) => onLearningLanguageChange(event.target.value)}>
              {languages.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>
          <label>
            <span>My level</span>
            <select value={level} onChange={(event) => onLevelChange(event.target.value)}>
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="language-modal-actions">
          <button className="language-modal-secondary" type="button" onClick={onClose}>
            I&apos;ll choose later
          </button>
          <button className="language-modal-primary" type="button" onClick={onClose}>
            Start talking
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
