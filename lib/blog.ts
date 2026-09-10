import "server-only";

import { getCentralEndpoint, getProductSiteUrl } from "@/lib/site-config";
import type { ApiEnvelope, BlogDetailResponse, BlogListResponse } from "@/lib/api/types";

async function fetchBlog<T>(path: string, locale: string): Promise<T | null> {
  const endpoint = new URL(`${getCentralEndpoint()}/api/blog/${path}`);
  endpoint.searchParams.set("siteUrl", getProductSiteUrl());
  endpoint.searchParams.set("locale", locale);

  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    const payload = await response.json() as ApiEnvelope<T> | T;
    if (!response.ok) return null;
    if (payload && typeof payload === "object" && "data" in payload) {
      return (payload as ApiEnvelope<T>).data ?? null;
    }
    return payload as T;
  } catch {
    return null;
  }
}

export function getPublicBlogPosts(locale: string) {
  return fetchBlog<BlogListResponse>("posts", locale);
}

export function getPublicBlogPost(slug: string, locale: string) {
  return fetchBlog<BlogDetailResponse>(`posts/${encodeURIComponent(slug)}`, locale);
}
