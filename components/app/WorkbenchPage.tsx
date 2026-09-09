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
  FileText,
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
import { analyticsEvents, paymentEventForStatus } from "@/lib/analytics/events";
import { ApiError, type JsonObject, type PronunciationFeedback, type TutorConversation, type TutorMessage, type TutorPartner, type WorkbenchData } from "@/lib/api/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { readingCopy } from "@/lib/i18n/reading-copy";
import type { LandingDictionary, ProductCopy } from "@/lib/i18n/types";
import { BrandMark } from "./BrandMark";
import { EnglishReadingPractice } from "@/components/site/EnglishReadingPractice";

type NavItem = "home" | "history" | "cards" | "reading";
type WorkbenchMode = "sayIt" | "talk";
type InsightMode = "translate" | "grammar";
type Message = {
  id: string;
  role: "tutor" | "user";
  text: string;
};

type InsightResult = {
  content?: string | { text?: string; note?: string; explanation?: string; suggestion?: string };
  audioUrl?: string | null;
  signedUrl?: string | null;
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
  { key: "reading", icon: FileText }
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
> & {
  signOut: string;
  signingOut: string;
  paymentPending: string;
  learnerName: string;
  savedCardFallback: string;
  noExplanation: string;
  demoMeaning: string;
  demoGrammar: string;
  fromLocation: string;
  femaleGender: string;
  maleGender: string;
  nonBinaryGender: string;
};

type WorkbenchCopy = ProductCopy["workbench"] & WorkbenchUiMessages;
type RepeatFeedbackState = {
  messageId: string;
  result: PronunciationFeedback;
};

const localizedRepeatMessages: Record<Locale, Pick<ProductCopy["workbench"], "repeat" | "repeatPrompt" | "repeatChecking" | "repeatPassed" | "repeatTryAgain" | "repeatCorrection" | "repeatFeedbackError" | "repeatUnsupported" | "repeatRequired">> = {
  en: {
    repeat: "Repeat",
    repeatPrompt: "Repeat the sentence aloud before continuing.",
    repeatChecking: "Checking your repetition…",
    repeatPassed: "Good repetition. You can continue.",
    repeatTryAgain: "Please repeat the sentence and try again.",
    repeatCorrection: "Practice this sentence:",
    repeatFeedbackError: "We could not check the repetition. Please try again.",
    repeatUnsupported: "Your browser cannot check repetition. Use Chrome or Edge and allow microphone access.",
    repeatRequired: "Please repeat the tutor's sentence before continuing."
  },
  ja: {
    repeat: "復唱",
    repeatPrompt: "続ける前に、この文を声に出して復唱してください。",
    repeatChecking: "復唱を確認しています…",
    repeatPassed: "よくできました。このまま続けられます。",
    repeatTryAgain: "文をもう一度復唱して、再試行してください。",
    repeatCorrection: "この文を練習してください：",
    repeatFeedbackError: "復唱を確認できませんでした。もう一度お試しください。",
    repeatUnsupported: "お使いのブラウザでは復唱を確認できません。ChromeまたはEdgeでマイクの使用を許可してください。",
    repeatRequired: "続ける前に、Tutorの文を復唱してください。"
  },
  th: {
    repeat: "พูดตาม",
    repeatPrompt: "พูดประโยคนี้ตามออกเสียงก่อนดำเนินการต่อ",
    repeatChecking: "กำลังตรวจสอบการพูดตาม…",
    repeatPassed: "พูดตามได้ดีมาก ไปต่อได้เลย",
    repeatTryAgain: "โปรดพูดตามประโยคอีกครั้งแล้วลองใหม่",
    repeatCorrection: "ฝึกพูดประโยคนี้:",
    repeatFeedbackError: "ตรวจสอบการพูดตามไม่ได้ โปรดลองอีกครั้ง",
    repeatUnsupported: "เบราว์เซอร์ของคุณไม่สามารถตรวจสอบการพูดตามได้ โปรดใช้ Chrome หรือ Edge และอนุญาตให้ใช้ไมโครโฟน",
    repeatRequired: "โปรดพูดตามประโยคของ Tutor ก่อนดำเนินการต่อ"
  },
  ko: {
    repeat: "따라 말하기",
    repeatPrompt: "계속하기 전에 이 문장을 소리 내어 따라 말해 보세요.",
    repeatChecking: "따라 말하기를 확인하는 중…",
    repeatPassed: "잘했어요. 계속 진행할 수 있어요.",
    repeatTryAgain: "문장을 다시 따라 말하고 시도해 주세요.",
    repeatCorrection: "이 문장을 연습해 보세요:",
    repeatFeedbackError: "따라 말하기를 확인하지 못했습니다. 다시 시도해 주세요.",
    repeatUnsupported: "현재 브라우저에서는 따라 말하기를 확인할 수 없습니다. Chrome 또는 Edge에서 마이크 사용을 허용해 주세요.",
    repeatRequired: "계속하기 전에 Tutor의 문장을 따라 말해 주세요."
  },
  "zh-CN": {
    repeat: "复读",
    repeatPrompt: "继续之前，请大声复读这句话。",
    repeatChecking: "正在检查复读…",
    repeatPassed: "复读完成，可以继续了。",
    repeatTryAgain: "请再复读一次，然后重试。",
    repeatCorrection: "请练习这句话：",
    repeatFeedbackError: "暂时无法检查复读，请再试一次。",
    repeatUnsupported: "当前浏览器无法检测复读，请使用 Chrome 或 Edge 并允许麦克风权限。",
    repeatRequired: "请先复读导师说的句子，然后再继续。"
  },
  "zh-TW": {
    repeat: "複誦",
    repeatPrompt: "繼續之前，請大聲複誦這句話。",
    repeatChecking: "正在檢查複誦…",
    repeatPassed: "複誦完成，可以繼續了。",
    repeatTryAgain: "請再複誦一次，然後重試。",
    repeatCorrection: "請練習這句話：",
    repeatFeedbackError: "暫時無法檢查複誦，請再試一次。",
    repeatUnsupported: "目前瀏覽器無法檢查複誦，請使用 Chrome 或 Edge 並允許麥克風權限。",
    repeatRequired: "請先複誦 Tutor 的句子，再繼續。"
  },
  es: {
    repeat: "Repetir",
    repeatPrompt: "Repite esta frase en voz alta antes de continuar.",
    repeatChecking: "Comprobando tu repetición…",
    repeatPassed: "Buena repetición. Puedes continuar.",
    repeatTryAgain: "Repite la frase e inténtalo de nuevo.",
    repeatCorrection: "Practica esta frase:",
    repeatFeedbackError: "No se pudo comprobar la repetición. Vuelve a intentarlo.",
    repeatUnsupported: "Tu navegador no puede comprobar la repetición. Usa Chrome o Edge y permite el acceso al micrófono.",
    repeatRequired: "Repite la frase del tutor antes de continuar."
  }
};

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
    paymentPending: "Payment is still being confirmed. Your access will update after confirmation.",
    learnerName: "Learner",
    savedCardFallback: "Saved learning card",
    noExplanation: "No additional explanation was returned.",
    demoMeaning: "A clear meaning for “{phrase}” will appear here.",
    demoGrammar: "This phrase is clear and ready to practice in context.",
    fromLocation: "From {location}",
    femaleGender: "Female",
    maleGender: "Male",
    nonBinaryGender: "Non-binary",
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
    paymentPending: "お支払いを確認中です。確認後にアクセス権が更新されます。",
    learnerName: "学習者",
    savedCardFallback: "保存した学習カード",
    noExplanation: "追加の説明はありません。",
    demoMeaning: "「{phrase}」の分かりやすい意味がここに表示されます。",
    demoGrammar: "このフレーズは自然で、会話の中ですぐに練習できます。",
    fromLocation: "{location}出身",
    femaleGender: "女性",
    maleGender: "男性",
    nonBinaryGender: "ノンバイナリー",
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
    paymentPending: "กำลังยืนยันการชำระเงิน ระบบจะอัปเดตสิทธิ์หลังยืนยันสำเร็จ",
    learnerName: "ผู้เรียน",
    savedCardFallback: "การ์ดการเรียนรู้ที่บันทึกไว้",
    noExplanation: "ไม่มีคำอธิบายเพิ่มเติม",
    demoMeaning: "คำอธิบายความหมายของ “{phrase}” จะแสดงที่นี่",
    demoGrammar: "วลีนี้ชัดเจนและพร้อมนำไปฝึกใช้ในบริบทจริง",
    fromLocation: "จาก {location}",
    femaleGender: "ผู้หญิง",
    maleGender: "ผู้ชาย",
    nonBinaryGender: "นอนไบนารี",
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
    paymentPending: "결제를 확인하고 있습니다. 확인이 끝나면 이용 권한이 업데이트됩니다.",
    learnerName: "학습자",
    savedCardFallback: "저장한 학습 카드",
    noExplanation: "추가 설명이 제공되지 않았습니다.",
    demoMeaning: "“{phrase}”의 명확한 뜻이 여기에 표시됩니다.",
    demoGrammar: "이 표현은 자연스러우며 문맥 속에서 바로 연습할 수 있습니다.",
    fromLocation: "{location} 출신",
    femaleGender: "여성",
    maleGender: "남성",
    nonBinaryGender: "논바이너리",
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
    paymentPending: "支付仍在确认中，确认完成后会自动更新使用权限。",
    learnerName: "学习者",
    savedCardFallback: "已保存的学习卡片",
    noExplanation: "没有返回更多解释。",
    demoMeaning: "这里会显示“{phrase}”的清晰含义。",
    demoGrammar: "这个短语表达清楚，可以放到具体语境中练习。",
    fromLocation: "来自{location}",
    femaleGender: "女性",
    maleGender: "男性",
    nonBinaryGender: "非二元性别",
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
    paymentPending: "付款仍在確認中，確認完成後會自動更新使用權限。",
    learnerName: "學習者",
    savedCardFallback: "已儲存的學習卡片",
    noExplanation: "沒有傳回更多解釋。",
    demoMeaning: "這裡會顯示「{phrase}」的清楚含義。",
    demoGrammar: "這個片語表達清楚，可以放到具體語境中練習。",
    fromLocation: "來自{location}",
    femaleGender: "女性",
    maleGender: "男性",
    nonBinaryGender: "非二元性別",
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
    paymentPending: "El pago aún se está confirmando. El acceso se actualizará después de la confirmación.",
    learnerName: "Estudiante",
    savedCardFallback: "Tarjeta de aprendizaje guardada",
    noExplanation: "No se recibió ninguna explicación adicional.",
    demoMeaning: "Aquí aparecerá una explicación clara de “{phrase}”.",
    demoGrammar: "Esta frase es clara y está lista para practicarla en contexto.",
    fromLocation: "De {location}",
    femaleGender: "Mujer",
    maleGender: "Hombre",
    nonBinaryGender: "No binario",
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

const languagePromptSeenStorageKey = "ai-tutor-language-prompt-seen";

function languagePromptScope(workbench?: WorkbenchData) {
  const profile = workbench?.profile;
  if (profile && typeof profile === "object") {
    const id = (profile as JsonObject).id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return "anonymous";
}

function hasSeenLanguagePrompt(scope: string) {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(`${languagePromptSeenStorageKey}:${scope}`) === "1";
  } catch {
    return false;
  }
}

function markLanguagePromptSeen(scope: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${languagePromptSeenStorageKey}:${scope}`, "1");
  } catch {
    // A blocked localStorage must not prevent the workbench from opening.
  }
}

function isLanguageSetupComplete(workbench: WorkbenchData) {
  const settings = workbench.settings as (JsonObject | undefined);
  const profile = workbench.profile && typeof workbench.profile === "object" ? workbench.profile as JsonObject : undefined;
  return settings?.onboardingCompleted === true
    || Boolean(settings?.onboardingCompletedAt)
    || profile?.onboardingCompleted === true
    || profile?.onboarding_completed === true;
}

function normalizeSpeech(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function isRepeatCloseEnough(spoken: string, target: string) {
  const spokenWords = normalizeSpeech(spoken).split(/\s+/).filter(Boolean);
  const targetWords = normalizeSpeech(target).split(/\s+/).filter(Boolean);
  if (!spokenWords.length || !targetWords.length) return false;
  const matched = targetWords.filter((word) => spokenWords.includes(word)).length;
  return matched / targetWords.length >= (targetWords.length <= 5 ? 0.6 : 0.72);
}

export function WorkbenchPage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const router = useRouter();
  const copy = useMemo(
    () => ({ ...dictionary.product.workbench, ...localizedWorkbenchMessages[locale], ...localizedRepeatMessages[locale] }),
    [dictionary.product.workbench, locale]
  );
  const [activeNav, setActiveNav] = useState<NavItem>("home");
  const [mode, setMode] = useState<WorkbenchMode>("sayIt");
  const [insightMode, setInsightMode] = useState<InsightMode>("translate");
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState("Chinese");
  const [learningLanguage, setLearningLanguage] = useState("English");
  const [level, setLevel] = useState("Auto-detect");
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [isRepeatListening, setIsRepeatListening] = useState(false);
  const [isRepeatChecking, setIsRepeatChecking] = useState(false);
  const [hasRepeatedLatestTutor, setHasRepeatedLatestTutor] = useState(false);
  const [repeatFeedback, setRepeatFeedback] = useState<RepeatFeedbackState | null>(null);
  const [apiNotice, setApiNotice] = useState("");
  const [isRemoteSession, setIsRemoteSession] = useState(false);
  const [isRemoteUnavailable, setIsRemoteUnavailable] = useState(false);
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
  const voiceFinishingRef = useRef(false);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const repeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      repeatRecognitionRef.current?.stop();
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);
      if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [insightText, setInsightText] = useState("");
  const [isInsightBusy, setIsInsightBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [profile, setProfile] = useState<JsonObject | null>(null);
  const [entitlement, setEntitlement] = useState<JsonObject | null>(null);
  const [partner, setPartner] = useState<TutorPartner | null>(null);
  const [recentConversations, setRecentConversations] = useState<TutorConversation[]>([]);
  const [cards, setCards] = useState<JsonObject[]>([]);
  const [todayMessageCount, setTodayMessageCount] = useState(0);
  const voiceStartedAtRef = useRef<number | null>(null);
  const voiceCancelledRef = useRef(false);

  useEffect(() => {
    if (isSupabaseConfigured() || hasSeenLanguagePrompt("anonymous")) return;
    markLanguagePromptSeen("anonymous");
    setLanguageModalOpen(true);
  }, []);

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
      try {
        await api.auth.sync();
        const workbench = await api.workbench.get();
        if (!active) return;
        setIsRemoteSession(true);
        setIsRemoteUnavailable(false);
        applyWorkbenchData(workbench);
        const paymentParams = new URLSearchParams(window.location.search);
        const orderId = paymentParams.get("orderId");
        if (paymentParams.get("payment") === "success" && orderId) {
          let confirmed = false;
          try {
            for (let attempt = 0; attempt < 15 && active; attempt += 1) {
              const order = await api.billing.order(orderId);
              if (order.status === "paid") {
                confirmed = true;
                const billing = await api.billing.me();
                if (active) setEntitlement(billing.entitlement as unknown as JsonObject);
                await trackEventOnce(`payment_succeeded:${orderId}`, "payment_succeeded", {
                  locale,
                  order_id: orderId,
                  plan_code: order.planCode
                });
                break;
              }
              await wait(2000);
            }
          } catch {
            // The conversation workspace remains usable while billing catches up.
          }
          if (active && !confirmed) setApiNotice(copy.paymentPending);
        }
      } catch (error) {
        if (error instanceof ApiError && error.code === "UNAUTHENTICATED") {
          await supabase.auth.signOut();
          router.replace(localizedPath(locale, "/login"));
          return;
        }
        if (active) {
          setIsRemoteUnavailable(true);
          setApiNotice(copy.remoteUnavailable);
        }
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
    if (activeNav === "reading") return copy.nav.reading;
    return copy.title;
  }, [activeNav, copy]);
  const workspaceSubtitle = activeNav === "reading" ? readingCopy[locale].workspace.lead : copy.subtitle;
  const selectedMessage = messages.find((message) => message.role === "tutor" && message.text === selectedPhrase);
  const latestTutorMessage = [...messages].reverse().find((message) => message.role === "tutor");
  const canContinueConversation = !latestTutorMessage || hasRepeatedLatestTutor;

  function applyWorkbenchData(workbench: WorkbenchData) {
    setProfile(workbench.profile || null);
    setEntitlement(workbench.entitlement || null);
    setPartner(asTutorPartner(workbench.partner));
    setCards(workbench.cards || []);
    setRecentConversations(workbench.recentConversations || []);
    setTodayMessageCount(numberValue(workbench.todayMessageCount));
    const setupComplete = isLanguageSetupComplete(workbench);
    const promptScope = languagePromptScope(workbench);
    if (setupComplete) {
      setLanguageModalOpen(false);
    } else if (!hasSeenLanguagePrompt(promptScope)) {
      markLanguagePromptSeen(promptScope);
      setLanguageModalOpen(true);
    }
    const settings = workbench.settings;
    if (settings?.nativeLanguageCode) setNativeLanguage(languageName(settings.nativeLanguageCode));
    if (settings?.learningLanguageCode) setLearningLanguage(languageName(settings.learningLanguageCode));
    if (settings?.levelCode) setLevel(levelName(settings.levelCode));

    const conversation = workbench.currentConversation || workbench.conversation || workbench.recentConversations?.[0];
    if (conversation?.id) {
      setConversationId(conversation.id);
      const remoteMessages = getConversationMessages(conversation);
      if (remoteMessages.length > 0) setMessages(remoteMessages);
      setHasRepeatedLatestTutor(false);
      setRepeatFeedback(null);
    }
  }

  async function selectNav(nextNav: NavItem) {
    setActiveNav(nextNav);
    if (!isRemoteSession) return;

    try {
      if (nextNav === "cards") {
        const result = await api.cards.list();
        setCards(jsonArray(result, "cards"));
      }
      if (nextNav === "history") {
        const result = await api.conversations.list("limit=20");
        setRecentConversations(Array.isArray(result.items) ? result.items : jsonArray(result, "conversations") as unknown as TutorConversation[]);
      }
    } catch (error) {
      setApiNotice(apiErrorMessage(error, copy.learningToolError));
    }
  }

  function resetDemoConversation(nextMode = mode) {
    setHasRepeatedLatestTutor(false);
    setRepeatFeedback(null);
    setMessages([
      {
        id: `demo-${Date.now()}`,
        role: "tutor",
        text: nextMode === "sayIt" ? "What would you like to say in English?" : "What would you like to talk about today?"
      }
    ]);
    setSelectedPhrase("");
    setInsightText("");
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
    } catch (error) {
      setApiNotice(apiErrorMessage(error, copy.newConversationError));
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
    if (!trimmed && !(inputType === "voice" && audioBlob)) return;
    if (!canContinueConversation) {
      setVoiceNotice(copy.repeatRequired);
      return;
    }
    const clientMessageId = crypto.randomUUID();
    if (trimmed) {
      const userMessage: Message = { id: clientMessageId, role: "user", text: trimmed };
      setMessages((current) => [...current, userMessage]);
    }
    setInput("");
    setApiNotice("");

    if (!isRemoteSession) {
      if (isRemoteUnavailable) {
        setApiNotice(copy.remoteUnavailable);
        return;
      }
      if (!trimmed) {
        setVoiceNotice(copy.voiceUnclear);
        return;
      }
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
      setHasRepeatedLatestTutor(false);
      setRepeatFeedback(null);
      return;
    }

    setIsApiBusy(true);
    try {
      const currentConversationId = await getOrCreateConversation();
      const sourceLanguageCode = mode === "talk" ? languageCode(learningLanguage) : languageCode(nativeLanguage);
      if (inputType === "voice") {
        let audioId: string | undefined;
        let transcript = trimmed;

        if (audioBlob && audioBlob.size <= 10 * 1024 * 1024) {
          const mimeType = (audioBlob.type || "audio/webm").split(";", 1)[0];
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
              durationMs: Math.min(600000, Math.max(1, Date.now() - (voiceStartedAtRef.current || Date.now()))),
              languageCode: sourceLanguageCode
            });
            audioId = stringValue(voiceInput.id) || stringValue(voiceInput.audioId);
            if (audioId) {
              let transcription = await api.voice.transcribe(audioId);
              for (let attempt = 0; ["pending", "processing"].includes(transcription.status) && attempt < 8; attempt += 1) {
                await wait(1000);
                transcription = await api.voice.get(audioId);
              }
              if (transcription.status === "failed") throw new Error(transcription.error || "Voice transcription failed.");
              if (transcription.status !== "succeeded" || !transcription.transcript?.trim()) throw new Error("Voice transcription is still processing.");
              transcript = transcription.transcript.trim();
            }
          }
        }

        if (!transcript) throw new Error("Voice transcription did not return text.");
        if (!trimmed) {
          setMessages((current) => [...current, { id: clientMessageId, role: "user", text: transcript }]);
        }

        const messageBody = {
          clientMessageId,
          transcript,
          ...(audioId ? { audioId } : {}),
          sourceLanguageCode
        };
        let result = await api.conversations.sendVoiceMessage(currentConversationId, messageBody);
        for (let attempt = 0; result.processing && attempt < 4; attempt += 1) {
          await wait(1500);
          result = await api.conversations.sendVoiceMessage(currentConversationId, messageBody);
        }
        if (result.processing) setApiNotice(copy.providerError);
      } else {
        const messageBody = {
          clientMessageId,
          content: trimmed,
          inputType,
          sourceLanguageCode
        };
        let result = await api.conversations.sendMessage(currentConversationId, messageBody);
        for (let attempt = 0; result.processing && attempt < 4; attempt += 1) {
          await wait(1500);
          result = await api.conversations.sendMessage(currentConversationId, messageBody);
        }
        if (result.processing) setApiNotice(copy.providerError);
      }
      const conversation = await api.conversations.get(currentConversationId);
      const remoteMessages = getConversationMessages(conversation);
      if (remoteMessages.length > 0) {
        setMessages(remoteMessages);
        if (remoteMessages.some((message) => message.role === "tutor")) setHasRepeatedLatestTutor(false);
        if (remoteMessages.some((message) => message.role === "tutor")) setRepeatFeedback(null);
      }
      await trackEvent(inputType === "voice" ? "voice_transcribed" : "message_submitted", { mode });
    } catch (error) {
      const message = error instanceof ApiError && error.code === "AI_PROVIDER_ERROR"
        ? copy.providerError
        : apiErrorMessage(error, copy.messageError);
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
    if (!canContinueConversation) {
      setVoiceNotice(copy.repeatRequired);
      return;
    }

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const canRecord = "mediaDevices" in navigator && typeof MediaRecorder !== "undefined";
    if (!Recognition && !canRecord) {
      setVoiceNotice(copy.voiceUnsupported);
      return;
    }

    voiceCancelledRef.current = false;
    voiceFinishingRef.current = false;
    voiceStartedAtRef.current = Date.now();
    voiceTranscriptRef.current = "";
    setVoiceNotice(copy.releaseToSend);
    setIsListening(true);
    void trackEvent("voice_recording_started", { mode });
    audioCapturePromiseRef.current = canRecord ? startAudioCapture() : Promise.resolve();
    voiceTimeoutRef.current = setTimeout(() => {
      setVoiceNotice(copy.sending);
      if (recognitionRef.current) recognitionRef.current.stop();
      else void finishVoiceInput();
    }, 600000);

    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = mode === "sayIt" ? getSpeechLocale(nativeLanguage) : getSpeechLocale(learningLanguage);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = null;
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index][0].transcript)
        .join(" ")
        .trim();
      voiceTranscriptRef.current = transcript;
      setInput(transcript);
    };
    recognition.onerror = (event) => {
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
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
    }
  }

  function stopVoiceInput() {
    if (!isListening) return;
    setVoiceNotice(copy.sending);
    if (recognitionRef.current) recognitionRef.current.stop();
    else void finishVoiceInput();
  }

  function cancelVoiceInput() {
    voiceCancelledRef.current = true;
    setVoiceNotice("");
    if (recognitionRef.current) recognitionRef.current.stop();
    else void finishVoiceInput();
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
    if (voiceFinishingRef.current) return;
    voiceFinishingRef.current = true;
    setIsListening(false);
    recognitionRef.current = null;
    if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
    voiceTimeoutRef.current = null;
    const transcript = voiceTranscriptRef.current.trim();
    voiceTranscriptRef.current = "";
    const audioBlob = await finishAudioCapture();
    const cancelled = voiceCancelledRef.current;
    voiceCancelledRef.current = false;

    try {
      if ((transcript || audioBlob) && !cancelled) {
        await sendMessageText(transcript, "voice", audioBlob);
        setVoiceNotice(copy.sent);
      } else if (!cancelled) {
        setVoiceNotice(copy.voiceUnclear);
      }
    } finally {
      voiceFinishingRef.current = false;
      voiceStartedAtRef.current = null;
    }
  }

  async function saveLanguageSettings() {
    if (!isRemoteSession) {
      markLanguagePromptSeen("anonymous");
      setLanguageModalOpen(false);
      return;
    }

    try {
      await api.me.updateSettings({
        nativeLanguageCode: languageCode(nativeLanguage),
        learningLanguageCode: languageCode(learningLanguage),
        levelCode: levelCode(level)
      });
      markLanguagePromptSeen(languagePromptScope({ profile: profile || undefined }));
      setLanguageModalOpen(false);
      setApiNotice("");
    } catch (error) {
      setApiNotice(apiErrorMessage(error, copy.settingsError));
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

  function speakText(text: string, rate = 0.9) {
    const phrase = text.trim();
    if (!phrase || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = getSpeechLocale(learningLanguage);
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }

  async function submitRepeatFeedback(message: Message, spokenText: string) {
    setIsRepeatChecking(true);
    setHasRepeatedLatestTutor(false);
    setVoiceNotice(copy.repeatChecking);
    try {
      const result = (!isRemoteSession
        ? {
            messageId: null,
            outputType: "pronunciation" as const,
            provider: "fallback",
            model: "demo-local",
            content: {
              text: isRepeatCloseEnough(spokenText, message.text)
                ? "Good repetition. Your sentence is clear."
                : "Try again and focus on saying every word clearly.",
              passed: isRepeatCloseEnough(spokenText, message.text),
              score: isRepeatCloseEnough(spokenText, message.text) ? 1 : 0,
              correctedText: message.text,
              targetText: message.text,
              spokenText
            }
          }
        : !message.id.startsWith("demo-")
        ? await api.messages.pronunciation(message.id, {
            spokenText,
            targetLanguageCode: languageCode(learningLanguage),
            nativeLanguageCode: languageCode(nativeLanguage)
          })
        : await api.messages.pronunciationText({
            targetText: message.text,
            spokenText,
            targetLanguageCode: languageCode(learningLanguage),
            nativeLanguageCode: languageCode(nativeLanguage)
          })) as PronunciationFeedback;
      setRepeatFeedback({ messageId: message.id, result });
      const passed = Boolean(result.content?.passed);
      setHasRepeatedLatestTutor(passed);
      setVoiceNotice(passed ? copy.repeatPassed : copy.repeatTryAgain);
      void trackEvent(passed ? analyticsEvents.pronunciationFeedbackPassed : analyticsEvents.pronunciationFeedbackFailed, {
        mode,
        messageId: message.id,
        score: result.content?.score ?? 0
      });
    } catch (error) {
      setRepeatFeedback(null);
      setHasRepeatedLatestTutor(false);
      setVoiceNotice(copy.repeatFeedbackError);
      setApiNotice(apiErrorMessage(error, copy.learningToolError));
    } finally {
      setIsRepeatChecking(false);
    }
  }

  function repeatTutorMessage(message: Message) {
    if (message.id !== latestTutorMessage?.id || isRepeatListening || isRepeatChecking) return;

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceNotice(copy.repeatUnsupported);
      return;
    }

    repeatRecognitionRef.current?.stop();
    if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);

    const recognition = new Recognition();
    let transcript = "";
    let finished = false;
    const finish = (spokenText: string) => {
      if (finished) return;
      finished = true;
      if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);
      repeatTimeoutRef.current = null;
      repeatRecognitionRef.current = null;
      setIsRepeatListening(false);
      if (!spokenText.trim()) {
        setHasRepeatedLatestTutor(false);
        setVoiceNotice(copy.repeatRequired);
        return;
      }
      void submitRepeatFeedback(message, spokenText.trim());
    };

    recognition.lang = getSpeechLocale(learningLanguage);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index][0].transcript)
        .join(" ")
        .trim();
      if (Array.from({ length: event.results.length }, (_, index) => event.results[index].isFinal).some(Boolean)) {
        finish(transcript);
      }
    };
    recognition.onerror = () => finish(transcript);
    recognition.onend = () => finish(transcript);
    repeatRecognitionRef.current = recognition;
    setRepeatFeedback(null);
    setHasRepeatedLatestTutor(false);
    setIsRepeatListening(true);
    setVoiceNotice(copy.repeatPrompt);
    repeatTimeoutRef.current = setTimeout(() => finish(transcript), 12000);

    try {
      recognition.start();
    } catch {
      finish(transcript);
    }
  }

  async function runInsight(kind: "translate" | "grammar", message?: Message) {
    const targetMessage = message || selectedMessage;
    const phrase = (message?.text || selectedPhrase).trim();
    if (!phrase) return;

    setInsightMode(kind);
    setIsInsightBusy(true);
    setInsightText("");
    try {
      const result = targetMessage
        ? (targetMessage.id.startsWith("demo-")
          ? (kind === "translate"
            ? await api.messages.translateText({ text: phrase, sourceLanguageCode: languageCode(learningLanguage), targetLanguageCode: languageCode(nativeLanguage) })
            : await api.messages.grammarText({ text: phrase, sourceLanguageCode: languageCode(learningLanguage), targetLanguageCode: languageCode(nativeLanguage) }))
          : kind === "translate"
          ? await api.messages.translate(targetMessage.id, {
              targetLanguageCode: languageCode(nativeLanguage),
              nativeLanguageCode: languageCode(learningLanguage)
            })
          : await api.messages.grammar(targetMessage.id)) as InsightResult
        : (kind === "translate"
          ? await api.messages.translateText({ text: phrase, sourceLanguageCode: languageCode(learningLanguage), targetLanguageCode: languageCode(nativeLanguage) })
          : await api.messages.grammarText({ text: phrase, sourceLanguageCode: languageCode(learningLanguage), targetLanguageCode: languageCode(nativeLanguage) })) as InsightResult;
      setInsightText(insightContent(result.content, copy.noExplanation));
    } catch (error) {
      if (kind === "translate" && (!isRemoteSession || targetMessage?.id.startsWith("demo-"))) {
        setInsightText(copy.demoMeaning.replace("{phrase}", phrase));
      }
      setApiNotice(apiErrorMessage(error, copy.learningToolError));
    } finally {
      setIsInsightBusy(false);
    }
  }

  async function requestMessageHelp(message: Message, kind: "translate" | "grammar" | "audio" | "card") {
    setSelectedPhrase(message.text);
    setInsightText("");
    if (kind === "audio") {
      if (!isRemoteSession || message.id.startsWith("demo-")) {
        speakText(message.text);
        return;
      }
      try {
        const result = await api.messages.audio(message.id) as InsightResult;
        const audioUrl = result.signedUrl || result.audioUrl;
        if (audioUrl) {
          await new Audio(audioUrl).play();
        } else {
          speakText(message.text);
        }
      } catch (error) {
        speakText(message.text);
        setApiNotice(apiErrorMessage(error, copy.learningToolError));
      }
      return;
    }
    if (kind === "translate" || kind === "grammar") {
      await runInsight(kind, message);
      return;
    }
    if (!isRemoteSession || message.id.startsWith("demo-")) return;

    try {
      if (kind === "card") {
        await api.messages.saveCard(message.id, {
          phrase: message.text,
          languageCode: languageCode(learningLanguage),
          cardType: "phrase"
        });
        await trackEvent("learning_card_saved", { messageId: message.id });
      }
    } catch (error) {
      setApiNotice(apiErrorMessage(error, copy.learningToolError));
    }
  }

  return (
    <main className="workbench-shell">
      <aside className="workbench-sidebar">
        <BrandMark href={localizedPath(locale, "/")} locale={locale} />
        <nav className="workbench-nav" aria-label={copy.nav.aria}>
          {navItems.map(({ key, icon: Icon }) => (
            <button
              className={activeNav === key ? "active" : ""}
              key={key}
              type="button"
              onClick={() => void selectNav(key)}
            >
              <Icon size={21} aria-hidden="true" />
              <span>{copy.nav[key]}</span>
            </button>
          ))}
        </nav>
        <button className="workbench-account" type="button" onClick={() => void handleLogout()} disabled={isSigningOut} aria-label={copy.signOut}>
            <span className="account-avatar">{profileName(profile, copy.learnerName).slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{profileName(profile, copy.learnerName)}</strong>
              <small>{planName(entitlement, copy.accountPlan)}</small>
          </span>
          {isSigningOut ? <span className="account-signout-status">{copy.signingOut}</span> : <LogOut size={17} aria-hidden="true" />}
        </button>
      </aside>

      <section className="workbench-main">
        <header className="workbench-topbar">
          <div>
            <span className="workbench-mobile-nav">{copy.nav[activeNav]}</span>
            <h1>{workspaceTitle}</h1>
            <p>{workspaceSubtitle}</p>
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

        {activeNav === "home" ? <>
        <section className="partner-banner">
          <div className="partner-identity">
            <div className="partner-avatar">
              <span>✦</span>
            </div>
            <div>
               <h2>{partner?.name || "Clara Ruiz"}</h2>
               <strong>{partner ? partnerMeta(partner, copy) : copy.partnerGenderOrigin}</strong>
               <p>{localizedPartnerDescription(partner?.description, copy.partnerDescription)}</p>
            </div>
          </div>
          <div className="partner-actions">
            <button type="button" onClick={() => setPartnerOpen((open) => !open)}>
              <Settings2 size={17} aria-hidden="true" />
              {copy.customize}
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
                   <strong>{partner?.name || "Clara Ruiz"}</strong>
                  <span>{copy.tutorLabel}</span>
                </div>
              </div>
              <div className="conversation-stats">
                 <Stat value={String(usageNumber(entitlement, ["minutesUsed", "minutes_used"]))} label={copy.stats[0]} />
                 <Stat value={String(todayMessageCount || messages.filter((message) => message.role === "user").length)} label={copy.stats[1]} />
                 <Stat value={String(messages.filter((message) => message.role === "user").length)} label={copy.stats[2]} />
                 <Stat value={String(messages.filter((message) => message.role === "user").reduce((total, message) => total + message.text.split(/\s+/).filter(Boolean).length, 0))} label={copy.stats[3]} />
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
                          onClick={() => { setSelectedPhrase(message.text); setInsightText(""); }}
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
                          <button type="button" onClick={() => repeatTutorMessage(message)} disabled={isRepeatListening || isRepeatChecking || message.id !== latestTutorMessage?.id}>
                            <Mic size={15} aria-hidden="true" />
                            {isRepeatListening && message.id === latestTutorMessage?.id ? copy.sending : isRepeatChecking && message.id === latestTutorMessage?.id ? copy.repeatChecking : copy.repeat}
                          </button>
                          <button type="button" onClick={() => void speakText(message.text, 0.65)}>
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
                          {repeatFeedback?.messageId === message.id ? (
                            <div className={`repeat-feedback ${repeatFeedback.result.content.passed ? "passed" : "needs-retry"}`} role="status">
                              <strong>{repeatFeedback.result.content.passed ? copy.repeatPassed : copy.repeatTryAgain}</strong>
                              <span>{repeatFeedback.result.content.text}</span>
                              <span>{copy.repeatCorrection} {repeatFeedback.result.content.correctedText}</span>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="conversation-footer">
              <div className="conversation-shortcuts">
                 <button className="lost" type="button" onClick={() => setInput("Could you say that more slowly?")}>
                  <AlertCircle size={16} aria-hidden="true" />
                  {copy.lost}
                </button>
                 <button className="got-it" type="button" onClick={() => setInput("I got it. Let me try.")}>
                  <Brain size={16} aria-hidden="true" />
                  {copy.gotIt}
                </button>
                 <button className="show-hints" type="button" onClick={() => { const tutorMessage = [...messages].reverse().find((message) => message.role === "tutor"); if (tutorMessage) void runInsight("grammar", tutorMessage); }}>
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
                  disabled={!canContinueConversation || isApiBusy || isRepeatListening || isRepeatChecking}
                />
                <button
                  className={isListening ? "voice-button listening" : "voice-button"}
                  type="button"
                   onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); startVoiceInput(); }}
                   onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); stopVoiceInput(); }}
                   onPointerCancel={cancelVoiceInput}
                   onPointerLeave={cancelVoiceInput}
                  aria-label={copy.holdToSpeak}
                  aria-pressed={isListening}
                  title={copy.holdToSpeak}
                  disabled={!canContinueConversation || isApiBusy || isRepeatListening || isRepeatChecking}
                >
                  {isListening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                </button>
                <button className="send-button" type="button" onClick={sendMessage} aria-label={copy.sendMessage} disabled={!canContinueConversation || isApiBusy || isRepeatListening || isRepeatChecking}>
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
                  <p>{insightText || (insightMode === "translate" ? copy.selectedTranslateBody : copy.selectedGrammarBody)}</p>
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
              <textarea
                value={selectedPhrase}
                onChange={(event) => setSelectedPhrase(event.target.value)}
                placeholder={copy.lookupPlaceholder}
                aria-label={copy.lookupLabel}
              />
              <div className="insight-actions">
                <button type="button" onClick={() => void speakText(selectedPhrase)} disabled={!selectedPhrase.trim()}>
                  <Volume2 size={16} aria-hidden="true" />
                  {copy.listen}
                </button>
                <button className="translate" type="button" onClick={() => void runInsight("translate")} disabled={!selectedPhrase.trim() || isInsightBusy}>
                  <Languages size={16} aria-hidden="true" />
                  {copy.insightTranslate}
                </button>
                <button className="grammar" type="button" onClick={() => void runInsight("grammar")} disabled={!selectedPhrase.trim() || isInsightBusy}>
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
        </> : activeNav === "reading" ? (
          <EnglishReadingPractice locale={locale} embedded />
        ) : <WorkbenchNavView activeNav={activeNav} copy={copy} locale={locale} conversations={recentConversations} cards={cards} />}
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

function jsonArray(value: unknown, key: string) {
  if (Array.isArray(value)) return value as JsonObject[];
  if (value && typeof value === "object" && key in value) {
    const nested = (value as JsonObject)[key];
    return Array.isArray(nested) ? nested as JsonObject[] : [];
  }
  return [];
}

function asTutorPartner(value: unknown): TutorPartner | null {
  if (!value || typeof value !== "object") return null;
  const item = value as JsonObject;
  const id = stringValue(item.id);
  const name = stringValue(item.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    gender: stringValue(item.gender),
    location: stringValue(item.location),
    description: stringValue(item.description),
    avatarUrl: stringValue(item.avatarUrl) || stringValue(item.avatar_url)
  };
}

function profileName(profile: JsonObject | null, fallback: string) {
  return stringValue(profile?.displayName) || stringValue(profile?.display_name) || stringValue(profile?.name) || stringValue(profile?.email) || fallback;
}

function planName(entitlement: JsonObject | null, fallback: string) {
  const name = stringValue(entitlement?.planName) || stringValue(entitlement?.plan_name) || stringValue(entitlement?.plan);
  return !name || name.toLowerCase() === "free" ? fallback : name;
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function usageNumber(value: JsonObject | null, keys: string[]) {
  for (const key of keys) {
    const number = numberValue(value?.[key]);
    if (number > 0) return number;
  }
  return 0;
}

function partnerMeta(partner: TutorPartner, copy: WorkbenchCopy) {
  const genderLabels: Record<string, string> = {
    female: copy.femaleGender,
    woman: copy.femaleGender,
    male: copy.maleGender,
    man: copy.maleGender,
    "non-binary": copy.nonBinaryGender,
    nonbinary: copy.nonBinaryGender
  };
  const gender = partner.gender ? genderLabels[partner.gender.toLowerCase()] || partner.gender : undefined;
  const location = partner.location ? copy.fromLocation.replace("{location}", partner.location) : undefined;
  const details = [gender, location].filter(Boolean);
  return details.length > 0 ? details.join(" · ") : copy.partnerGenderOrigin;
}

function localizedPartnerDescription(description: string | undefined, fallback: string) {
  return !description || description.toLowerCase() === "calm, observant, gently witty" ? fallback : description;
}

function cardText(card: JsonObject, fallback: string) {
  return stringValue(card.phrase) || stringValue(card.content) || stringValue(card.text) || stringValue(card.front) || fallback;
}

function WorkbenchNavView({
  activeNav,
  copy,
  locale,
  conversations,
  cards
}: {
  activeNav: NavItem;
  copy: WorkbenchCopy;
  locale: Locale;
  conversations: TutorConversation[];
  cards: JsonObject[];
}) {
  if (activeNav === "history") {
    return (
      <section className="workbench-secondary-view">
        <div className="secondary-view-heading"><History size={22} aria-hidden="true" /><div><span className="panel-label">{copy.nav.history}</span><h2>{copy.nav.history}</h2></div></div>
        {conversations.length > 0 ? <div className="secondary-view-list">{conversations.map((conversation) => <article className="secondary-view-item" key={conversation.id}><strong>{conversation.mode === "talk" ? copy.talkMode : copy.sayItMode}</strong><span>{conversation.createdAt ? new Date(conversation.createdAt).toLocaleDateString(locale) : copy.today}</span><small>{conversation.messages?.length || 0} {copy.stats[1].toLowerCase()}</small></article>)}</div> : <p className="secondary-view-empty">{copy.privateNote}</p>}
      </section>
    );
  }

  if (activeNav === "cards") {
    return (
      <section className="workbench-secondary-view">
        <div className="secondary-view-heading"><BookOpen size={22} aria-hidden="true" /><div><span className="panel-label">{copy.nav.cards}</span><h2>{copy.nav.cards}</h2></div></div>
        {cards.length > 0 ? <div className="secondary-view-list">{cards.map((card, index) => <article className="secondary-view-item" key={stringValue(card.id) || `card-${index}`}><strong>{cardText(card, copy.savedCardFallback)}</strong><span>{stringValue(card.translation) || stringValue(card.meaning) || copy.selectedTranslateBody}</span></article>)}</div> : <p className="secondary-view-empty">{copy.insightEmptyBody}</p>}
      </section>
    );
  }

  return null;
}

function getSpeechLocale(language: string) {
  const locales: Record<string, string> = {
    Chinese: "zh-CN",
    English: "en-US",
    Spanish: "es-ES",
    Japanese: "ja-JP",
    French: "fr-FR",
    Korean: "ko-KR",
    German: "de-DE"
  };

  return locales[language] ?? "en-US";
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function insightContent(content: InsightResult["content"], fallback: string) {
  if (typeof content === "string") return content;
  return content?.text || content?.suggestion || content?.explanation || content?.note || fallback;
}

function apiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback;
  if (["QUOTA_EXCEEDED", "FORBIDDEN", "VALIDATION_ERROR", "CENTRAL_API_UNAVAILABLE"].includes(error.code)) {
    return error.message;
  }
  return fallback;
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

function languageCode(language: string) {
  const codes: Record<string, string> = {
    Chinese: "zh-CN",
    English: "en",
    Spanish: "es",
    Japanese: "ja",
    French: "fr",
    Korean: "ko",
    German: "de"
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
    "ko-KR": "Korean",
    de: "German",
    "de-DE": "German"
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
   const languages = Array.from(new Set([...Object.keys(copy.languageNames), "German"]));
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
