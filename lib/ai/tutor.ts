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
      "Continue the conversation in the target language.",
      "Keep replies short enough to speak aloud, usually one or two sentences.",
      "If the learner makes a serious mistake, correct it briefly and continue naturally.",
      "Do not mention that you are an AI model. Do not output JSON."
    ].join("\n");
  }

  return [
    `You are AI Language Tutor, a speaking tutor that helps learners express an idea in ${learningLanguage}.`,
    `The learner may type in ${nativeLanguage} because they do not know how to say it in ${learningLanguage}. Their level is ${level}.`,
    "Understand the learner's meaning, then teach a natural target-language sentence they can say out loud.",
    "Reply with the most useful natural expression first. Add one short explanation only if it helps.",
    "Keep the answer concise and practical. Do not output JSON."
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
  const text = input.mode === "talk"
    ? `I understand. Let's keep going in ${learningLanguage}. Tell me one more detail, and I'll help you say it naturally.`
    : `You could say: "${input.userText}". I will make this more natural once the Qwen API key is configured.`;

  return { text, provider: "fallback", model: "local-fallback" };
}

export async function generateTutorReply(input: TutorReplyInput): Promise<TutorReply> {
  if (!isQwenConfigured()) return fallbackReply(input);

  try {
    const result = await qwenChat(qwenMessages(input));
    return qwenResult(result);
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
        text,
        note: "Configure QWEN_API_KEY to generate this learning result."
      }
    };
  }

  const targetLanguage = nameForLanguage(targetLanguageCode);
  const prompts: Record<TutorInsightKind, string> = {
    translation: `Translate this phrase into clear learner-friendly ${targetLanguage}. Return only the translation and one short note if useful.`,
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
