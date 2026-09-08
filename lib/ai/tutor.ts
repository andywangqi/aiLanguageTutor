import "server-only";

import { isQwenConfigured, qwenChat, type QwenChatMessage, type QwenChatResult } from "./qwen";

export type TutorMode = "say_it" | "talk";

export type TutorMessageInput = {
  role: "user" | "tutor" | "assistant" | "system" | string;
  content: string;
};

export type TutorReplyInput = {
  mode: TutorMode;
  nativeLanguageCode: string;
  learningLanguageCode: string;
  levelCode?: string;
  userText: string;
  history?: TutorMessageInput[];
};

export type TutorReply = {
  text: string;
  provider: "qwen" | "fallback";
  model: string;
  inputTokens?: number;
  outputTokens?: number;
};

export type TutorInsightKind = "translation" | "grammar" | "natural_expression";

const languageNames: Record<string, string> = {
  en: "English",
  "en-US": "English",
  "zh-CN": "Simplified Chinese",
  "zh-TW": "Traditional Chinese",
  ja: "Japanese",
  "ja-JP": "Japanese",
  th: "Thai",
  ko: "Korean",
  "ko-KR": "Korean",
  es: "Spanish",
  "es-ES": "Spanish",
  fr: "French",
  "fr-FR": "French",
  de: "German",
  "de-DE": "German"
};

function nameForLanguage(code: string) {
  return languageNames[code] || code || "English";
}

function systemPrompt(input: TutorReplyInput) {
  const nativeLanguage = nameForLanguage(input.nativeLanguageCode);
  const learningLanguage = nameForLanguage(input.learningLanguageCode);
  const level = input.levelCode || "auto";

  if (input.mode === "talk") {
    return [
      `You are AI Language Tutor, a patient speaking tutor for ${learningLanguage}.`,
      `The learner's native language is ${nativeLanguage}. Their level is ${level}.`,
      `Reply only in ${learningLanguage}. Never use ${nativeLanguage}.`,
      "Keep the reply short enough to speak aloud: one or two natural sentences, with a relevant question when appropriate.",
      "Do not translate, explain, label, correct, quote, or discuss the learner's language. Do not use markdown.",
      "Do not mention that you are an AI model."
    ].join("\n");
  }

  return [
    `You are AI Language Tutor, a speaking tutor that helps learners express an idea in ${learningLanguage}.`,
    `The learner may type in ${nativeLanguage} because they do not know how to say it in ${learningLanguage}. Their level is ${level}.`,
    `Use only ${learningLanguage} in your reply. Never use ${nativeLanguage}.`,
    "Return exactly two short lines: first, one natural target-language sentence expressing the learner's meaning; second, one short follow-up question in the target language.",
    "Do not translate, explain, correct, add labels, quote the learner, mention the native language, use markdown, or include any text besides those two lines."
  ].join("\n");
}

function qwenMessages(input: TutorReplyInput): QwenChatMessage[] {
  const history = (input.history || []).slice(-8).map((message): QwenChatMessage => ({
    role: message.role === "tutor" || message.role === "assistant" ? "assistant" : "user",
    content: message.content
  }));

  return [
    { role: "system", content: systemPrompt(input) },
    ...history,
    { role: "user", content: input.userText }
  ];
}

function fallbackReply(input: TutorReplyInput): TutorReply {
  const learningLanguage = nameForLanguage(input.learningLanguageCode);
  const fallbackByLanguage: Record<string, string> = {
    en: input.mode === "talk" ? "I understand. Tell me one more detail.\nWhat would you like to add?" : "Try saying it in a natural way.\nWhat would you like to add?",
    "zh-CN": "我明白了。请再补充一个细节。\n你还想说什么？",
    "zh-TW": "我明白了。請再補充一個細節。\n你還想說什麼？",
    ja: "わかりました。もう一つ詳しく教えてください。\n何を付け加えたいですか？",
    ko: "알겠습니다. 한 가지 더 자세히 말해 주세요.\n무엇을 더 말하고 싶나요?",
    th: "เข้าใจแล้ว เล่าเพิ่มอีกหนึ่งรายละเอียดได้ไหม\nคุณอยากเพิ่มเติมอะไรอีกไหม",
    es: "Entiendo. Cuéntame un detalle más.\n¿Qué te gustaría añadir?"
  };
  const text = fallbackByLanguage[input.learningLanguageCode] || fallbackByLanguage.en;

  return { text, provider: "fallback", model: "local-fallback" };
}

function nativeLanguagePattern(code: string) {
  if (code.startsWith("zh")) return /[\u3400-\u9fff]/u;
  if (code.startsWith("ja")) return /[\u3040-\u30ff\u3400-\u9fff]/u;
  if (code.startsWith("ko")) return /[\uac00-\ud7af]/u;
  if (code.startsWith("th")) return /[\u0e00-\u0e7f]/u;
  if (code.startsWith("ru")) return /[\u0400-\u04ff]/u;
  return null;
}

function sanitizeTutorText(text: string, input: TutorReplyInput) {
  const nativePattern = nativeLanguagePattern(input.nativeLanguageCode);
  const lines = text
    .replace(/```[\s\S]*?```/g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:answer|response|translation|correction|explanation|question)\s*:\s*/i, "").trim())
    .filter((line) => line && !/^[-*#]+\s*/.test(line))
    .filter((line) => !(nativePattern && nativePattern.test(line)));

  if (input.mode === "say_it") return lines.slice(0, 2).join("\n");
  return lines.slice(0, 2).join(" ");
}

export async function generateTutorReply(input: TutorReplyInput): Promise<TutorReply> {
  if (!isQwenConfigured()) return fallbackReply(input);

  try {
    const result = await qwenChat(qwenMessages(input));
    return { ...qwenResult(result), text: sanitizeTutorText(result.text, input) || fallbackReply(input).text };
  } catch {
    return fallbackReply(input);
  }
}

export async function generateMessageInsight(kind: TutorInsightKind, text: string, targetLanguageCode = "en") {
  if (!isQwenConfigured()) {
    return {
      provider: "fallback" as const,
      model: "local-fallback",
      content: {
        text: "",
        note: "The learning tool is unavailable until the AI provider is configured."
      }
    };
  }

  const targetLanguage = nameForLanguage(targetLanguageCode);
  const prompts: Record<TutorInsightKind, string> = {
    translation: `Translate this phrase into ${targetLanguage}. Return only the translated text. Do not add an explanation, note, label, quotation marks, or any other language.`,
    grammar: `Explain the grammar of this phrase for a language learner. Keep it concise and practical.`,
    natural_expression: `Rewrite this phrase as a more natural expression in ${targetLanguage}. Include one brief explanation.`
  };

  const result = await qwenChat([
    { role: "system", content: prompts[kind] },
    { role: "user", content: text }
  ], { temperature: 0.35, maxTokens: 360 });

  return {
    provider: result.provider,
    model: result.model,
    content: {
      text: result.text,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens
    }
  };
}

function qwenResult(result: QwenChatResult): TutorReply {
  return {
    text: result.text,
    provider: result.provider,
    model: result.model,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens
  };
}
