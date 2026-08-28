"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Clock3,
  CreditCard,
  EyeOff,
  Globe2,
  History,
  Home,
  Languages,
  Lightbulb,
  LogOut,
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
import { trackEvent, trackEventOnce } from "@/lib/analytics/client";
import { paymentEventForStatus } from "@/lib/analytics/events";
import { ApiError, type TutorConversation, type TutorMessage, type WorkbenchData } from "@/lib/api/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { LandingDictionary, ProductCopy } from "@/lib/i18n/types";
import { BrandMark } from "./BrandMark";

type NavItem = "home" | "history" | "cards" | "partners";
type WorkbenchMode = "sayIt" | "talk";
type InsightMode = "translate" | "grammar";
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

const navItems: Array<{ key: NavItem; icon: typeof Home }> = [
  { key: "home", icon: Home },
  { key: "history", icon: History },
  { key: "cards", icon: BookOpen },
  { key: "partners", icon: Users }
];

type WorkbenchUiMessages = Pick<
  import("@/lib/i18n/types").ProductCopy["workbench"],
  | "tutorLabel"
  | "remoteUnavailable"
  | "newConversationError"
  | "demoSayItReply"
  | "demoTalkReply"
  | "providerError"
  | "messageError"
  | "settingsError"
  | "learningToolError"
> & { signOut: string; signingOut: string };

