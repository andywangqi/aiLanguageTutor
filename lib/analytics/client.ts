"use client";

import { isLocale } from "@/lib/i18n/config";
import { getProductSiteUrl } from "@/lib/site-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AnalyticsEvent } from "./events";

const anonymousStorageKey = "ai-tutor-anonymous-id";
const sessionStorageKey = "ai-tutor-session-id";

function createId(prefix: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}_${id}`;
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const created = createId(prefix);
    storage.setItem(key, created);
    return created;
  } catch {
    // A blocked browser storage must not prevent analytics from being sent.
    return undefined;
  }
}

function isProductionSite() {
  if (typeof window === "undefined") return false;

  try {
    const configuredHost = new URL(getProductSiteUrl()).hostname.toLowerCase().replace(/^www\./, "");
    const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, "");
    return currentHost === configuredHost;
  } catch {
    return false;
  }
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

export function getScopedStorageKey(baseKey: string, scope: string | null | undefined) {
  const normalizedScope = scope?.trim();
  return `${baseKey}:${normalizedScope || "anonymous"}`;
}

export function getAnonymousMergeStorageKey(anonymousId: string, userId: string) {
  return `ai-tutor-anonymous-merged:${anonymousId}:${userId}`;
}

export function markAnonymousIdentityMerged(anonymousId: string, userId: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getAnonymousMergeStorageKey(anonymousId, userId), "1");
  } catch {
    // Storage failures must not block a successful login or merge.
  }
}

export async function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  const writeKey = process.env.NEXT_PUBLIC_ZHYADMIN_WRITE_KEY?.trim();
  if (!writeKey || !isProductionSite()) return false;

  const { anonymousId, sessionId } = getBrowserIdentity();
  let accessToken: string | undefined;
  let userId: string | null = null;
  try {
    const supabase = createSupabaseBrowserClient();
    const session = await supabase?.auth.getSession();
    accessToken = session?.data.session?.access_token;
    userId = session?.data.session?.user.id || null;
  } catch {
    // Analytics must remain best effort if auth storage is unavailable.
  }
  const path = window.location.pathname;
  const pathLocale = path.split("/")[1];
  const occurredAt = new Date().toISOString();
  const enrichedProperties = {
    ...properties,
    locale: properties.locale ?? (isLocale(pathLocale) ? pathLocale : "en"),
    page_path: properties.page_path ?? path,
    environment: "production",
    host: window.location.hostname
  };

  try {
    const response = await fetch("/api/track", {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "X-Site-Key": writeKey,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({
        eventName: event,
        siteUrl: getProductSiteUrl(),
        properties: enrichedProperties,
        anonymousId,
        userId,
        sessionId,
        path: `${path}${window.location.search}`,
        referrer: document.referrer,
        occurredAt
      })
    });
    return response.ok;
  } catch {
    // Analytics must never interrupt a learning action.
    return false;
  }
}

export async function trackEventOnce(
  key: string,
  event: AnalyticsEvent | string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  const storageKey = `ai-tutor-event:${key}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return true;
  } catch {
    // A blocked sessionStorage should not prevent the event from being sent.
  }

  const sent = await trackEvent(event, properties);
  if (sent) {
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // A blocked sessionStorage should not prevent the event from being sent.
    }
  }
  return sent;
}
