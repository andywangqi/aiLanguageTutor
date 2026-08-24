"use client";

import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { BrandMark } from "./BrandMark";

const freeFeatures = [
  "1-minute AI conversation",
  "Voice input",
  "AI replies in your target language",
  "Translation",
  "Listen to AI",
  "Basic word explanations",
  "Basic pronunciation feedback",
  "No credit card required"
];

const proFeatures = [
  "Unlimited AI conversations",
  "Voice conversations",
  "Target-language AI replies",
  "Instant translation",
  "AI voice / TTS",
  "Slow playback",
  "Word & phrase explanations",
  "AI pronunciation feedback",
  "Grammar corrections",
  "Natural expression suggestions",
  "Saved words & phrases",
  "Conversation history",
  "Personalized practice",
  "Progress tracking"
];

export function PricingPage() {
  return (
    <main className="pricing-lite-page">
      <header className="pricing-lite-header">
        <BrandMark />
        <Link className="pricing-lite-back" href="/app">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to workbench
        </Link>
      </header>

      <div className="pricing-lite-shell container">
        <section className="pricing-lite-hero" aria-labelledby="pricing-lite-title">
          <p className="pricing-lite-eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Pricing
          </p>
          <h1 id="pricing-lite-title">Practice for free. Upgrade when you&apos;re ready.</h1>
          <p className="pricing-lite-lead">Try your first conversation for free.</p>
        </section>

        <section className="pricing-lite-grid" aria-label="Subscription plans">
          <article className="pricing-lite-card pricing-lite-card-free">
            <span className="pricing-lite-kicker">Try first</span>
            <h2>Free</h2>
            <div className="pricing-lite-price">
              <strong>$0</strong>
              <span>1-minute trial</span>
            </div>
            <p className="pricing-lite-subtitle">Try your first conversation.</p>
            <ul className="pricing-lite-list">
              {freeFeatures.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="pricing-lite-note">No credit card required.</p>
            <Link className="pricing-lite-button pricing-lite-button-secondary" href="/app">
              Try for free
            </Link>
          </article>

          <article className="pricing-lite-card pricing-lite-card-pro">
            <span className="pricing-lite-pill">Most popular</span>
            <span className="pricing-lite-kicker">Unlimited practice</span>
            <h2>Pro</h2>
            <div className="pricing-lite-price">
              <strong>$12.99</strong>
              <span>/ month</span>
            </div>
            <p className="pricing-lite-subtitle">Practice without limits.</p>
            <ul className="pricing-lite-list">
              {proFeatures.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link className="pricing-lite-button pricing-lite-button-primary" href="/login">
              Start Pro
            </Link>
          </article>
        </section>

        <section className="pricing-lite-annual" aria-label="Annual plan">
          <div>
            <span className="pricing-lite-kicker">Save more with Annual</span>
            <h2>Pro Annual</h2>
            <p>Pay once and keep practicing all year.</p>
          </div>
          <div className="pricing-lite-annual-price">
            <del>$155.88</del>
            <strong>$79.99</strong>
            <span>/ year · $6.67 / month</span>
          </div>
          <div className="pricing-lite-annual-savings">Save 49%</div>
          <Link className="pricing-lite-button pricing-lite-button-primary pricing-lite-annual-button" href="/login">
            Get Pro
          </Link>
        </section>
      </div>
    </main>
  );
}