const localizedWorkbenchMessages: Record<Locale, WorkbenchUiMessages> = {
  en: {
    tutorLabel: "AI tutor",
    remoteUnavailable: "Your account is connected. The tutor service is temporarily unavailable, so this page is showing the practice preview.",
    newConversationError: "A new conversation could not be created. Please try again.",
    demoSayItReply: "Nice. I understand you. Try saying it once more in English, and I’ll help you make it sound natural.",
    demoTalkReply: "Nice. Keep the conversation going. I’ll reply in English and adjust the pace to your level.",
    providerError: "Your message was saved, but the tutor could not reply yet. Please try again shortly.",
    messageError: "Your message could not be sent. Please try again.",
    settingsError: "Your language settings could not be saved. Please try again.",
    learningToolError: "That learning tool is temporarily unavailable. Please try again.",
    signOut: "Sign out",
    signingOut: "Signing out…"
  },
  ja: {
    tutorLabel: "AIチューター",
    remoteUnavailable: "アカウントは接続されていますが、現在チューターサービスを利用できないため、練習プレビューを表示しています。",
    newConversationError: "新しい会話を開始できませんでした。もう一度お試しください。",
    demoSayItReply: "伝わりました。もう一度英語で言ってみましょう。自然な表現に整えるお手伝いをします。",
    demoTalkReply: "いいですね。このまま会話を続けましょう。レベルに合わせて英語で返答します。",
    providerError: "メッセージは保存されましたが、チューターからの返答を取得できませんでした。少し待って再試行してください。",
    messageError: "メッセージを送信できませんでした。もう一度お試しください。",
    settingsError: "言語設定を保存できませんでした。もう一度お試しください。",
    learningToolError: "学習ツールを一時的に利用できません。もう一度お試しください。",
    signOut: "ログアウト",
    signingOut: "ログアウト中…"
  },
  th: {
    tutorLabel: "AI Tutor",
    remoteUnavailable: "เชื่อมต่อบัญชีแล้ว แต่บริการ Tutor ยังไม่พร้อมใช้งานชั่วคราว จึงแสดงตัวอย่างการฝึกให้คุณดู",
    newConversationError: "เริ่มบทสนทนาใหม่ไม่ได้ ลองอีกครั้งนะ",
    demoSayItReply: "เข้าใจแล้ว ลองพูดเป็นภาษาอังกฤษอีกครั้ง แล้วฉันจะช่วยปรับให้ฟังเป็นธรรมชาติมากขึ้น",
    demoTalkReply: "ดีมาก คุยต่อได้เลย ฉันจะตอบเป็นภาษาอังกฤษและปรับจังหวะให้เหมาะกับระดับของคุณ",
    providerError: "บันทึกข้อความแล้ว แต่ Tutor ยังตอบกลับไม่ได้ ลองใหม่อีกครั้งในอีกสักครู่",
    messageError: "ส่งข้อความไม่ได้ ลองอีกครั้งนะ",
    settingsError: "บันทึกการตั้งค่าภาษาไม่ได้ ลองอีกครั้งนะ",
    learningToolError: "เครื่องมือการเรียนรู้ยังไม่พร้อมใช้งานชั่วคราว ลองอีกครั้งนะ",
    signOut: "ออกจากระบบ",
    signingOut: "กำลังออกจากระบบ…"
  },
  ko: {
    tutorLabel: "AI 튜터",
    remoteUnavailable: "계정은 연결되었지만 현재 튜터 서비스를 사용할 수 없어 연습 미리보기를 보여드리고 있습니다.",
    newConversationError: "새 대화를 시작할 수 없습니다. 다시 시도해 주세요.",
    demoSayItReply: "잘 이해했어요. 영어로 한 번 더 말해 보세요. 더 자연스럽게 다듬어 드릴게요.",
    demoTalkReply: "좋아요. 대화를 계속해 보세요. 현재 레벨에 맞춰 영어로 답할게요.",
    providerError: "메시지는 저장되었지만 튜터가 아직 답하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    messageError: "메시지를 보내지 못했습니다. 다시 시도해 주세요.",
    settingsError: "언어 설정을 저장하지 못했습니다. 다시 시도해 주세요.",
    learningToolError: "학습 도구를 잠시 사용할 수 없습니다. 다시 시도해 주세요.",
    signOut: "로그아웃",
    signingOut: "로그아웃 중…"
  },
  "zh-CN": {
    tutorLabel: "AI 导师",
    remoteUnavailable: "账号已连接，但导师服务暂时不可用。当前显示的是练习预览。",
    newConversationError: "暂时无法开始新对话，请稍后再试。",
    demoSayItReply: "我明白你的意思了。再用英语说一次，我会帮你调整得更自然。",
    demoTalkReply: "很好，继续聊下去吧。我会用英语回复，并根据你的水平调整表达和节奏。",
    providerError: "消息已保存，但导师暂时还没有回复，请稍后再试。",
    messageError: "消息发送失败，请再试一次。",
    settingsError: "语言设置保存失败，请再试一次。",
    learningToolError: "学习工具暂时不可用，请再试一次。",
    signOut: "退出登录",
    signingOut: "正在退出…"
  },
  "zh-TW": {
    tutorLabel: "AI 導師",
    remoteUnavailable: "帳號已連線，但 Tutor 服務暫時無法使用。目前顯示的是練習預覽。",
    newConversationError: "暫時無法開始新的會話，請稍後再試。",
    demoSayItReply: "我明白你的意思了。再用英語說一次，我會幫你調整得更自然。",
    demoTalkReply: "很好，繼續聊下去吧。我會用英語回覆，並依照你的程度調整表達和節奏。",
    providerError: "訊息已儲存，但 Tutor 暫時還沒有回覆，請稍後再試。",
    messageError: "訊息傳送失敗，請再試一次。",
    settingsError: "語言設定儲存失敗，請再試一次。",
    learningToolError: "學習工具暫時無法使用，請再試一次。",
    signOut: "登出",
    signingOut: "正在登出…"
  },
  es: {
    tutorLabel: "Tutor con AI",
    remoteUnavailable: "Tu cuenta está conectada, pero el servicio del tutor no está disponible ahora. Mostramos una vista previa de práctica.",
    newConversationError: "No se pudo iniciar una conversación nueva. Vuelve a intentarlo.",
    demoSayItReply: "Te entiendo. Inténtalo una vez más en inglés y te ayudaré a decirlo de forma más natural.",
    demoTalkReply: "Muy bien. Sigue la conversación. Responderé en inglés y adaptaré el ritmo a tu nivel.",
    providerError: "Tu mensaje se guardó, pero el tutor aún no pudo responder. Vuelve a intentarlo en un momento.",
    messageError: "No se pudo enviar el mensaje. Vuelve a intentarlo.",
    settingsError: "No se pudo guardar la configuración de idiomas. Vuelve a intentarlo.",
    learningToolError: "La herramienta de aprendizaje no está disponible ahora. Vuelve a intentarlo.",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión…"
  }
};

const initialMessages: Message[] = [
  {
    id: "demo-welcome",
    role: "tutor",
    text: "What would you like to do this weekend?"
  }
];

