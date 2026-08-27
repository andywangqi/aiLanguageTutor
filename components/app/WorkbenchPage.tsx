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
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { trackEvent } from "@/lib/analytics/client";
import { ApiError, type TutorConversation, type TutorMessage, type WorkbenchData } from "@/lib/api/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { BrandMark } from "./BrandMark";

type NavItem = "Home" | "Chat history" | "Saved cards" | "Partners";
type WorkbenchMode = "sayIt" | "talk";
type InsightMode = "Translate" | "Grammar";
type Message = {
  id: string;
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
    id: "demo-welcome",
    role: "tutor",
    text: "What would you like to do this weekend?"
  }
];

export function WorkbenchPage() {
  const router = useRouter();
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
  const [apiNotice, setApiNotice] = useState("");
  const [isRemoteSession, setIsRemoteSession] = useState(false);
  const [isApiBusy, setIsApiBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voiceTranscriptRef = useRef("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const audioCapturePromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    let active = true;

    async function hydrateWorkbench() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return;

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }

      if (!active) return;
      setIsRemoteSession(true);

      try {
        await api.auth.sync();
        const workbench = await api.workbench.get();
        if (!active) return;
        applyWorkbenchData(workbench);
      } catch {
        if (active) setApiNotice("Your account is connected. The tutor service is temporarily unavailable, so this page is showing the practice preview.");
      }
    }

    if (isSupabaseConfigured()) void hydrateWorkbench();

    return () => {
      active = false;
    };
  }, [router]);

  const workspaceTitle = useMemo(() => {
    if (activeNav === "Chat history") return "Chat history";
    if (activeNav === "Saved cards") return "Saved cards";
    if (activeNav === "Partners") return "Your partners";
    return "AI Language Tutor";
  }, [activeNav]);
  const selectedMessage = messages.find((message) => message.role === "tutor" && message.text === selectedPhrase);

  function applyWorkbenchData(workbench: WorkbenchData) {
    const settings = workbench.settings;
    if (settings?.nativeLanguageCode) setNativeLanguage(languageName(settings.nativeLanguageCode));
    if (settings?.learningLanguageCode) setLearningLanguage(languageName(settings.learningLanguageCode));
    if (settings?.levelCode) setLevel(levelName(settings.levelCode));

    const conversation = workbench.currentConversation || workbench.conversation || workbench.recentConversations?.[0];
    if (conversation?.id) {
      setConversationId(conversation.id);
      const remoteMessages = getConversationMessages(conversation);
      if (remoteMessages.length > 0) setMessages(remoteMessages);
      setLanguageModalOpen(false);
    }
  }

  function resetDemoConversation(nextMode = mode) {
    setMessages([
      {
        id: `demo-${Date.now()}`,
        role: "tutor",
        text: nextMode === "sayIt" ? "What would you like to say in English?" : "What would you like to talk about today?"
      }
    ]);
    setSelectedPhrase("");
    setInput("");
  }

  async function createConversation(nextMode = mode) {
    resetDemoConversation(nextMode);
    setApiNotice("");

    if (!isRemoteSession) return;

    setIsApiBusy(true);
    try {
      const conversationPayload = {
        mode: nextMode === "sayIt" ? "say_it" : "talk",
        nativeLanguageCode: languageCode(nativeLanguage),
        learningLanguageCode: languageCode(learningLanguage),
        levelCode: levelCode(level)
      };
      const conversation = conversationId
        ? await api.conversations.reset(conversationId, conversationPayload)
        : await api.conversations.create(conversationPayload);
      setConversationId(conversation.id);
      const remoteMessages = getConversationMessages(conversation);
      if (remoteMessages.length > 0) setMessages(remoteMessages);
      await trackEvent("conversation_started", { mode: nextMode });
    } catch {
      setApiNotice("A new conversation could not be created. Please try again.");
    } finally {
      setIsApiBusy(false);
    }
  }

  function startConversation() {
    void createConversation();
  }

  function switchMode(nextMode: WorkbenchMode) {
    setMode(nextMode);
    void createConversation(nextMode);
  }

  async function getOrCreateConversation() {
    if (conversationId) return conversationId;

    const conversation = await api.conversations.create({
      mode: mode === "sayIt" ? "say_it" : "talk",
      nativeLanguageCode: languageCode(nativeLanguage),
      learningLanguageCode: languageCode(learningLanguage),
      levelCode: levelCode(level)
    });
    setConversationId(conversation.id);
    return conversation.id;
  }

  async function sendMessageText(text: string, inputType: "text" | "voice" = "text", audioBlob?: Blob | null) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const clientMessageId = crypto.randomUUID();
    const userMessage: Message = { id: clientMessageId, role: "user", text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setApiNotice("");

    if (!isRemoteSession) {
      setMessages((current) => [
        ...current,
        {
          id: `demo-${Date.now()}`,
          role: "tutor",
          text:
            mode === "sayIt"
              ? "Nice. I understand you. Try saying it once more in English, and I’ll help you make it sound natural."
              : "Nice. Keep the conversation going. I’ll reply in English and adjust the pace to your level."
        }
      ]);
      return;
    }

    setIsApiBusy(true);
    try {
      const currentConversationId = await getOrCreateConversation();
      const sourceLanguageCode = inputType === "voice" && mode === "talk" ? languageCode(learningLanguage) : languageCode(nativeLanguage);
      if (inputType === "voice") {
        let audioId: string | undefined;

        if (audioBlob) {
          const mimeType = audioBlob.type || "audio/webm";
          const upload = await api.voice.uploadUrl({ mimeType });
          const uploadUrl = stringValue(upload.uploadUrl) || stringValue(upload.signedUrl) || stringValue(upload.url);
          const audioPath = stringValue(upload.audioPath) || stringValue(upload.path) || stringValue(upload.objectPath);

          if (uploadUrl && audioPath) {
            const uploadResponse = await fetch(uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": mimeType },
              body: audioBlob
            });
            if (!uploadResponse.ok) throw new Error("Voice upload failed.");

            const voiceInput = await api.voice.registerInput({
              conversationId: currentConversationId,
              audioPath,
              mimeType,
              durationMs: 0
            });
            audioId = stringValue(voiceInput.id) || stringValue(voiceInput.audioId);
          }
        }

        await api.conversations.sendVoiceMessage(currentConversationId, {
          clientMessageId,
          transcript: trimmed,
          ...(audioId ? { audioId } : {}),
          sourceLanguageCode
        });
      } else {
        await api.conversations.sendMessage(currentConversationId, {
          clientMessageId,
          content: trimmed,
          inputType,
          sourceLanguageCode
        });
      }
      const conversation = await api.conversations.get(currentConversationId);
      const remoteMessages = getConversationMessages(conversation);
      if (remoteMessages.length > 0) setMessages(remoteMessages);
      await trackEvent(inputType === "voice" ? "voice_transcribed" : "message_submitted", { mode });
    } catch (error) {
      const message = error instanceof ApiError && error.code === "AI_PROVIDER_ERROR"
        ? "Your message was saved, but the tutor could not reply yet. Please try again shortly."
        : "Your message could not be sent. Please try again.";
      setApiNotice(message);
    } finally {
      setIsApiBusy(false);
    }
  }

  function sendMessage() {
    void sendMessageText(input);
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
      void trackEvent("voice_recording_started", { mode });
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
      void finishAudioCapture();
      setVoiceNotice(
        event.error === "not-allowed"
          ? "Microphone permission was denied. Allow microphone access and try again."
          : "I couldn’t hear that. Please try again."
      );
    };
    recognition.onend = () => {
      void finishVoiceInput();
    };
    recognitionRef.current = recognition;
    setVoiceNotice("");
    audioCapturePromiseRef.current = startAudioCapture();
    recognition.start();
  }

  function stopVoiceInput() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setVoiceNotice("Sending…");
  }

  async function startAudioCapture() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? { mimeType: "audio/webm;codecs=opus" } : undefined;
      const recorder = new MediaRecorder(stream, options);
      voiceChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch {
      // SpeechRecognition can still provide a transcript when audio upload is unavailable.
    }
  }

  function stopAndBuildAudio() {
    const recorder = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;

    if (!recorder) {
      stream?.getTracks().forEach((track) => track.stop());
      return Promise.resolve<Blob | null>(null);
    }

    return new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        stream?.getTracks().forEach((track) => track.stop());
        const blob = voiceChunksRef.current.length > 0 ? new Blob(voiceChunksRef.current, { type: recorder.mimeType || "audio/webm" }) : null;
        voiceChunksRef.current = [];
        resolve(blob);
      };
      if (recorder.state !== "inactive") recorder.stop();
      else resolve(null);
    });
  }

  async function finishAudioCapture() {
    await audioCapturePromiseRef.current;
    audioCapturePromiseRef.current = null;
    return stopAndBuildAudio();
  }

  async function finishVoiceInput() {
    setIsListening(false);
    recognitionRef.current = null;
    const transcript = voiceTranscriptRef.current.trim();
    voiceTranscriptRef.current = "";
    const audioBlob = await finishAudioCapture();

    if (transcript) {
      await sendMessageText(transcript, "voice", audioBlob);
      setVoiceNotice("Sent");
    }
  }

  async function saveLanguageSettings() {
    setLanguageModalOpen(false);
    if (!isRemoteSession) return;

    try {
      await api.me.updateSettings({
        nativeLanguageCode: languageCode(nativeLanguage),
        learningLanguageCode: languageCode(learningLanguage),
        levelCode: levelCode(level)
      });
      setApiNotice("");
    } catch {
      setApiNotice("Your language settings could not be saved. Please try again.");
    }
  }

  async function requestMessageHelp(message: Message, kind: "translate" | "grammar" | "audio" | "card") {
    setSelectedPhrase(message.text);
    if (!isRemoteSession || message.id.startsWith("demo-")) return;

    try {
      if (kind === "translate") await api.messages.translate(message.id);
      if (kind === "grammar") await api.messages.grammar(message.id);
      if (kind === "audio") await api.messages.audio(message.id);
      if (kind === "card") {
        await api.messages.saveCard(message.id);
        await trackEvent("learning_card_saved", { messageId: message.id });
      }
    } catch {
      setApiNotice("That learning tool is temporarily unavailable. Please try again.");
    }
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
            <Link className="upgrade-button" href="/pricing">
              <CreditCard size={18} aria-hidden="true" />
              Start Pro
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
              <button className="new-conversation" type="button" onClick={startConversation} disabled={isApiBusy}>
                <RotateCcw size={17} aria-hidden="true" />
                {isApiBusy ? "Starting…" : "New conversation"}
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
                          <button type="button" onClick={() => void requestMessageHelp(message, "audio")}>
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
                          <button type="button" onClick={() => void requestMessageHelp(message, "translate")}>
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
                <button className="send-button" type="button" onClick={sendMessage} aria-label="Send message" disabled={isApiBusy}>
                  <Send size={18} aria-hidden="true" />
                </button>
              </div>
              {voiceNotice ? <p className="voice-notice">{voiceNotice}</p> : null}
              {apiNotice ? <p className="workbench-api-notice" role="status">{apiNotice}</p> : null}
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
                  <button type="button" onClick={() => selectedMessage && void requestMessageHelp(selectedMessage, "card")}>
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
          onSave={() => void saveLanguageSettings()}
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

function stringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function languageCode(language: string) {
  const codes: Record<string, string> = {
    Chinese: "zh-CN",
    English: "en",
    Spanish: "es",
    Japanese: "ja",
    French: "fr",
    Korean: "ko"
  };

  return codes[language] || "en";
}

function languageName(code: string) {
  const names: Record<string, string> = {
    "zh-CN": "Chinese",
    "zh-TW": "Chinese",
    en: "English",
    "en-US": "English",
    es: "Spanish",
    "es-ES": "Spanish",
    ja: "Japanese",
    "ja-JP": "Japanese",
    fr: "French",
    "fr-FR": "French",
    ko: "Korean",
    "ko-KR": "Korean"
  };

  return names[code] || "English";
}

function levelCode(level: string) {
  const codes: Record<string, string> = {
    "Auto-detect": "auto",
    Beginner: "beginner",
    Intermediate: "intermediate",
    Advanced: "advanced"
  };

  return codes[level] || "auto";
}

function levelName(code: string) {
  const names: Record<string, string> = {
    auto: "Auto-detect",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };

  return names[code] || "Auto-detect";
}

function getConversationMessages(conversation: TutorConversation) {
  const messages = conversation.messages || [];

  return messages
    .map((message: TutorMessage): Message | null => {
      const text = message.content || message.text;
      if (!text || !message.id) return null;

      return {
        id: message.id,
        role: message.role === "assistant" || message.role === "tutor" ? "tutor" : "user",
        text
      };
    })
    .filter((message): message is Message => Boolean(message));
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
  onSave,
  onClose
}: {
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  onNativeLanguageChange: (value: string) => void;
  onLearningLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSave: () => void;
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
          <button className="language-modal-primary" type="button" onClick={onSave}>
            Start talking
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
