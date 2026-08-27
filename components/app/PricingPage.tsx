"use client";

import Link from "next/link";
import { ArrowLeft, Check, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { api } from "@/lib/api/client";
import { ApiError, type BillingPlan } from "@/lib/api/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

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

const fallbackPlans: BillingPlan[] = [
  { planCode: "pro_monthly", name: "Pro", amount: 12.99, currency: "USD", interval: "month", popular: true },
  { planCode: "pro_annual", name: "Pro Annual", amount: 79.99, currency: "USD", interval: "year" }
];

function planCode(plan: BillingPlan, fallback: string) {
  return plan.planCode || plan.code || fallback;
}

function planAmount(plan: BillingPlan, fallback: string) {
  if (typeof plan.amount === "number") return `$${plan.amount.toFixed(2)}`;
  if (typeof plan.price === "number") return `$${plan.price.toFixed(2)}`;
  return fallback;
}

export function PricingPage() {
  const [plans, setPlans] = useState<BillingPlan[]>(fallbackPlans);
  const [checkoutPlan, setCheckoutPlan] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    api.billing
      .plans()
      .then((remotePlans) => {
        if (active && remotePlans.length > 0) setPlans(remotePlans);
      })
      .catch(() => {
        // The documented defaults keep the page useful while central plans are unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  const monthlyPlan = plans.find((plan) => (plan.interval || "").toLowerCase().includes("month")) || plans[0] || fallbackPlans[0];
  const annualPlan = plans.find((plan) => (plan.interval || "").toLowerCase().includes("year")) || plans[1] || fallbackPlans[1];

  async function startCheckout(plan: BillingPlan, fallbackCode: string) {
    setNotice("");
    const code = planCode(plan, fallbackCode);
    const supabase = createSupabaseBrowserClient();
    if (!supabase || !isSupabaseConfigured()) {
      setNotice("Add Supabase environment variables before starting a paid checkout.");
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      window.location.assign(`/login?next=/pricing&plan=${encodeURIComponent(code)}`);
      return;
    }

    setCheckoutPlan(code);
    try {
      const checkout = await api.billing.checkout(code, {
        successPath: "/app?payment=success",
        cancelPath: "/pricing?payment=cancelled"
      });
      const checkoutUrl = checkout.checkoutUrl || checkout.url;
      if (!checkoutUrl) {
        setNotice("Checkout is not configured yet. Please try again after Waffo is connected.");
        return;
      }
      window.location.assign(checkoutUrl);
    } catch (error) {
      setNotice(error instanceof ApiError && error.code === "PAYMENT_PENDING" ? "Checkout is waiting for the Waffo merchant configuration." : "We could not start checkout. Please try again.");
    } finally {
      setCheckoutPlan("");
    }
  }

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
            <h2>{monthlyPlan.name || "Pro"}</h2>
            <div className="pricing-lite-price">
              <strong>{planAmount(monthlyPlan, "$12.99")}</strong>
              <span>/ {monthlyPlan.interval || "month"}</span>
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
            <button className="pricing-lite-button pricing-lite-button-primary" type="button" onClick={() => startCheckout(monthlyPlan, "pro_monthly")} disabled={Boolean(checkoutPlan)}>
              {checkoutPlan === planCode(monthlyPlan, "pro_monthly") ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : null}
              Start Pro
            </button>
          </article>
        </section>

        <section className="pricing-lite-annual" aria-label="Annual plan">
          <div>
            <span className="pricing-lite-kicker">Save more with Annual</span>
            <h2>{annualPlan.name || "Pro Annual"}</h2>
            <p>Pay once and keep practicing all year.</p>
          </div>
          <div className="pricing-lite-annual-price">
            <del>$155.88</del>
            <strong>{planAmount(annualPlan, "$79.99")}</strong>
            <span>/ {annualPlan.interval || "year"} · $6.67 / month</span>
          </div>
          <div className="pricing-lite-annual-savings">Save 49%</div>
          <button className="pricing-lite-button pricing-lite-button-primary pricing-lite-annual-button" type="button" onClick={() => startCheckout(annualPlan, "pro_annual")} disabled={Boolean(checkoutPlan)}>
            {checkoutPlan === planCode(annualPlan, "pro_annual") ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : null}
            Get Pro
          </button>
        </section>
        {notice ? <p className="pricing-lite-notice" role="status">{notice}</p> : null}
      </div>
    </main>
  );
}