export function WorkbenchPage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const router = useRouter();
  const copy = useMemo(
    () => ({ ...dictionary.product.workbench, ...localizedWorkbenchMessages[locale] }),
    [dictionary.product.workbench, locale]
  );
  const [activeNav, setActiveNav] = useState<NavItem>("home");
  const [mode, setMode] = useState<WorkbenchMode>("sayIt");
  const [insightMode, setInsightMode] = useState<InsightMode>("translate");
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
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const paymentStatusTracked = useRef("");
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
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment");
    const event = paymentEventForStatus(status);
    if (!event) return;

    const plan = params.get("plan") || "unknown";
    const key = `${event}:${locale}:${plan}`;
    if (paymentStatusTracked.current === key) return;
    paymentStatusTracked.current = key;
    void trackEventOnce(key, event, { locale, plan_code: plan, payment_status: status });
  }, [locale]);

  useEffect(() => {
    let active = true;

    async function hydrateWorkbench() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return;

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(localizedPath(locale, "/login"));
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
        if (active) setApiNotice(copy.remoteUnavailable);
      }
    }

    if (isSupabaseConfigured()) void hydrateWorkbench();

    return () => {
      active = false;
    };
  }, [copy, locale, router]);

  const workspaceTitle = useMemo(() => {
    if (activeNav === "history") return copy.nav.history;
    if (activeNav === "cards") return copy.nav.cards;
    if (activeNav === "partners") return copy.nav.partners;
    return copy.title;
  }, [activeNav, copy]);
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
      setApiNotice(copy.newConversationError);
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
              ? copy.demoSayItReply
              : copy.demoTalkReply
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
        ? copy.providerError
        : copy.messageError;
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
      setVoiceNotice(copy.voiceUnsupported);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = mode === "sayIt" ? getSpeechLocale(nativeLanguage) : getSpeechLocale(learningLanguage);
    recognition.continuous = false;
    recognition.interimResults = true;
    voiceTranscriptRef.current = "";
    recognition.onstart = () => {
      setVoiceNotice(copy.releaseToSend);
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
          ? copy.micDenied
          : copy.voiceUnclear
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
    setVoiceNotice(copy.sending);
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
      setVoiceNotice(copy.sent);
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
      setApiNotice(copy.settingsError);
    }
  }

  async function handleLogout() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    void trackEvent("logout_clicked", { locale });

    let centralLogoutSucceeded = true;
    try {
      if (isRemoteSession) await api.auth.logout();
    } catch {
      centralLogoutSucceeded = false;
    }

    const supabase = createSupabaseBrowserClient();
    const signOutError = supabase ? (await supabase.auth.signOut()).error : null;
    const logoutSucceeded = !signOutError;

    void trackEvent(logoutSucceeded ? "logout_succeeded" : "logout_failed", {
      locale,
      central_sync: centralLogoutSucceeded ? "succeeded" : "failed",
      error_code: signOutError?.name || undefined
    });

    router.replace(localizedPath(locale, "/"));
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
      setApiNotice(copy.learningToolError);
    }
  }

  return (
    <main className="workbench-shell">
      <aside className="workbench-sidebar">
        <BrandMark href={localizedPath(locale, "/")} />
        <nav className="workbench-nav" aria-label={copy.nav.aria}>
          {navItems.map(({ key, icon: Icon }) => (
            <button
              className={activeNav === key ? "active" : ""}
              key={key}
              type="button"
              onClick={() => setActiveNav(key)}
            >
              <Icon size={21} aria-hidden="true" />
              <span>{copy.nav[key]}</span>
            </button>
          ))}
        </nav>
        <button className="workbench-account" type="button" onClick={() => void handleLogout()} disabled={isSigningOut} aria-label={copy.signOut}>
          <span className="account-avatar">A</span>
          <span>
            <strong>alex.tutor</strong>
            <small>{copy.accountPlan}</small>
          </span>
          {isSigningOut ? <span className="account-signout-status">{copy.signingOut}</span> : <LogOut size={17} aria-hidden="true" />}
        </button>
      </aside>

      <section className="workbench-main">
        <header className="workbench-topbar">
          <div>
            <span className="workbench-mobile-nav">{copy.nav[activeNav]}</span>
            <h1>{workspaceTitle}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <div className="workbench-top-actions">
            <button className="language-settings-button" type="button" onClick={() => setLanguageModalOpen(true)}>
              <Globe2 size={18} aria-hidden="true" />
              <span aria-label={copy.languageSettingsLabel}>
                {copy.languageNames[nativeLanguage] ?? nativeLanguage} → {copy.languageNames[learningLanguage] ?? learningLanguage}
              </span>
            </button>
            <Link className="upgrade-button" href={localizedPath(locale, "/pricing")}>
              <CreditCard size={18} aria-hidden="true" />
              {copy.upgradeCta}
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
              <strong>{copy.partnerGenderOrigin}</strong>
              <p>{copy.partnerDescription}</p>
            </div>
          </div>
          <div className="partner-actions">
            <button type="button" onClick={() => setPartnerOpen((open) => !open)}>
              <Settings2 size={17} aria-hidden="true" />
              {copy.customize}
            </button>
            <button type="button" onClick={() => setPartnerOpen(true)}>
              <Users size={17} aria-hidden="true" />
              {copy.changePartner}
            </button>
          </div>
        </section>

        {partnerOpen ? (
          <section className="partner-popover">
            <div>
              <span className="panel-label">{copy.partnerSettings}</span>
              <strong>{copy.partnerReady}</strong>
            </div>
            <button type="button" onClick={() => setPartnerOpen(false)} aria-label={copy.closePartner}>
              <X size={17} aria-hidden="true" />
            </button>
          </section>
        ) : null}

        <section className="workbench-mode-switcher" aria-label={copy.practiceMode}>
          <div>
            <span className="panel-label">{copy.practiceMode}</span>
            <strong>{mode === "sayIt" ? copy.sayItMode : copy.talkMode}</strong>
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
              {copy.sayItMode}
            </button>
            <button
              className={mode === "talk" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "talk"}
              onClick={() => switchMode("talk")}
            >
              <MessageCircleIcon />
              {copy.talkMode}
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
                  <span>{copy.tutorLabel}</span>
                </div>
              </div>
              <div className="conversation-stats">
                <Stat value="1" label={copy.stats[0]} />
                <Stat value={String(messages.length)} label={copy.stats[1]} />
                <Stat value="0" label={copy.stats[2]} />
                <Stat value="8" label={copy.stats[3]} />
              </div>
              <button className="new-conversation" type="button" onClick={startConversation} disabled={isApiBusy}>
                <RotateCcw size={17} aria-hidden="true" />
                {isApiBusy ? copy.startingConversation : copy.startConversation}
              </button>
            </div>

            <div className="conversation-body">
              <div className="today-label">{copy.today}</div>
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
                            {copy.listen}
                          </button>
                          <button type="button">
                            <Clock3 size={15} aria-hidden="true" />
                            {copy.slow}
                          </button>
                          <button type="button" onClick={() => setSelectedPhrase("")}>
                            <EyeOff size={15} aria-hidden="true" />
                            {copy.hide}
                          </button>
                          <button type="button" onClick={() => void requestMessageHelp(message, "translate")}>
                            <Languages size={15} aria-hidden="true" />
                            {copy.translation}
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
                  {copy.lost}
                </button>
                <button className="got-it" type="button">
                  <Brain size={16} aria-hidden="true" />
                  {copy.gotIt}
                </button>
                <button className="show-hints" type="button">
                  {copy.showHints}
                </button>
              </div>
              <div className="message-composer">
                {isListening ? (
                  <div className="voice-wave-overlay" aria-live="polite">
                    <span className="voice-wave-label">{copy.releaseToSend}</span>
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
                  placeholder={mode === "sayIt" ? copy.typeSayIt : copy.typeTalk}
                  aria-label={copy.messageLabel}
                />
                <button
                  className={isListening ? "voice-button listening" : "voice-button"}
                  type="button"
                  onPointerDown={startVoiceInput}
                  onPointerUp={stopVoiceInput}
                  onPointerCancel={stopVoiceInput}
                  onPointerLeave={stopVoiceInput}
                  aria-label={copy.holdToSpeak}
                  aria-pressed={isListening}
                  title={copy.holdToSpeak}
                >
                  {isListening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                </button>
                <button className="send-button" type="button" onClick={sendMessage} aria-label={copy.sendMessage} disabled={isApiBusy}>
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
                className={insightMode === "translate" ? "active" : ""}
                type="button"
                onClick={() => setInsightMode("translate")}
              >
                <Languages size={17} aria-hidden="true" />
                {copy.insightTranslate}
              </button>
              <button
                className={insightMode === "grammar" ? "active" : ""}
                type="button"
                onClick={() => setInsightMode("grammar")}
              >
                <Brain size={17} aria-hidden="true" />
                {copy.insightGrammar}
              </button>
            </div>
            <div className="insight-content">
              {selectedPhrase ? (
                <div className="selected-insight">
                  <span className="insight-icon">
                    {insightMode === "translate" ? <Languages size={22} /> : <Brain size={22} />}
                  </span>
                  <span className="panel-label">{insightMode === "translate" ? copy.insightTranslate : copy.insightGrammar}</span>
                  <h2>{selectedPhrase}</h2>
                  <p>
                    {insightMode === "translate" ? copy.selectedTranslateBody : copy.selectedGrammarBody}
                  </p>
                  <button type="button" onClick={() => selectedMessage && void requestMessageHelp(selectedMessage, "card")}>
                    <Plus size={17} aria-hidden="true" />
                    {copy.saveCard}
                  </button>
                </div>
              ) : (
                <div className="insight-empty">
                  <span className="insight-icon">
                    <Sparkles size={24} aria-hidden="true" />
                  </span>
                  <h2>{copy.insightEmptyTitle}</h2>
                  <p>{copy.insightEmptyBody}</p>
                </div>
              )}
            </div>
            <div className="insight-input">
              <textarea placeholder={copy.lookupPlaceholder} aria-label={copy.lookupLabel} />
              <div className="insight-actions">
                <button type="button">
                  <Volume2 size={16} aria-hidden="true" />
                  {copy.listen}
                </button>
                <button className="translate" type="button" onClick={() => setInsightMode("translate")}>
                  <Languages size={16} aria-hidden="true" />
                  {copy.insightTranslate}
                </button>
                <button className="grammar" type="button" onClick={() => setInsightMode("grammar")}>
                  <Brain size={16} aria-hidden="true" />
                  {copy.insightGrammar}
                </button>
              </div>
            </div>
          </aside>
        </section>

        <div className="workbench-footer-note">
          <PanelRight size={15} aria-hidden="true" />
          {copy.privateNote}
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
          copy={copy}
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
  onClose,
  copy
}: {
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  onNativeLanguageChange: (value: string) => void;
  onLearningLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
  copy: ProductCopy["workbench"];
}) {
  const languages = Object.keys(copy.languageNames);
  const levels = Object.keys(copy.levels);

  return (
    <div className="language-modal-backdrop" role="presentation">
      <section className="language-modal" role="dialog" aria-modal="true" aria-labelledby="language-modal-title">
        <button className="language-modal-close" type="button" onClick={onClose} aria-label={copy.modal.close}>
          <X size={18} aria-hidden="true" />
        </button>
        <span className="language-modal-icon">
          <Globe2 size={25} aria-hidden="true" />
        </span>
        <span className="panel-label">{copy.modal.eyebrow}</span>
        <h2 id="language-modal-title">{copy.modal.title}</h2>
        <p className="language-modal-lead">{copy.modal.lead}</p>

        <div className="language-form-grid">
          <label>
            <span>{copy.modal.native}</span>
            <select value={nativeLanguage} onChange={(event) => onNativeLanguageChange(event.target.value)}>
              {languages.map((language) => (
                <option key={language} value={language}>{copy.languageNames[language] ?? language}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{copy.modal.learning}</span>
            <select value={learningLanguage} onChange={(event) => onLearningLanguageChange(event.target.value)}>
              {languages.map((language) => (
                <option key={language} value={language}>{copy.languageNames[language] ?? language}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{copy.modal.level}</span>
            <select value={level} onChange={(event) => onLevelChange(event.target.value)}>
              {levels.map((item) => (
                <option key={item} value={item}>{copy.levels[item] ?? item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="language-modal-actions">
          <button className="language-modal-secondary" type="button" onClick={onClose}>
            {copy.modal.later}
          </button>
          <button className="language-modal-primary" type="button" onClick={onSave}>
            {copy.modal.start}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
