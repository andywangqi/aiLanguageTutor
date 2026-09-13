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
  structured?: SayItReply;
};

export type SayItReply = {
  expression: string;
  naturalExpression: string;
  question: string;
};

export type TutorInsightKind = "translation" | "grammar" | "natural_expression";

export type PronunciationFeedback = {
  text: string;
  passed: boolean;
  score: number;
  correctedText: string;
  targetText: string;
  spokenText: string;
};

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
    "Return valid JSON only with exactly these keys: expression, naturalExpression, question.",
    `expression must be one short target-language sentence expressing the learner's meaning in ${learningLanguage}.`,
    `naturalExpression must be one short, more natural target-language alternative in ${learningLanguage}.`,
    `question must be one short relevant follow-up question in ${learningLanguage}, or an empty string when a question is not useful.`,
    "Do not include labels, markdown, quotes around the JSON, explanations, the native language, or any text outside the JSON object."
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
  if (input.mode === "say_it") {
    const structured: SayItReply = input.learningLanguageCode.startsWith("zh")
      ? { expression: "我明白了。", naturalExpression: "我明白你的意思了。", question: "你还想补充什么？" }
      : input.learningLanguageCode.startsWith("ja")
        ? { expression: "わかりました。", naturalExpression: "あなたの言いたいことがわかりました。", question: "ほかに何か伝えたいことはありますか？" }
        : input.learningLanguageCode.startsWith("ko")
          ? { expression: "알겠습니다.", naturalExpression: "무슨 말씀인지 알겠습니다.", question: "더 덧붙이고 싶은 말이 있나요?" }
          : input.learningLanguageCode.startsWith("es")
            ? { expression: "Entiendo.", naturalExpression: "Entiendo lo que quieres decir.", question: "¿Quieres añadir algo más?" }
            : input.learningLanguageCode.startsWith("th")
              ? { expression: "เข้าใจแล้ว", naturalExpression: "ฉันเข้าใจสิ่งที่คุณต้องการจะสื่อแล้ว", question: "มีอะไรอยากเพิ่มเติมอีกไหม" }
              : { expression: "I understand.", naturalExpression: "I understand what you mean.", question: "Would you like to add anything else?" };
    return { text: structured.expression, structured, provider: "fallback", model: "local-fallback" };
  }
  const fallbackByLanguage: Record<string, string> = {
    en: input.mode === "talk" ? "I understand. Tell me one more detail.\nWhat would you like to add?" : "Try saying it in a natural way.\nWhat would you like to add?",
    "zh-CN": "我明白了。请再补充一个细节。\n你还想说什么？",
    "zh-TW": "我明白了。請再補充一個細節。\n你還想說什麼？",
    ja: "わかりました。もう一つ詳しく教えてください。\n何を付け加えたいですか？",
    ko: "알겠습니다. 한 가지 더 자세히 말해 주세요.\n무엇을 더 말하고 싶나요?",
    th: "เข้าใจแล้ว เล่าเพิ่มอีกหนึ่งรายละเอียดได้ไหม\nคุณอยากเพิ่มเติมอะไรอีกไหม",
    es: "Entiendo. Cuéntame un detalle más.\n¿Qué te gustaría añadir?"
  };
  const text = (fallbackByLanguage[input.learningLanguageCode] || fallbackByLanguage.en).split("\n")[0];

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

function cleanStructuredLine(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .replace(/^\s*(?:you\s+can\s+say(?:\s+in\s+\w+)?|you\s+could\s+say|expression|natural(?:\s+expression)?|question)\s*:\s*/i, "")
    .replace(/^\s*["'“”]+|["'“”]+\s*$/g, "")
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSayItReply(text: string): SayItReply | null {
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) return null;
  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    const structured = {
      expression: cleanStructuredLine(parsed.expression),
      naturalExpression: cleanStructuredLine(parsed.naturalExpression),
      question: cleanStructuredLine(parsed.question)
    };
    return structured.expression && structured.naturalExpression ? structured : null;
  } catch {
    return null;
  }
}

function sanitizeTutorText(text: string, input: TutorReplyInput) {
  const nativePattern = nativeLanguagePattern(input.nativeLanguageCode);
  const lines = text
    .replace(/```[\s\S]*?```/g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:answer|response|translation|correction|explanation|question|you\s+could\s+say)\s*:\s*/i, "").trim())
    .filter((line) => line && !/^[-*#]+\s*/.test(line))
    .filter((line) => !(nativePattern && nativePattern.test(line)));

  if (input.mode === "say_it") return lines.slice(0, 1).join(" ");
  return lines.slice(0, 2).join(" ");
}

export async function generateTutorReply(input: TutorReplyInput): Promise<TutorReply> {
  if (!isQwenConfigured()) return fallbackReply(input);

  try {
    const result = await qwenChat(qwenMessages(input));
    if (input.mode === "say_it") {
      const structured = parseSayItReply(result.text);
      if (structured) return { ...qwenResult(result), text: structured.expression, structured };
      return fallbackReply(input);
    }
    return { ...qwenResult(result), text: sanitizeTutorText(result.text, input) || fallbackReply(input).text };
  } catch {
    return fallbackReply(input);
  }
}

function normalizedWords(text: string) {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu);
  return words ? Array.from(words) : [];
}

