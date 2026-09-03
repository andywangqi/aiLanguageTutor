import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

function safeNextPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !value.includes("://") ? value : "/app";
}

function localeForPath(path: string): Locale {
  const segment = path.split("/")[1] || "";
  return isLocale(segment) ? segment : "en";
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextPath = safeNextPath(url.searchParams.get("next"));
  const locale = localeForPath(nextPath);
  const response = NextResponse.redirect(new URL(nextPath, request.url));
  const code = url.searchParams.get("code");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url.searchParams.get("error")) {
    const errorUrl = new URL(localizedPath(locale, "/login"), request.url);
    errorUrl.searchParams.set("error", "auth_callback");
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !supabaseUrl || !publishableKey) return response;

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const errorUrl = new URL(localizedPath(locale, "/login"), request.url);
    errorUrl.searchParams.set("error", "auth_callback");
    return NextResponse.redirect(errorUrl);
  }

  return response;
}
