import "server-only";

export type QwenChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type QwenChatResult = {
  text: string;
  model: string;
  provider: "qwen";
  inputTokens?: number;
  outputTokens?: number;
};

type QwenChoice = {
  message?: {
    content?: string;
  };
};

type QwenUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
};

type QwenResponse = {
  choices?: QwenChoice[];
  usage?: QwenUsage;
};

export function isQwenConfigured() {
  return Boolean(getQwenApiKey());
}

export function getQwenModel() {
  return process.env.QWEN_MODEL?.trim() || process.env.DASHSCOPE_MODEL?.trim() || "qwen-plus";
}

function getQwenApiKey() {
  return process.env.QWEN_API_KEY?.trim() || process.env.DASHSCOPE_API_KEY?.trim();
}

function getQwenBaseUrl() {
  return (process.env.QWEN_BASE_URL?.trim() || process.env.DASHSCOPE_BASE_URL?.trim() || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/+$/, "");
}

export async function qwenChat(messages: QwenChatMessage[], options: { temperature?: number; maxTokens?: number } = {}): Promise<QwenChatResult> {
  const apiKey = getQwenApiKey();
  if (!apiKey) throw new Error("QWEN_API_KEY is not configured.");

  const model = getQwenModel();
  const response = await fetch(`${getQwenBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.55,
      max_tokens: options.maxTokens ?? 520
    }),
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as QwenResponse | null;
  const text = payload?.choices?.[0]?.message?.content?.trim();

  if (!response.ok || !text) {
    throw new Error(`Qwen request failed with status ${response.status}.`);
  }

  return {
    text,
    model,
    provider: "qwen",
    inputTokens: payload?.usage?.prompt_tokens,
    outputTokens: payload?.usage?.completion_tokens
  };
}