function repeatScore(targetText: string, spokenText: string) {
  const targetWords = normalizedWords(targetText);
  const spokenWords = normalizedWords(spokenText);
  if (!targetWords.length || !spokenWords.length) return 0;
  const matched = targetWords.filter((word) => spokenWords.includes(word)).length;
  return matched / targetWords.length;
}

function isRepeatPassed(targetText: string, spokenText: string) {
  const targetWords = normalizedWords(targetText);
  const score = repeatScore(targetText, spokenText);
  return score >= (targetWords.length <= 5 ? 0.6 : 0.72);
}

function parseFeedbackJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as { feedback?: unknown; correctedText?: unknown };
  } catch {
    return null;
  }
}

function sanitizeFeedback(text: string, nativeLanguageCode: string) {
  const nativePattern = nativeLanguagePattern(nativeLanguageCode);
  return text
    .replace(/```(?:json|text)?/gi, "")
    .replace(/```/g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:feedback|correction|explanation|answer)\s*:\s*/i, "").trim())
    .filter((line) => line && !(nativePattern && nativePattern.test(line)))
    .slice(0, 2)
    .join(" ");
}

export async function generatePronunciationFeedback(
  targetText: string,
  spokenText: string,
  targetLanguageCode = "en",
  nativeLanguageCode = "zh-CN"
): Promise<{ provider: "qwen" | "fallback"; model: string; content: PronunciationFeedback; inputTokens?: number; outputTokens?: number }> {
  const score = repeatScore(targetText, spokenText);
  const passed = isRepeatPassed(targetText, spokenText);
  const targetLanguage = nameForLanguage(targetLanguageCode);

  if (!isQwenConfigured()) {
    return {
      provider: "fallback",
      model: "local-fallback",
      content: {
        text: passed
          ? "Good repetition. Your sentence is clear."
          : `Try again: ${targetText}. Focus on saying every word clearly.`,
        passed,
        score,
        correctedText: targetText,
        targetText,
        spokenText
      }
    };
  }

  try {
    const result = await qwenChat([
      {
        role: "system",
        content: [
          `You are a pronunciation coach for ${targetLanguage}.`,
          `The learner's native language is ${nameForLanguage(nativeLanguageCode)}.`,
          "Compare the target sentence with the learner's speech transcript.",
          "Return valid JSON only with exactly these keys: feedback, correctedText.",
          `Write feedback only in ${targetLanguage}; never use the native language.`,
          "If the repetition is close, give one short positive sentence. If it is not close, give one short correction and a brief tip.",
          "Do not add markdown, labels, translation, or any text outside the JSON object."
        ].join("\n")
      },
      {
        role: "user",
        content: `TARGET SENTENCE:\n${targetText}\n\nLEARNER TRANSCRIPT:\n${spokenText}`
      }
    ], { temperature: 0.2, maxTokens: 220 });
    const parsed = parseFeedbackJson(result.text);
    const rawFeedback = typeof parsed?.feedback === "string" ? parsed.feedback : result.text;
    const feedback = sanitizeFeedback(rawFeedback, nativeLanguageCode);
    const correctedText = typeof parsed?.correctedText === "string" && parsed.correctedText.trim()
      ? parsed.correctedText.trim()
      : targetText;

    return {
      provider: result.provider,
      model: result.model,
      content: {
        text: feedback || (passed ? "Good repetition. Your sentence is clear." : `Try again: ${targetText}.`),
        passed,
        score,
        correctedText,
        targetText,
        spokenText
      },
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens
    };
  } catch {
    return {
      provider: "fallback",
      model: "local-fallback",
      content: {
        text: passed
          ? "Good repetition. Your sentence is clear."
          : `Try again: ${targetText}. Focus on saying every word clearly.`,
        passed,
        score,
        correctedText: targetText,
        targetText,
        spokenText
      }
    };
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
    grammar: `Explain the grammar of this phrase for a language learner in ${targetLanguage}. Keep it concise and practical. Do not use any other language.`,
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
