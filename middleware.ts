import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ja", "th", "ko", "zh-CN", "zh-TW", "es"] as const;

export function middleware(req: NextRequest) {
  const seg = req.nextUrl.pathname.split("/")[1] ?? "";
  const locale = (LOCALES as readonly string[]).includes(seg) ? seg : "en";

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
