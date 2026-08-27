import "server-only";

import { getCentralEndpoint, getProductSiteUrl } from "@/lib/site-config";
import type { JsonObject } from "@/lib/api/types";

export async function centralServerRequest<T>(path: string, body: JsonObject, idempotencyKey = crypto.randomUUID()) {
  const serverKey = process.env.ZHYADMIN_SERVER_KEY?.trim();
  if (!serverKey) throw new Error("ZHYADMIN_SERVER_KEY is not configured.");

  const response = await fetch(`${getCentralEndpoint()}/api/${path.replace(/^\/+/, "")}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Site-Secret": serverKey,
      "X-Site-Url": getProductSiteUrl(),
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({ ...body, siteUrl: getProductSiteUrl() }),
    cache: "no-store"
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Central API request failed with status ${response.status}.`);
  }

  return payload as T;
}

export function registerCentralSite(metadata: JsonObject = {}) {
  return centralServerRequest<JsonObject>("sites", {
    siteType: "ai_language_tutor",
    siteName: "AI Language Tutor",
    active: true,
    ...metadata
  });
}

export function syncCentralEntity(entity: JsonObject) {
  return centralServerRequest<JsonObject>("sync", {
    siteType: "ai_language_tutor",
    ...entity
  });
}
