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
import { practiceActions } from "@/lib/i18n/practice-actions";
import { findScenario, type Scenario } from "@/lib/scenarios";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { readingCopy } from "@/lib/i18n/reading-copy";
import { detectBrowserNativeLanguage, readNativeLanguagePreference, saveNativeLanguagePreference } from "@/lib/i18n/language-preferences";
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
  structured?: {
    target_sentence: string;
    follow_up_question: string;
    requires_repeat: boolean;
  };
};

const sayItPrompt = "You could say";

function cleanTutorDisplayText(value: string) {
  return value
    .replace(/```(?:text|markdown)?/gi, "")
    .replace(/```/g, "")
    .split(/\r?\n+/)
    .map((line) => line
      .replace(/^\s*(?:you\s+(?:could|can)\s+say(?:\s+in\s+\w+)?|answer|response|translation|correction|explanation|question)\s*:?\s*/i, "")
      .replace(/^\s*[-*•]\s*/, "")
      .replace(/\*+/g, "")
      .trim())
    .filter(Boolean)
    .join("\n");
}

function parseSayItFallback(value: string): JsonObject | null {
  const cleaned = cleanTutorDisplayText(value).replace(/^.*?\byou\s+can\s+say\s*:\s*/i, "");
  const quoted = Array.from(cleaned.matchAll(/[“"]([^”"]+)[”"]/g), (match) => match[1].trim()).filter(Boolean);
  const expressions = quoted.length ? quoted.slice(0, 4) : cleaned
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^are\s+/i.test(line))
    .slice(0, 4);
  const question = cleaned.match(/[^.!?]*\?\s*$/)?.[0]?.trim() || "";
  return expressions.length ? { expressions, expression: expressions[0], naturalExpression: "", question } : null;
}

type InsightResult = {
  content?: string | { text?: string; note?: string; explanation?: string; suggestion?: string; translation?: string; translatedText?: string; grammar?: string };
  text?: string;
  translation?: string;
  translatedText?: string;
  explanation?: string;
  suggestion?: string;
  grammar?: string;
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
  abort?: () => void;
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
  replyWaiting: string;
  voiceStart: string;
  voiceListening: string;
  voiceCancel: string;
  voiceSend: string;
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

type WorkbenchCopy = ProductCopy["workbench"] & WorkbenchUiMessages & RepeatUiMessages;
type RepeatFeedbackState = {
  messageId: string;
  result: PronunciationFeedback;
};

type RepeatUiMessages = Pick<ProductCopy["workbench"], "repeat" | "repeatPrompt" | "repeatChecking" | "repeatPassed" | "repeatTryAgain" | "repeatCorrection" | "repeatFeedbackError" | "repeatUnsupported" | "repeatRequired"> & {
  repeatModalTitle: string;
  repeatModalBody: string;
  repeatModalAction: string;
  repeatModalClose: string;
};

const localizedRepeatMessages: Record<Locale, RepeatUiMessages> = {
  en: {
    repeat: "Repeat",
    repeatPrompt: "Repeat the sentence aloud before continuing.",
    repeatChecking: "Checking your repetition…",
    repeatPassed: "Good repetition. You can continue.",
    repeatTryAgain: "Please repeat the sentence and try again.",
    repeatCorrection: "Practice this sentence:",
    repeatFeedbackError: "We could not check the repetition. Please try again.",
    repeatUnsupported: "Your browser cannot check repetition. Use Chrome or Edge and allow microphone access.",
    repeatRequired: "Please repeat the tutor's sentence before continuing.",
    repeatModalTitle: "Repeat before continuing",
    repeatModalBody: "In Say It / Translate, repeat the tutor's English sentence and receive pronunciation feedback before starting the next turn.",
    repeatModalAction: "Start repeating",
    repeatModalClose: "Not now"
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
    repeatRequired: "続ける前に、Tutorの文を復唱してください。",
    repeatModalTitle: "復唱してから続けましょう",
    repeatModalBody: "Say It / Translate では、次のターンへ進む前に Tutor の英語表現を復唱し、発音フィードバックを受けてください。",
    repeatModalAction: "復唱を始める",
    repeatModalClose: "後で"
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
    repeatRequired: "โปรดพูดตามประโยคของ Tutor ก่อนดำเนินการต่อ",
    repeatModalTitle: "พูดตามก่อนดำเนินการต่อ",
    repeatModalBody: "ในโหมด Say It / Translate โปรดพูดตามประโยคภาษาอังกฤษของ Tutor และรับคำแนะนำการออกเสียงก่อนเริ่มรอบถัดไป",
    repeatModalAction: "เริ่มพูดตาม",
    repeatModalClose: "ไว้ภายหลัง"
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
    repeatRequired: "계속하기 전에 Tutor의 문장을 따라 말해 주세요.",
    repeatModalTitle: "따라 말한 후 계속하세요",
    repeatModalBody: "Say It / Translate에서는 다음 대화를 시작하기 전에 Tutor의 영어 문장을 따라 말하고 발음 피드백을 받아야 합니다.",
    repeatModalAction: "따라 말하기 시작",
    repeatModalClose: "나중에"
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
    repeatRequired: "请先复读导师说的句子，然后再继续。",
    repeatModalTitle: "完成复读后再继续",
    repeatModalBody: "在 Say It / Translate 模式中，需要先复读导师给出的自然英文表达并获得发音纠正，才能开始下一轮。",
    repeatModalAction: "开始复读",
    repeatModalClose: "暂不复读"
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
    repeatRequired: "請先複誦 Tutor 的句子，再繼續。",
    repeatModalTitle: "完成複誦後再繼續",
    repeatModalBody: "在 Say It / Translate 模式中，需要先複誦 Tutor 提供的自然英文表達並取得發音修正，才能開始下一輪。",
    repeatModalAction: "開始複誦",
    repeatModalClose: "暫不複誦"
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
    repeatRequired: "Repite la frase del tutor antes de continuar.",
    repeatModalTitle: "Repite antes de continuar",
    repeatModalBody: "En Say It / Translate, repite la frase en inglés del tutor y recibe correcciones de pronunciación antes de empezar el siguiente turno.",
    repeatModalAction: "Empezar a repetir",
    repeatModalClose: "Ahora no"
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
    replyWaiting: "Thinking…",
    voiceStart: "Start voice input",
    voiceListening: "Listening…",
    voiceCancel: "Cancel voice input",
    voiceSend: "Send voice message",
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
    replyWaiting: "考え中…",
    voiceStart: "音声入力を開始",
    voiceListening: "聞き取り中…",
    voiceCancel: "音声入力をキャンセル",
    voiceSend: "音声メッセージを送信",
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
    replyWaiting: "กำลังคิด…",
    voiceStart: "เริ่มป้อนข้อมูลด้วยเสียง",
    voiceListening: "กำลังฟัง…",
    voiceCancel: "ยกเลิกการป้อนข้อมูลด้วยเสียง",
    voiceSend: "ส่งข้อความเสียง",
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
    replyWaiting: "생각하는 중…",
    voiceStart: "음성 입력 시작",
    voiceListening: "듣는 중…",
    voiceCancel: "음성 입력 취소",
    voiceSend: "음성 메시지 보내기",
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
    replyWaiting: "正在思考…",
    voiceStart: "开始语音输入",
    voiceListening: "正在听…",
    voiceCancel: "取消语音输入",
    voiceSend: "发送语音消息",
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
    replyWaiting: "正在思考…",
    voiceStart: "開始語音輸入",
    voiceListening: "正在聆聽…",
    voiceCancel: "取消語音輸入",
    voiceSend: "傳送語音訊息",
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
    replyWaiting: "Pensando…",
    voiceStart: "Iniciar entrada de voz",
    voiceListening: "Escuchando…",
    voiceCancel: "Cancelar entrada de voz",
    voiceSend: "Enviar mensaje de voz",
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
  const settings = languageSettingsFromWorkbench(workbench);
  const profile = workbench.profile && typeof workbench.profile === "object" ? workbench.profile as JsonObject : undefined;
  return settings.onboardingCompleted === true
    || Boolean(settings.onboardingCompletedAt)
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
  const actions = practiceActions[locale];
  const composerRef = useRef<HTMLInputElement>(null);
  const [scenario, setScenario] = useState<Scenario | undefined>();
  useEffect(() => {
    setScenario(findScenario(new URLSearchParams(window.location.search).get("scenario") || ""));
  }, []);
  const router = useRouter();
  const copy = useMemo(
    () => ({ ...dictionary.product.workbench, ...localizedWorkbenchMessages[locale], ...localizedRepeatMessages[locale],
      repeatModalTitle: localizedRepeatMessages[locale].repeat,
      repeatModalBody: actions.note,
      repeatModalClose: actions.skip,
      repeatUnsupported: actions.type,
      repeatRequired: actions.type,
      repeatPrompt: localizedRepeatMessages[locale].repeat
    }),
    [dictionary.product.workbench, locale]
  );
  const [activeNav, setActiveNav] = useState<NavItem>("home");
  const [mode, setMode] = useState<WorkbenchMode>("sayIt");
  const [insightMode, setInsightMode] = useState<InsightMode>("translate");
  const [expressionHelp, setExpressionHelp] = useState("");
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState<string>(() => readNativeLanguagePreference() || detectBrowserNativeLanguage());
  const [learningLanguage, setLearningLanguage] = useState("English");
  const [level, setLevel] = useState("Auto-detect");
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [repeatRequiredModalOpen, setRepeatRequiredModalOpen] = useState(false);
  const [isRepeatListening, setIsRepeatListening] = useState(false);
  const [isRepeatChecking, setIsRepeatChecking] = useState(false);
  const [hasRepeatedLatestTutor, setHasRepeatedLatestTutor] = useState(false);
  const [followUpVisible, setFollowUpVisible] = useState(false);
  const [repeatFeedback, setRepeatFeedback] = useState<RepeatFeedbackState | null>(null);
  const [isReplyPending, setIsReplyPending] = useState(false);
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
  const repeatCancelledRef = useRef(false);
  const messageListRef = useRef<HTMLDivElement | null>(null);

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
    const list = messageListRef.current;
    if (!list) return;
    requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  }, [messages, isReplyPending]);

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
        router.replace(`${localizedPath(locale, "/login")}?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
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
          router.replace(`${localizedPath(locale, "/login")}?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
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
  const latestMessage = messages[messages.length - 1];
  const latestTutorMessage = [...messages].reverse().find((message) => message.role === "tutor");
  const hasTutorResponseToUser = latestMessage?.role === "tutor" && messages.some((message) => message.role === "user");
  const requiresRepeat = mode === "sayIt" && hasTutorResponseToUser && latestTutorMessage?.structured?.requires_repeat === true;
  const canContinueConversation = !requiresRepeat || followUpVisible;

  function skipRepeat(focusText = false) {
    cancelRepeat();
    setRepeatRequiredModalOpen(false);
    setFollowUpVisible(true);
    setVoiceNotice("");
    if (focusText) requestAnimationFrame(() => composerRef.current?.focus());
  }

  async function helpExpressInput() {
    if (!input.trim()) {
      setVoiceNotice(actions.helpEmpty);
      composerRef.current?.focus();
      return;
    }
    setIsInsightBusy(true);
    setExpressionHelp("");
    setSelectedPhrase(input.trim());
    setApiNotice("");
    setInsightMode("translate");
    try {
      const result = await api.messages.translateText({
        text: input.trim(),
        sourceLanguageCode: languageCode(nativeLanguage),
        targetLanguageCode: languageCode(learningLanguage)
      }) as InsightResult;
      const expression = insightContent(result, copy.noExplanation);
      setInsightText(expression);
      setExpressionHelp(expression);
    } catch (error) {
      setApiNotice(apiErrorMessage(error, copy.learningToolError));
    } finally {
      setIsInsightBusy(false);
    }
  }

  function showRepeatRequiredModal() {
    setVoiceNotice("");
    setRepeatRequiredModalOpen(true);
  }

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
    const settings = languageSettingsFromWorkbench(workbench);
    if (settings.nativeLanguage) {
      setNativeLanguage(settings.nativeLanguage);
      if (setupComplete) saveNativeLanguagePreference(settings.nativeLanguage);
    }
    if (settings.learningLanguage) setLearningLanguage(settings.learningLanguage);
    if (settings.level) setLevel(settings.level);

    // A workbench visit always starts a fresh daily conversation. Previous
    // conversations are loaded only from the History tab and must not leak
    // into today's workspace.
    setConversationId(null);
    setMessages([{
      id: `daily-${Date.now()}`,
      role: "tutor",
      text: mode === "sayIt" ? `What would you like to say in ${languageName(learningLanguage)}?` : "What would you like to talk about today?"
    }]);
    setHasRepeatedLatestTutor(false);
    setFollowUpVisible(false);
    setRepeatFeedback(null);
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
    setExpressionHelp("");
    setIsReplyPending(false);
    setHasRepeatedLatestTutor(false);
    setFollowUpVisible(false);
    setRepeatFeedback(null);
    setMessages([
      {
        id: `demo-${Date.now()}`,
        role: "tutor",
        text: nextMode === "sayIt" ? `What would you like to say in ${languageName(learningLanguage)}?` : "What would you like to talk about today?"
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
    cancelRepeat();
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
    if (!canContinueConversation) {
      showRepeatRequiredModal();
      return;
    }
    if (!trimmed && !(inputType === "voice" && audioBlob)) return;
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
      setIsReplyPending(true);
      try {
        await wait(650);
        setMessages((current) => [
          ...current,
          {
            id: `demo-${Date.now()}`,
            role: "tutor",
            text: mode === "sayIt"
              ? demoSayItExpression(learningLanguage)
              : copy.demoTalkReply,
            structured: mode === "sayIt" ? demoSayItReply(learningLanguage) : undefined
          }
        ]);
        setHasRepeatedLatestTutor(false);
        setFollowUpVisible(false);
        setRepeatFeedback(null);
      } finally {
        setIsReplyPending(false);
      }
      return;
    }

    setIsReplyPending(true);
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
        if (remoteMessages.some((message) => message.role === "tutor")) setFollowUpVisible(false);
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
      setIsReplyPending(false);
    }
  }

  function sendMessage() {
    if (isReplyPending || isApiBusy) return;
    void sendMessageText(input);
  }

  function startVoiceInput() {
    if (isListening) return;
    if (!canContinueConversation) {
      showRepeatRequiredModal();
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
    saveNativeLanguagePreference(nativeLanguage);
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
      if (conversationId) await createConversation(mode);
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
    const cleanedText = spokenText.trim();
    if (!normalizeSpeech(cleanedText)) {
      setHasRepeatedLatestTutor(false);
      setVoiceNotice(copy.repeatRequired);
      return;
    }

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
                ? "The recognized words match the sentence."
                : "Compare the recognized words with the target sentence.",
              passed: isRepeatCloseEnough(spokenText, message.text),
              score: isRepeatCloseEnough(spokenText, message.text) ? 1 : 0,
              correctedText: message.text,
              targetText: message.text,
              spokenText
            }
          }
        : !message.id.startsWith("demo-")
        ? await api.messages.pronunciation(message.id, {
            spokenText: cleanedText,
            targetLanguageCode: languageCode(learningLanguage),
            nativeLanguageCode: languageCode(nativeLanguage)
          })
        : await api.messages.pronunciationText({
            targetText: message.text,
            spokenText: cleanedText,
            targetLanguageCode: languageCode(learningLanguage),
            nativeLanguageCode: languageCode(nativeLanguage)
          })) as PronunciationFeedback;
      setRepeatFeedback({ messageId: message.id, result });
      const passed = Boolean(result.content?.passed);
      setHasRepeatedLatestTutor(passed);
      setFollowUpVisible(false);
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

  function cancelRepeat() {
    if (!isRepeatListening) return;
    repeatCancelledRef.current = true;
    if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);
    repeatTimeoutRef.current = null;
    repeatRecognitionRef.current?.abort?.();
    repeatRecognitionRef.current = null;
    setIsRepeatListening(false);
    setHasRepeatedLatestTutor(false);
    setFollowUpVisible(false);
    setVoiceNotice(copy.voiceCancel);
  }

  function repeatTutorMessage(message: Message) {
    if (message.id !== latestTutorMessage?.id || isRepeatListening || isRepeatChecking) return;

    setRepeatRequiredModalOpen(false);

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceNotice(copy.repeatUnsupported);
      return;
    }

    repeatRecognitionRef.current?.stop();
    if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);
    repeatCancelledRef.current = false;

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
      if (repeatCancelledRef.current) {
        repeatCancelledRef.current = false;
        return;
      }
      const cleanedText = spokenText.trim();
      if (!normalizeSpeech(cleanedText)) {
        setHasRepeatedLatestTutor(false);
        setVoiceNotice(copy.repeatRequired);
        return;
      }
      void submitRepeatFeedback(message, cleanedText);
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
    recognition.onerror = () => finish("");
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
          : await api.messages.grammar(targetMessage.id, {
              sourceLanguageCode: languageCode(learningLanguage),
              targetLanguageCode: languageCode(nativeLanguage)
            })) as InsightResult
        : (kind === "translate"
          ? await api.messages.translateText({ text: phrase, sourceLanguageCode: languageCode(learningLanguage), targetLanguageCode: languageCode(nativeLanguage) })
          : await api.messages.grammarText({ text: phrase, sourceLanguageCode: languageCode(learningLanguage), targetLanguageCode: languageCode(nativeLanguage) })) as InsightResult;
      setInsightText(insightContent(result, copy.noExplanation));
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
        const result = await api.cards.list();
        setCards(jsonArray(result, "cards"));
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
              <div className="message-list" ref={messageListRef}>
                {messages.map((message) => (
                  <div className={`workbench-message ${message.role}`} key={message.id}>
                    <div className="partner-avatar mini">
                      <span>✦</span>
                    </div>
                    {message.role === "tutor" ? (
                      <>
                        <div className="tutor-message-content">
                        <div className="message-bubble">
                          {requiresRepeat && message.id === latestTutorMessage?.id ? <span className="say-it-prompt">{sayItPrompt}</span> : null}
                          <button
                            className="phrase-button"
                            type="button"
                            onClick={() => { setSelectedPhrase(message.text); setInsightText(""); }}
                          >
                            {message.structured?.target_sentence || message.text}
                          </button>
                            {message.structured ? (
                            <div className="say-it-reply-lines" aria-label={sayItPrompt}>
                              <p className="say-it-target">{message.structured.target_sentence}</p>
                              {followUpVisible && message.id === latestTutorMessage?.id && message.structured.follow_up_question ? <p className="say-it-question">{message.structured.follow_up_question}</p> : null}
                              {message.structured.requires_repeat ? <span className="say-it-repeat-badge">Repeat this sentence</span> : null}
                            </div>
                          ) : null}
                          <div className="message-tools">
                            <button type="button" onClick={() => void requestMessageHelp(message, "audio")}>
                              <Volume2 size={15} aria-hidden="true" />
                              {copy.listen}
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
                          </div>
                          {isRepeatChecking && message.id === latestTutorMessage?.id ? <VoiceActivityIndicator label={copy.repeatChecking} compact /> : null}
                          {repeatFeedback?.messageId === message.id ? (
                            <div className={`repeat-feedback ${repeatFeedback.result.content.passed ? "passed" : "needs-retry"}`} role="status">
                              <strong>{repeatFeedback.result.content.passed ? copy.repeatPassed : copy.repeatTryAgain}</strong>
                              <span>{repeatFeedback.result.content.text}</span>
                              <span>{copy.repeatCorrection} {repeatFeedback.result.content.correctedText}</span>
                              {repeatFeedback.result.content.passed ? <div className="repeat-feedback-actions">
                                <button type="button" onClick={() => { setFollowUpVisible(true); setVoiceNotice(""); }}>{copy.gotIt}</button>
                                <button type="button" onClick={() => { setHasRepeatedLatestTutor(false); setFollowUpVisible(false); setRepeatFeedback(null); setVoiceNotice(copy.repeatPrompt); }}>{copy.repeat}</button>
                              </div> : null}
                            </div>
                          ) : null}
                        </div>
                        </div>
                        {requiresRepeat && !followUpVisible && message.id === latestTutorMessage?.id ? (
                          <div className="repeat-action-wrap">
                            <p>{actions.note}</p>
                            <button className="repeat-action" type="button" onClick={() => isRepeatListening ? cancelRepeat() : repeatTutorMessage(message)} disabled={isRepeatChecking}>
                              <Mic size={19} aria-hidden="true" />
                              {isRepeatListening ? copy.voiceCancel : isRepeatChecking ? copy.repeatChecking : copy.repeat}
                            </button>
                            {isRepeatListening ? <VoiceActivityIndicator label={copy.repeatPrompt} compact /> : null}
                            <button type="button" disabled={isRepeatChecking} onClick={() => skipRepeat()}>{actions.skip}</button>
                            <button type="button" disabled={isRepeatChecking} onClick={() => skipRepeat(true)}>{actions.type}</button>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="message-bubble">{message.text.split(/\r?\n/).map((line, lineIndex) => <span className="tutor-reply-line" key={`${message.id}-line-${lineIndex}`}>{line}</span>)}</div>
                    )}
                  </div>
                ))}
                {isReplyPending ? (
                  <div className="workbench-message tutor pending" role="status" aria-live="polite">
                    <div className="partner-avatar mini">
                      <span>✦</span>
                    </div>
                    <div className="message-bubble tutor-reply-loading">
                      <span className="reply-loading-label">{copy.replyWaiting}</span>
                      <span className="reply-loading-dots" aria-hidden="true"><i /><i /><i /></span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {scenario ? <div className="repeat-feedback"><strong>{scenario.title}</strong><p>{scenario.prompt}</p><button type="button" disabled={isApiBusy || isReplyPending || isListening || isRepeatListening || isRepeatChecking} onClick={() => {
              setMode("talk");
              setLearningLanguage("English");
              setConversationId(null);
              resetDemoConversation("talk");
              setInput(scenario.prompt);
              setScenario(undefined);
              requestAnimationFrame(() => composerRef.current?.focus());
            }}>{actions.type}</button></div> : null}
            {canContinueConversation ? <div className="conversation-footer">
              <div className="conversation-shortcuts">
                 <button className="lost" type="button" disabled={isInsightBusy} onClick={() => { if (latestTutorMessage) void requestMessageHelp(latestTutorMessage, "translate"); }}>
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
                {mode === "talk" ? <button type="button" disabled={isInsightBusy || isApiBusy} onClick={() => void helpExpressInput()}>{actions.help}</button> : null}
              </div>
              <div className="message-composer">
                {isListening ? (
                  <VoiceActivityIndicator label={copy.voiceListening} />
                ) : null}
                <input
                  ref={composerRef}
                  className={isListening ? "voice-input-hidden" : ""}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onFocus={() => { if (!canContinueConversation) showRepeatRequiredModal(); }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder={mode === "sayIt" ? copy.typeSayIt : copy.typeTalk}
                  aria-label={copy.messageLabel}
                  readOnly={!canContinueConversation}
                  disabled={isApiBusy || isRepeatListening || isRepeatChecking}
                />
                  <button
                    className={isListening ? "voice-button listening" : "voice-button"}
                    type="button"
                  onClick={() => { if (isListening) cancelVoiceInput(); else startVoiceInput(); }}
                  aria-label={isListening ? copy.voiceCancel : copy.voiceStart}
                  aria-pressed={isListening}
                  title={isListening ? copy.voiceCancel : copy.voiceStart}
                  disabled={isApiBusy || isRepeatListening || isRepeatChecking}
                >
                  {isListening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                </button>
                <button className="send-button" type="button" onClick={() => { if (isListening) stopVoiceInput(); else sendMessage(); }} aria-label={isListening ? copy.voiceSend : copy.sendMessage} disabled={isApiBusy || isRepeatListening || isRepeatChecking}>
                  <Send size={18} aria-hidden="true" />
                </button>
              </div>
              {expressionHelp ? <div className="repeat-feedback" role="status"><strong>{actions.help}</strong><p>{expressionHelp}</p><button type="button" onClick={() => { setInput(expressionHelp); setExpressionHelp(""); composerRef.current?.focus(); }}>{actions.type}</button></div> : null}
            </div> : null}
            {voiceNotice ? <p className="voice-notice">{voiceNotice}</p> : null}
            {apiNotice ? <p className="workbench-api-notice" role="status">{apiNotice}</p> : null}
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
      {repeatRequiredModalOpen && requiresRepeat && !hasRepeatedLatestTutor && latestTutorMessage ? (
        <RepeatRequiredModal
          copy={copy}
          onClose={() => skipRepeat(true)}
          onRepeat={() => repeatTutorMessage(latestTutorMessage)}
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

function insightContent(result: InsightResult, fallback: string) {
  const content = result.content;
  if (typeof content === "string") return content;
  return result.translation
    || result.translatedText
    || result.grammar
    || result.text
    || result.explanation
    || result.suggestion
    || content?.text
    || content?.translation
    || content?.translatedText
    || content?.grammar
    || content?.suggestion
    || content?.explanation
    || content?.note
    || fallback;
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

  return codes[languageName(language)] || "en";
}

function demoSayItExpression(targetLanguage: string) {
  const expressions: Record<string, string> = {
    English: "I’d like to ask about that.",
    Chinese: "我想问一下这件事。",
    Japanese: "そのことについて聞きたいです。",
    Thai: "ฉันอยากถามเกี่ยวกับเรื่องนั้น",
    Korean: "그것에 대해 물어보고 싶어요.",
    Spanish: "Me gustaría preguntar sobre eso.",
    French: "J’aimerais poser une question à ce sujet.",
    German: "Ich möchte dazu etwas fragen."
  };
  return expressions[languageName(targetLanguage)] || expressions.English;
}

function demoSayItReply(targetLanguage: string) {
  const language = languageName(targetLanguage);
  const replies: Record<string, { target_sentence: string; follow_up_question: string; requires_repeat: boolean }> = {
    English: {
      target_sentence: "I'd like to ask about that.", follow_up_question: "What would you like to ask?", requires_repeat: true
    },
    Chinese: { target_sentence: "我想问一下这件事。", follow_up_question: "你还想问什么？", requires_repeat: true },
    Japanese: { target_sentence: "そのことについて聞きたいです。", follow_up_question: "ほかに聞きたいことはありますか？", requires_repeat: true },
    Thai: { target_sentence: "ฉันอยากถามเกี่ยวกับเรื่องนั้น", follow_up_question: "อยากถามอะไรเพิ่มเติมไหม", requires_repeat: true },
    Korean: { target_sentence: "그것에 대해 물어보고 싶어요.", follow_up_question: "더 물어보고 싶은 것이 있나요?", requires_repeat: true },
    Spanish: { target_sentence: "Me gustaría preguntar sobre eso.", follow_up_question: "¿Qué te gustaría preguntar?", requires_repeat: true },
    French: { target_sentence: "J’aimerais poser une question à ce sujet.", follow_up_question: "Que souhaitez-vous demander ?", requires_repeat: true },
    German: { target_sentence: "Ich möchte dazu etwas fragen.", follow_up_question: "Was möchten Sie fragen?", requires_repeat: true }
  };
  return replies[language] || replies.English;
}

function languageName(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const names: Record<string, string> = {
    zh: "Chinese",
    zhcn: "Chinese",
    zhtw: "Chinese",
    chinese: "Chinese",
    中文: "Chinese",
    en: "English",
    enus: "English",
    english: "English",
    英语: "English",
    es: "Spanish",
    eses: "Spanish",
    spanish: "Spanish",
    西班牙语: "Spanish",
    ja: "Japanese",
    jaja: "Japanese",
    japanese: "Japanese",
    日本語: "Japanese",
    日语: "Japanese",
    fr: "French",
    frfr: "French",
    french: "French",
    法语: "French",
    ko: "Korean",
    koko: "Korean",
    korean: "Korean",
    한국어: "Korean",
    韩语: "Korean",
    de: "German",
    dede: "German",
    german: "German",
    德语: "German"
  };

  return names[normalized] || value;
}

function languageSettingsFromWorkbench(workbench: WorkbenchData) {
  const rawSettings = workbench.settings && typeof workbench.settings === "object"
    ? workbench.settings as JsonObject
    : undefined;
  const settings = rawSettings?.settings && typeof rawSettings.settings === "object"
    ? rawSettings.settings as JsonObject
    : rawSettings;

  return {
    nativeLanguage: languageSettingValue(settings, "nativeLanguageCode", "native_language_code", "nativeLanguage", "native_language"),
    learningLanguage: languageSettingValue(settings, "learningLanguageCode", "learning_language_code", "learningLanguage", "learning_language"),
    level: levelSettingValue(settings, "levelCode", "level_code", "level"),
    onboardingCompleted: settings?.onboardingCompleted === true || settings?.onboarding_completed === true,
    onboardingCompletedAt: stringValue(settings?.onboardingCompletedAt) || stringValue(settings?.onboarding_completed_at)
  };
}

function languageSettingValue(settings: JsonObject | undefined, ...keys: string[]) {
  if (!settings) return undefined;
  for (const key of keys) {
    const value = stringValue(settings[key]);
    if (value) return languageName(value);
  }
  return undefined;
}

function levelSettingValue(settings: JsonObject | undefined, ...keys: string[]) {
  if (!settings) return undefined;
  for (const key of keys) {
    const value = stringValue(settings[key]);
    if (value) return levelName(value);
  }
  return undefined;
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
      const rawText = message.content || message.text;
      const structuredValue = message.metadata?.sayIt;
      const structured = structuredValue && typeof structuredValue === "object"
        ? structuredValue as JsonObject
        : conversation.mode === "say_it" ? parseSayItJson(rawText) || parseSayItFallback(rawText || "") : null;
      const text = typeof structured?.target_sentence === "string" ? structured.target_sentence : cleanTutorDisplayText(rawText || "");
      if (!text || !message.id) return null;

      return {
        id: message.id,
        role: message.role === "assistant" || message.role === "tutor" ? "tutor" : "user",
        text,
        structured: structured
          ? {
              target_sentence: String(structured.target_sentence ?? text),
              follow_up_question: String(structured.follow_up_question ?? ""),
              requires_repeat: structured.requires_repeat === true
            }
          : undefined
      };
    })
    .filter((message): message is Message => Boolean(message));
}

function parseSayItJson(value: string | undefined): JsonObject | null {
  if (!value) return null;
  const jsonText = value.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) return null;
  try {
    const parsed = JSON.parse(jsonText) as JsonObject;
    if (typeof parsed.target_sentence === "string") {
      return {
        target_sentence: parsed.target_sentence,
        follow_up_question: typeof parsed.follow_up_question === "string" ? parsed.follow_up_question : "",
        requires_repeat: parsed.requires_repeat === true
      };
    }
    if (typeof parsed.expression === "string") {
      return {
        target_sentence: parsed.expression,
        follow_up_question: typeof parsed.question === "string" ? parsed.question : "",
        requires_repeat: false
      };
    }
    return null;
  } catch {
    return null;
  }
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="conversation-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function VoiceActivityIndicator({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className={`voice-activity-indicator${compact ? " compact" : ""}`} role="status" aria-live="polite">
      <span className="voice-activity-orb" aria-hidden="true">
        <Mic size={compact ? 15 : 19} />
      </span>
      <span className="voice-activity-label">{label}</span>
      <span className="voice-activity-bars" aria-hidden="true">
        {[22, 38, 58, 32, 48, 68, 40, 26].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      </span>
    </div>
  );
}

function RepeatRequiredModal({
  copy,
  onClose,
  onRepeat
}: {
  copy: RepeatUiMessages;
  onClose: () => void;
  onRepeat: () => void;
}) {
  return (
    <div className="repeat-modal-backdrop" role="presentation">
      <section className="repeat-modal" role="dialog" aria-modal="true" aria-labelledby="repeat-modal-title" aria-describedby="repeat-modal-body">
        <button className="repeat-modal-close" type="button" onClick={onClose} aria-label={copy.repeatModalClose}>
          <X size={18} aria-hidden="true" />
        </button>
        <span className="repeat-modal-icon">
          <Mic size={24} aria-hidden="true" />
        </span>
        <span className="panel-label">{copy.repeat}</span>
        <h2 id="repeat-modal-title">{copy.repeatModalTitle}</h2>
        <p id="repeat-modal-body">{copy.repeatModalBody}</p>
        <div className="repeat-modal-actions">
          <button className="repeat-modal-secondary" type="button" onClick={onClose}>
            {copy.repeatModalClose}
          </button>
          <button className="repeat-modal-primary" type="button" onClick={onRepeat}>
            <Mic size={17} aria-hidden="true" />
            {copy.repeatModalAction}
          </button>
        </div>
      </section>
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
