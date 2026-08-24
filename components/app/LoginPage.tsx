import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function LoginPage() {
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
            Practice real conversations with your AI language tutor and keep your progress between sessions.
          </p>
        </div>

        <Link className="auth-dialog-google" href="/app">
          <span className="auth-google-mark" aria-hidden="true">
            G
          </span>
          Continue with Google
          <ArrowRight size={17} aria-hidden="true" />
        </Link>

        <div className="auth-dialog-note">
          <Check size={15} aria-hidden="true" />
          <span>No password needed for this demo.</span>
        </div>

        <p className="auth-dialog-terms">
          By continuing, you agree to our <Link href="/terms">Terms</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
