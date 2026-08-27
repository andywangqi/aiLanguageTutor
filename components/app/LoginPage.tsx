"use client";

import Link from "next/link";
import { ArrowRight, Check, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { trackEvent } from "@/lib/analytics/client";
import { isSupabaseConfigured, createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/app");
  const [callbackError, setCallbackError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPath = params.get("next");
    if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//")) setNextPath(requestedPath);
    setCallbackError(params.get("error") === "auth_callback");
  }, []);

  async function handleGoogleSignIn() {
    setError("");
    setIsLoading(true);
    await trackEvent("login_started", { provider: "google" });

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      router.push("/app");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-modal-page" aria-label="Sign in">
      <div className="auth-dialog-card" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
        <Link className="auth-dialog-close" href="/" aria-label="Close sign in">
          <X size={18} aria-hidden="true" />
        </Link>
        <div className="auth-dialog-brand">
          <BrandMark />
        </div>

        <div className="auth-dialog-copy">
          <p className="auth-dialog-eyebrow">AI LANGUAGE TUTOR</p>
          <h1 id="auth-dialog-title">Sign in to continue</h1>
          <p>
            Practice real conversations with your AI language tutor and keep your learning progress between sessions.
          </p>
        </div>

        <button className="auth-dialog-google" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
          <span className="auth-google-mark" aria-hidden="true">
            G
          </span>
          {isLoading ? "Connecting to Google" : "Continue with Google"}
          {isLoading ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        </button>

        <div className="auth-dialog-note">
          <Check size={15} aria-hidden="true" />
          <span>Google sign-in keeps your tutor, conversations, and learning cards together.</span>
        </div>

        {!isSupabaseConfigured() ? <p className="auth-dialog-status">Demo mode is active. Add Supabase environment variables to enable Google sign-in.</p> : null}
        {callbackError ? <p className="auth-dialog-error">Google sign-in could not be completed. Please try again.</p> : null}
        {error ? <p className="auth-dialog-error">{error}</p> : null}

        <p className="auth-dialog-terms">
          By continuing, you agree to our <Link href="/terms">Terms</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
