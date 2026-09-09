"use client";

import { getBrowserIdentity } from "@/lib/analytics/client";
import { localeFromPathname, localizedPath } from "@/lib/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  ApiEnvelope,
  BillingMe,
  BillingOrder,
  BillingPlan,
  BillingPlansResponse,
  BillingSubscription,
  CheckoutResponse,
  ConversationList,
  JsonObject,
  LanguageSettings,
  LearningCard,
  MessageOutput,
  PronunciationFeedback,
  ReadingAudio,
  ReadingAttempt,
  ReadingMaterialBundle,
  ReadingProgress,
  ReadingUpload,
  SendMessageResult,
  TutorConversation,
  VoiceInput,
  VoiceUpload,
  WorkbenchData
} from "./types";
import { ApiError } from "./types";

type RequestOptions = {
  method?: string;
  body?: JsonObject;
  idempotencyKey?: string;
  signal?: AbortSignal;
};

async function getAccessToken() {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return undefined;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const token = await getAccessToken();
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Request-Id": `req_${crypto.randomUUID()}`
  });

  const identity = getBrowserIdentity();
  if (identity.anonymousId) headers.set("X-Browser-Id", identity.anonymousId);
  if (identity.sessionId) headers.set("X-Session-Id", identity.sessionId);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);

  const response = await fetch(`/api/${path.replace(/^\/+/, "")}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    cache: "no-store"
  });

  let payload: ApiEnvelope<T> | T | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T> | T;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const envelope = payload && typeof payload === "object" && "error" in payload ? (payload as ApiEnvelope<T>) : undefined;
    const error = new ApiError(
      envelope?.error || { code: "HTTP_ERROR", message: "The request could not be completed." },
      response.status,
      envelope?.requestId
    );
    if (path !== "auth/logout" && (error.code === "UNAUTHENTICATED" || error.status === 401)) {
      const supabase = createSupabaseBrowserClient();
      await supabase?.auth.signOut();
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const loginPath = localizedPath(localeFromPathname(window.location.pathname), "/login");
      window.location.assign(`${loginPath}?next=${encodeURIComponent(currentPath)}`);
    }
    throw error;
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
}

function createIdempotencyKey(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export const api = {
  auth: {
    async sync() {
      const identity = getBrowserIdentity();
      const supabase = createSupabaseBrowserClient();
      const session = await supabase?.auth.getSession();
      const userId = session?.data.session?.user.id;
      return request<JsonObject>("auth/sync", {
        method: "POST",
        body: { ...identity, path: window.location.pathname },
        idempotencyKey: identity.anonymousId && userId
          ? `auth_sync:${identity.anonymousId}:${userId}`
          : undefined
      });
    },
    async logout() {
      return request<JsonObject>("auth/logout", {
        method: "POST"
      });
    }
  },
  me: {
    get() {
      return request<JsonObject>("me");
    },
    update(body: JsonObject) {
      return request<JsonObject>("me", { method: "PATCH", body });
    },
    getSettings() {
      return request<LanguageSettings>("me/settings");
    },
    updateSettings(body: LanguageSettings) {
      return request<LanguageSettings>("me/settings", { method: "PUT", body });
    },
    updatePartner(body: JsonObject) {
      return request<JsonObject>("me/partner", { method: "PATCH", body });
    }
  },
  workbench: {
    get() {
      return request<WorkbenchData>("workbench");
    },
    partners() {
      return request<JsonObject | { partners?: JsonObject[] }>("partners");
    }
  },
  conversations: {
    create(body: JsonObject) {
      return request<TutorConversation>("conversations", {
        method: "POST",
        body
      });
    },
    list(query = "") {
      return request<ConversationList>(`conversations${query ? `?${query}` : ""}`);
    },
    get(id: string) {
      return request<TutorConversation>(`conversations/${encodeURIComponent(id)}`);
    },
    sendMessage(id: string, body: JsonObject) {
      return request<SendMessageResult>(`conversations/${encodeURIComponent(id)}/messages`, {
        method: "POST",
        body
      });
    },
    sendVoiceMessage(id: string, body: JsonObject) {
      return request<SendMessageResult>(`conversations/${encodeURIComponent(id)}/messages/from-voice`, {
        method: "POST",
        body
      });
    },
    end(id: string) {
      return request<JsonObject>(`conversations/${encodeURIComponent(id)}/end`, { method: "POST" });
    },
    reset(id: string, body: JsonObject = {}) {
      return request<TutorConversation>(`conversations/${encodeURIComponent(id)}/reset`, {
        method: "POST",
        body
      });
    }
  },
  voice: {
    uploadUrl(body: JsonObject) {
      return request<VoiceUpload>("voice/upload-url", { method: "POST", body });
    },
    registerInput(body: JsonObject) {
      return request<VoiceInput>("voice/inputs", { method: "POST", body });
    },
    get(id: string) {
      return request<VoiceInput>(`voice/inputs/${encodeURIComponent(id)}`);
    },
    transcribe(id: string) {
      return request<VoiceInput>(`voice/inputs/${encodeURIComponent(id)}/transcribe`, { method: "POST" });
    }
  },
  messages: {
    translate(id: string, body: JsonObject = {}) {
      return request<MessageOutput>(`messages/${encodeURIComponent(id)}/translate`, { method: "POST", body });
    },
    translateText(body: JsonObject) {
      return request<MessageOutput>("messages/translate", { method: "POST", body });
    },
    grammar(id: string) {
      return request<MessageOutput>(`messages/${encodeURIComponent(id)}/grammar`, { method: "POST" });
    },
    pronunciation(id: string, body: JsonObject) {
      return request<PronunciationFeedback>(`messages/${encodeURIComponent(id)}/pronunciation`, { method: "POST", body });
    },
    pronunciationText(body: JsonObject) {
      return request<PronunciationFeedback>("messages/pronunciation", { method: "POST", body });
    },
    grammarText(body: JsonObject) {
      return request<MessageOutput>("messages/grammar", { method: "POST", body });
    },
    naturalExpression(id: string) {
      return request<MessageOutput>(`messages/${encodeURIComponent(id)}/natural-expression`, { method: "POST" });
    },
    audio(id: string) {
      return request<JsonObject>(`messages/${encodeURIComponent(id)}/audio`, { method: "POST" });
    },
    saveCard(id: string, body: JsonObject) {
      return request<LearningCard>(`messages/${encodeURIComponent(id)}/cards`, {
        method: "POST",
        body
      });
    }
  },
  cards: {
    list() {
      return request<JsonObject>("cards");
    },
    update(id: string, body: JsonObject) {
      return request<JsonObject>(`cards/${encodeURIComponent(id)}`, { method: "PATCH", body });
    },
    remove(id: string) {
      return request<JsonObject>(`cards/${encodeURIComponent(id)}`, { method: "DELETE" });
    }
  },
  billing: {
    async plans() {
      const response = await request<BillingPlansResponse | BillingPlan[]>("billing/plans");
      return Array.isArray(response) ? response : response?.plans || [];
    },
    me() {
      return request<BillingMe>("billing/me");
    },
    order(orderId: string) {
      return request<BillingOrder>(`billing/orders/${encodeURIComponent(orderId)}`);
    },
    checkout(planCode: string, paths: { successPath?: string; cancelPath?: string } = {}) {
      return request<CheckoutResponse>("billing/checkout", {
        method: "POST",
        body: {
          planCode,
          successPath: paths.successPath || "/app",
          cancelPath: paths.cancelPath || "/pricing?payment=cancelled"
        },
        idempotencyKey: createIdempotencyKey("checkout")
      });
    },
    cancel(subscriptionId: string) {
      return request<BillingSubscription>(`billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
        method: "POST"
      });
    },
    resume(subscriptionId: string) {
      return request<BillingSubscription>(`billing/subscriptions/${encodeURIComponent(subscriptionId)}/resume`, {
        method: "POST"
      });
    }
  },
  reading: {
    sample(interfaceLocale: string) {
      return request<ReadingMaterialBundle>(`reading/lessons/sample?interfaceLocale=${encodeURIComponent(interfaceLocale)}`);
    },
    createMaterial(body: JsonObject) {
      return request<ReadingMaterialBundle>("reading/materials", {
        method: "POST",
        body,
        idempotencyKey: createIdempotencyKey("reading_material")
      });
    },
    getMaterial(id: string, interfaceLocale: string) {
      return request<ReadingMaterialBundle>(`reading/materials/${encodeURIComponent(id)}?interfaceLocale=${encodeURIComponent(interfaceLocale)}`);
    },
    listMaterials(query = "") {
      return request<JsonObject>(`reading/materials${query ? `?${query}` : ""}`);
    },
    saveNotes(id: string, content: string) {
      return request<JsonObject>(`reading/materials/${encodeURIComponent(id)}/notes`, {
        method: "PUT",
        body: { content }
      });
    },
    submitAttempt(id: string, answers: Array<{ questionId: string; optionIndex: number }>) {
      return request<ReadingAttempt>(`reading/materials/${encodeURIComponent(id)}/attempts`, {
        method: "POST",
        body: { answers },
        idempotencyKey: createIdempotencyKey("reading_attempt")
      });
    },
    progress(id: string) {
      return request<ReadingProgress>(`reading/materials/${encodeURIComponent(id)}/progress`);
    },
    uploadUrl(body: JsonObject) {
      return request<ReadingUpload>("reading/uploads/upload-url", { method: "POST", body });
    },
    audio(id: string, body: JsonObject = {}) {
      return request<ReadingAudio>(`reading/materials/${encodeURIComponent(id)}/audio`, { method: "POST", body });
    }
  }
};

export { getAccessToken };
