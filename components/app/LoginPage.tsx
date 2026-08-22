"use client";

import Link from "next/link";
import { ArrowRight, AtSign, Check, Globe2, Mail, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

type AuthMode = "signin" | "create";

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");

  return (
    <main className="auth-modal-page">
      <div className="auth-modal-card">
        <Link className="auth-modal-close" href="/" aria-label="Close sign in">
          <X size={20} aria-hidden="true" />
        </Link>
        <section className="auth-story">
          <BrandMark />
          <div className="auth-story-copy">
            <p className="auth-kicker">COMPREHENSIBLE INPUT</p>
            <h1>Science-backed speaking practice.</h1>
            <p className="auth-story-lead">Real conversation, in the language you study.</p>
            <div className="auth-proof-card">
              <span>ADAPTIVE AI</span>
              <strong>It adjusts language, pace, and support to your level.</strong>
              <ul>
                <li>
                  <Check size={15} aria-hidden="true" />
                  Learn from the things you actually want to say
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  Keep your progress between conversations
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">
            <Link className="auth-mobile-brand" href="/">
              <BrandMark />
            </Link>
            <p className="auth-panel-eyebrow">AI LANGUAGE TUTOR</p>
            <h2>{mode === "signin" ? "Sign in to AI Language Tutor" : "Create your AI tutor account"}</h2>
            <p className="auth-panel-lead">
              Practice with AI-guided comprehensible input. Your account saves your partner, chat history, and
              learning cards.
            </p>

            <div className="auth-tabs" role="tablist" aria-label="Account action">
              <button
                className={mode === "signin" ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={mode === "signin"}
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
              <button
                className={mode === "create" ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={mode === "create"}
                onClick={() => setMode("create")}
              >
                Create account
              </button>
            </div>

            <div className="auth-actions">
              <Link className="auth-google" href="/app">
                <Globe2 size={22} aria-hidden="true" />
                Continue with Google
              </Link>
              <Link className="auth-email" href="/app">
                <Mail size={22} aria-hidden="true" />
                Continue with email
              </Link>
            </div>

            <div className="auth-note">
              <AtSign size={17} aria-hidden="true" />
              <span>No password needed for this demo. You can connect your real auth provider later.</span>
            </div>

            <p className="auth-terms">
              By continuing, you agree to our <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link>.
            </p>

            <Link className="auth-back-link" href="/">
              Back to the website
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
