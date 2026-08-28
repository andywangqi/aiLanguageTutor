import { NextRequest } from "next/server";
import { getCentralEndpoint, getProductSiteUrl } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supportedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

function isId(value: string | undefined) {
  return Boolean(value && value.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(value));
}

function isAllowed(method: string, segments: string[]) {
  const path = segments.join("/");
  if (path === "track") return method === "POST";
  if (path === "auth/sync" || path === "auth/logout") return method === "POST";
  if (path === "me") return method === "GET" || method === "PATCH";
  if (path === "me/settings") return method === "GET" || method === "PUT";
  if (path === "me/partner") return method === "PATCH";
  if (path === "workbench" || path === "partners") return method === "GET";
  if (path === "conversations") return method === "GET" || method === "POST";
  if (segments[0] === "conversations" && isId(segments[1])) {
    if (segments.length === 2) return method === "GET";
    if (segments.length === 3 && ["messages", "end", "reset"].includes(segments[2])) return method === "POST";
    if (segments.length === 4 && segments[2] === "messages" && segments[3] === "from-voice") return method === "POST";
  }
  if (segments[0] === "messages" && isId(segments[1]) && segments.length === 3) {
    return method === "POST" && ["translate", "grammar", "audio", "cards"].includes(segments[2]);
  }
  if (path === "cards") return method === "GET";
  if (segments[0] === "cards" && isId(segments[1]) && segments.length === 2) {
    return method === "PATCH" || method === "DELETE";
  }
  if (path === "billing/plans" || path === "billing/me") return method === "GET";
  if (path === "billing/checkout") return method === "POST";
  if (segments[0] === "billing" && segments[1] === "subscriptions" && isId(segments[2]) && segments[3] === "cancel") {
    return method === "POST";
  }
  if (segments[0] === "voice" && ["upload-url", "inputs"].includes(segments[1]) && segments.length === 2) {
    return method === "POST";
  }
  return false;
}

function requestId(request: NextRequest) {
  return request.headers.get("X-Request-Id") || `req_${crypto.randomUUID()}`;
}

async function forward(request: NextRequest, segments: string[]) {
  const method = request.method.toUpperCase();
  const id = requestId(request);

  if (!supportedMethods.has(method) || !isAllowed(method, segments)) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Product API route not found." }, requestId: id },
      { status: 404, headers: { "X-Request-Id": id } }
    );
  }

  const target = new URL(`${getCentralEndpoint()}/api/${segments.map(encodeURIComponent).join("/")}`);
  for (const [key, value] of request.nextUrl.searchParams.entries()) target.searchParams.append(key, value);
  target.searchParams.set("siteUrl", getProductSiteUrl());

  const headers = new Headers({
    Accept: request.headers.get("Accept") || "application/json",
    "X-Request-Id": id
  });
  for (const headerName of ["Authorization", "Content-Type", "Idempotency-Key", "X-Site-Key"]) {
    const value = request.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }

  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store"
    });
    const responseHeaders = new Headers();
    const contentType = upstream.headers.get("Content-Type");
    if (contentType) responseHeaders.set("Content-Type", contentType);
    responseHeaders.set("X-Request-Id", upstream.headers.get("X-Request-Id") || id);
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json(
      { error: { code: "CENTRAL_API_UNAVAILABLE", message: "The central service is temporarily unavailable." }, requestId: id },
      { status: 502, headers: { "X-Request-Id": id } }
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export function GET(request: NextRequest, context: RouteContext) {
  return context.params.then(({ path }) => forward(request, path));
}

export function POST(request: NextRequest, context: RouteContext) {
  return context.params.then(({ path }) => forward(request, path));
}

export function PUT(request: NextRequest, context: RouteContext) {
  return context.params.then(({ path }) => forward(request, path));
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return context.params.then(({ path }) => forward(request, path));
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return context.params.then(({ path }) => forward(request, path));
}
