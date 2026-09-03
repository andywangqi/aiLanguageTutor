"use client";

import Link from "next/link";
import { ArrowLeft, Check, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { api } from "@/lib/api/client";
import { ApiError, type BillingPlan } from "@/lib/api/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { paymentEventForStatus } from "@/lib/analytics/events";
import { trackEvent, trackEventOnce } from "@/lib/analytics/client";

const fallbackPlans: BillingPlan[] = [
  { planCode: "pro_monthly", name: "Pro", amount: 12.99, currency: "USD", interval: "month", popular: true },
  { planCode: "pro_annual", name: "Pro Annual", amount: 79.99, currency: "USD", interval: "year" }
];

function planCode(plan: BillingPlan, fallback: string) {
  return plan.planCode || plan.code || fallback;
}

function planNumericAmount(plan: BillingPlan) {
  if (typeof plan.amount === "number" && Number.isFinite(plan.amount)) return plan.amount;
  if (typeof plan.price === "number" && Number.isFinite(plan.price)) return plan.price;
  return null;
}

function formatCurrency(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function planAmount(plan: BillingPlan, fallback: string) {
  const amount = planNumericAmount(plan);
  if (amount !== null) return formatCurrency(amount, plan.currency || "USD");
  return fallback;
}

function replacePercentage(copy: string, percentage: number) {
  return /\d+%/.test(copy) ? copy.replace(/\d+%/, `${percentage}%`) : copy;
}

export function PricingPage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const copy = dictionary.product.pricing;
  const [plans, setPlans] = useState<BillingPlan[]>(fallbackPlans);
  const [checkoutPlan, setCheckoutPlan] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState("");
  const [paymentUnavailable, setPaymentUnavailable] = useState(false);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const checkoutInFlight = useRef(false);
  const paymentStatusTracked = useRef("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    void trackEventOnce(`pricing_page_viewed:${locale}:${window.location.pathname}`, "pricing_page_viewed", {
      locale,
      selected_plan: params.get("plan") || undefined
    });
  }, [locale]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment");
    const event = paymentEventForStatus(status);
    if (!event) return;

    const plan = params.get("plan") || "unknown";
    const key = `${event}:${locale}:${plan}`;
    if (paymentStatusTracked.current === key) return;
    paymentStatusTracked.current = key;
    void trackEventOnce(key, event, { locale, plan_code: plan, payment_status: status });
  }, [locale]);

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
  const monthlyAmount = planNumericAmount(monthlyPlan);
  const annualAmount = planNumericAmount(annualPlan);
  const annualOriginal = monthlyAmount === null ? null : monthlyAmount * 12;
  const annualSavingsPercent = annualOriginal && annualAmount !== null
    ? Math.max(0, Math.round((1 - annualAmount / annualOriginal) * 100))
    : null;

  async function startCheckout(plan: BillingPlan, fallbackCode: string) {
    if (checkoutInFlight.current) return;
    checkoutInFlight.current = true;
    setNotice("");
    setPendingCheckoutUrl("");
    const code = planCode(plan, fallbackCode);
    void trackEvent("pricing_cta_clicked", {
      locale,
      plan_code: code,
      plan_name: plan.name || code,
      billing_interval: plan.interval || fallbackCode.replace("pro_", "")
    });
    const supabase = createSupabaseBrowserClient();
    if (!supabase || !isSupabaseConfigured()) {
      void trackEvent("checkout_failed", { locale, plan_code: code, stage: "configuration" });
      setNotice(copy.supabaseNotice);
      checkoutInFlight.current = false;
      return;
    }

    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      popup?.close();
      checkoutInFlight.current = false;
      const next = localizedPath(locale, `/pricing?plan=${encodeURIComponent(code)}`);
      window.location.assign(`${localizedPath(locale, "/login")}?next=${encodeURIComponent(next)}`);
      return;
    }

    setCheckoutPlan(code);
    void trackEvent("checkout_started", {
      locale,
      plan_code: code,
      plan_name: plan.name || code,
      billing_interval: plan.interval || fallbackCode.replace("pro_", "")
    });
    try {
      const checkout = await api.billing.checkout(code, {
        successPath: localizedPath(locale, "/app"),
        cancelPath: localizedPath(locale, `/pricing?payment=cancelled&plan=${encodeURIComponent(code)}`)
      });
      const checkoutUrl = checkout.checkoutUrl || checkout.url;
      if (!checkoutUrl) {
        void trackEvent("checkout_failed", { locale, plan_code: code, stage: "missing_checkout_url" });
        setNotice(copy.pendingNotice);
        popup?.close();
        return;
      }
      if (popup) popup.location.href = checkoutUrl;
      else {
        setPendingCheckoutUrl(checkoutUrl);
        setNotice(copy.popupBlockedNotice);
      }
    } catch (error) {
      popup?.close();
      void trackEvent("checkout_failed", {
        locale,
        plan_code: code,
        stage: "request",
        error_code: error instanceof ApiError ? error.code : "UNKNOWN_ERROR"
      });
      const errorCode = error instanceof ApiError ? error.code : "";
      if (errorCode === "PAYMENT_NOT_CONFIGURED" || errorCode === "PRODUCT_NOT_CONFIGURED") setPaymentUnavailable(true);
      if (errorCode === "CHECKOUT_IN_PROGRESS") setCheckoutInProgress(true);
      setNotice(
        ["PAYMENT_NOT_CONFIGURED", "PRODUCT_NOT_CONFIGURED", "CHECKOUT_IN_PROGRESS", "CHECKOUT_ALREADY_CREATED"].includes(errorCode)
          ? copy.pendingNotice
          : copy.checkoutNotice
      );
    } finally {
      checkoutInFlight.current = false;
      setCheckoutPlan("");
    }
  }

  return (
    <main className="pricing-lite-page">
      <header className="pricing-lite-header">
        <BrandMark href={localizedPath(locale, "/")} />
        <div className="pricing-lite-header-actions">
          <LanguageSwitcher currentLocale={locale} />
          <Link className="pricing-lite-back" href={localizedPath(locale, "/app")}>
            <ArrowLeft size={17} aria-hidden="true" />
            {copy.back}
          </Link>
        </div>
      </header>

      <div className="pricing-lite-shell container">
        <section className="pricing-lite-hero" aria-labelledby="pricing-lite-title">
          <p className="pricing-lite-eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h1 id="pricing-lite-title">{copy.title}</h1>
          <p className="pricing-lite-lead">{copy.lead}</p>
        </section>

        <section className="pricing-lite-grid" aria-label={copy.plansLabel}>
          <article className="pricing-lite-card pricing-lite-card-free">
            <span className="pricing-lite-kicker">{copy.freeKicker}</span>
            <h2>{copy.freeName}</h2>
            <div className="pricing-lite-price">
              <strong>{copy.freePrice}</strong>
              <span>{copy.freeTerm}</span>
            </div>
            <p className="pricing-lite-subtitle">{copy.freeSubtitle}</p>
            <ul className="pricing-lite-list">
              {copy.freeFeatures.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="pricing-lite-note">{copy.freeNote}</p>
            <Link className="pricing-lite-button pricing-lite-button-secondary" href={localizedPath(locale, "/app")}>
              {copy.freeCta}
            </Link>
          </article>

          <article className="pricing-lite-card pricing-lite-card-pro">
            <span className="pricing-lite-pill">{copy.proBadge}</span>
            <span className="pricing-lite-kicker">{copy.proKicker}</span>
            <h2>{monthlyPlan.name || copy.proName}</h2>
            <div className="pricing-lite-price">
              <strong>{planAmount(monthlyPlan, copy.proFallbackPrice)}</strong>
              <span>/ {copy.month}</span>
            </div>
            <p className="pricing-lite-subtitle">{copy.proSubtitle}</p>
            <ul className="pricing-lite-list">
              {copy.proFeatures.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="pricing-lite-button pricing-lite-button-primary" type="button" onClick={() => startCheckout(monthlyPlan, "pro_monthly")} disabled={Boolean(checkoutPlan) || paymentUnavailable || checkoutInProgress}>
              {checkoutPlan === planCode(monthlyPlan, "pro_monthly") ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : null}
              {copy.proCta}
            </button>
          </article>
        </section>

        <section className="pricing-lite-annual" aria-label={copy.annualName}>
          <div>
            <span className="pricing-lite-kicker">{copy.annualKicker}</span>
            <h2>{annualPlan.name || copy.annualName}</h2>
            <p>{copy.annualDescription}</p>
          </div>
          <div className="pricing-lite-annual-price">
             {annualOriginal !== null && annualAmount !== null && annualOriginal > annualAmount ? <del>{formatCurrency(annualOriginal, annualPlan.currency || monthlyPlan.currency || "USD")}</del> : null}
             <strong>{planAmount(annualPlan, copy.annualFallbackPrice)}</strong>
             <span>/ {copy.year}{annualAmount !== null ? ` · ${formatCurrency(annualAmount / 12, annualPlan.currency || "USD")} / ${copy.month}` : ` · ${copy.monthEquivalent}`}</span>
           </div>
           <div className="pricing-lite-annual-savings">{annualSavingsPercent !== null ? replacePercentage(copy.annualSavings, annualSavingsPercent) : copy.annualSavings}</div>
          <button className="pricing-lite-button pricing-lite-button-primary pricing-lite-annual-button" type="button" onClick={() => startCheckout(annualPlan, "pro_annual")} disabled={Boolean(checkoutPlan) || paymentUnavailable || checkoutInProgress}>
            {checkoutPlan === planCode(annualPlan, "pro_annual") ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : null}
            {copy.annualCta}
          </button>
        </section>
        {notice ? <p className="pricing-lite-notice" role="status">
          {notice}
          {pendingCheckoutUrl ? <> <a href={pendingCheckoutUrl} target="_blank" rel="noopener noreferrer">{copy.openCheckout}</a></> : null}
        </p> : null}
      </div>
    </main>
  );
}
