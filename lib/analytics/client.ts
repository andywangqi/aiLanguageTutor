"use client";

import { getProductSiteUrl } from "@/lib/site-config";

const anonymousStorageKey = "ai-tutor-anonymous-id";
const sessionStorageKey = "ai-tutor-session-id";

function createId(prefix: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}_${id}`;
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const created = createId(prefix);
  storage.setItem(key, created);
  return created;
}

export function getBrowserIdentity() {
  if (typeof window === "undefined") {
    return { anonymousId: undefined, sessionId: undefined };
  }

  return {
    anonymousId: getStoredId(window.localStorage, anonymousStorageKey, "anon"),
    sessionId: getStoredId(window.sessionStorage, sessionStorageKey, "session")
  };
}

export async function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  const writeKey = process.env.NEXT_PUBLIC_ZHYADMIN_WRITE_KEY?.trim();
  if (!writeKey || typeof window === "undefined") return;

  const { anonymousId, sessionId } = getBrowserIdentity();

  try {
    await fetch("/api/track", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteKey: writeKey,
        siteUrl: getProductSiteUrl(),
        event,
        properties,
        anonymousId,
        sessionId,
        path: window.location.pathname
      })
    });
  } catch {
    // Analytics must never interrupt a learning action.
  }
}

