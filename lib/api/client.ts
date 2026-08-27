"use client";

import { getBrowserIdentity } from "@/lib/analytics/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  ApiEnvelope,
  BillingPlan,
  BillingPlansResponse,
  CheckoutResponse,
  JsonObject,
  LanguageSettings,
  TutorConversation,
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
    throw new ApiError(
      envelope?.error || { code: "HTTP_ERROR", message: "The request could not be completed." },
      response.status,
      envelope?.requestId
    );
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
      return request<JsonObject>("auth/sync", {
        method: "POST",
        body: { ...identity, path: window.location.pathname },
        idempotencyKey: createIdempotencyKey("auth_sync")
      });
    },
    async logout() {
      return request<JsonObject>("auth/logout", {
        method: "POST",
        idempotencyKey: createIdempotencyKey("auth_logout")
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
        body,
        idempotencyKey: createIdempotencyKey("conversation")
      });
    },
    list(query = "") {
      return request<JsonObject>(`conversations${query ? `?${query}` : ""}`);
    },
    get(id: string) {
      return request<TutorConversation>(`conversations/${encodeURIComponent(id)}`);
    },
    sendMessage(id: string, body: JsonObject) {
      return request<TutorConversation>(`conversations/${encodeURIComponent(id)}/messages`, {
        method: "POST",
        body,
        idempotencyKey: createIdempotencyKey("message")
      });
    },
    sendVoiceMessage(id: string, body: JsonObject) {
      return request<TutorConversation>(`conversations/${encodeURIComponent(id)}/messages/from-voice`, {
        method: "POST",
        body,
        idempotencyKey: createIdempotencyKey("voice_message")
      });
    },
    end(id: string) {
      return request<JsonObject>(`conversations/${encodeURIComponent(id)}/end`, { method: "POST" });
    },
    reset(id: string, body: JsonObject = {}) {
      return request<TutorConversation>(`conversations/${encodeURIComponent(id)}/reset`, {
        method: "POST",
        body,
        idempotencyKey: createIdempotencyKey("conversation_reset")
      });
    }
  },
  voice: {
    uploadUrl(body: JsonObject) {
      return request<JsonObject>("voice/upload-url", { method: "POST", body });
    },
    registerInput(body: JsonObject) {
      return request<JsonObject>("voice/inputs", { method: "POST", body });
    }
  },
  messages: {
    translate(id: string) {
      return request<JsonObject>(`messages/${encodeURIComponent(id)}/translate`, { method: "POST" });
    },
    grammar(id: string) {
      return request<JsonObject>(`messages/${encodeURIComponent(id)}/grammar`, { method: "POST" });
    },
    audio(id: string) {
      return request<JsonObject>(`messages/${encodeURIComponent(id)}/audio`, { method: "POST" });
    },
    saveCard(id: string) {
      return request<JsonObject>(`messages/${encodeURIComponent(id)}/cards`, {
        method: "POST",
        idempotencyKey: createIdempotencyKey("learning_card")
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
      return request<JsonObject>("billing/me");
    },
    checkout(planCode: string, paths: { successPath?: string; cancelPath?: string } = {}) {
      return request<CheckoutResponse>("billing/checkout", {
        method: "POST",
        body: {
          planCode,
          successPath: paths.successPath || "/app?payment=success",
          cancelPath: paths.cancelPath || "/pricing?payment=cancelled"
        },
        idempotencyKey: createIdempotencyKey("checkout")
      });
    },
    cancel(subscriptionId: string) {
      return request<JsonObject>(`billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
        method: "POST",
        idempotencyKey: createIdempotencyKey("subscription_cancel")
      });
    }
  }
};

export { getAccessToken };
