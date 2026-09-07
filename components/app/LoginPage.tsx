"use client";

import Link from "next/link";
import { ArrowRight, Check, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { BrandMark } from "./BrandMark";
import { trackEvent } from "@/lib/analytics/client";
import { isSupabaseConfigured, createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export function LoginPage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const router = useRouter();
  const copy = dictionary.product.auth;
  const [nextPath, setNextPath] = useState(localizedPath(locale, "/app"));
  const [callbackError, setCallbackError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPath = params.get("next");
    if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//") && !requestedPath.includes("\\") && !requestedPath.includes("://")) setNextPath(requestedPath);
    setCallbackError(params.get("error") === "auth_callback");
  }, []);

  async function handleGoogleSignIn() {
    setError("");
    setEmailSent(false);
    setIsLoading(true);
    await trackEvent("login_started", { provider: "google" });

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      router.push(localizedPath(locale, "/app"));
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

  async function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEmailSent(false);

    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError(copy.invalidEmail);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError(copy.emailError);
      return;
    }

    setIsLoading(true);
    await trackEvent("login_started", { provider: "email" });
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });

    if (signInError) {
      setError(copy.emailError);
      void trackEvent("login_failed", { provider: "email", error_code: signInError.code || "EMAIL_OTP_ERROR" });
    } else {
      setEmailSent(true);
      void trackEvent("email_login_link_sent", { provider: "email" });
    }
    setIsLoading(false);
  }

  return (
    <main className="auth-modal-page" aria-label={copy.ariaLabel}>
      <div className="auth-dialog-card" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
        <Link className="auth-dialog-close" href={localizedPath(locale, "/")} aria-label={copy.closeLabel}>
          <X size={18} aria-hidden="true" />
        </Link>
        <div className="auth-dialog-brand">
          <BrandMark href={localizedPath(locale, "/")} locale={locale} />
        </div>

        <div className="auth-dialog-copy">
          <p className="auth-dialog-eyebrow">{copy.eyebrow}</p>
          <h1 id="auth-dialog-title">{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>

        <button className="auth-dialog-google" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
          <span className="auth-google-mark" aria-hidden="true">
            G
          </span>
          {isLoading ? copy.googleLoading : copy.google}
          {isLoading ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        </button>

        <div className="auth-dialog-divider"><span>{copy.orContinueWith}</span></div>

        <form className="auth-dialog-email" onSubmit={handleEmailSignIn} noValidate>
          <label htmlFor="auth-email">{copy.emailLabel}</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
              if (emailSent) setEmailSent(false);
            }}
            aria-invalid={Boolean(error)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : null}
            {isLoading ? copy.emailSending : copy.emailCta}
            {!isLoading ? <ArrowRight size={16} aria-hidden="true" /> : null}
          </button>
        </form>

        {emailSent ? <p className="auth-dialog-success" role="status">{copy.emailSent}</p> : null}

        <div className="auth-dialog-note">
          <Check size={15} aria-hidden="true" />
          <span>{copy.accountNote}</span>
        </div>

        {!isSupabaseConfigured() ? <p className="auth-dialog-status">{copy.demoMode}</p> : null}
        {callbackError ? <p className="auth-dialog-error">{copy.callbackError}</p> : null}
        {error ? <p className="auth-dialog-error">{error}</p> : null}

        <p className="auth-dialog-terms">
          {copy.termsPrefix} <Link href={localizedPath(locale, "/terms")}>{copy.termsLabel}</Link> {copy.termsAnd}{" "}
          <Link href={localizedPath(locale, "/privacy")}>{copy.privacyLabel}</Link>
        </p>
      </div>
    </main>
  );
}
