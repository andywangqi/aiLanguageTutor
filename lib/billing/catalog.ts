import type { BillingPlan } from "../api/types";

// Local catalog is also the initial display; remote billing remains authoritative.
export const trialMinutes = 1;
export const monthlyUsd = 12.99;
export const annualUsd = 79.99;
export const defaultPlans: BillingPlan[] = [
  { code: "free", planCode: "free", name: "Free", type: "free", currency: "USD", amount: 0, interval: "trial", description: `${trialMinutes}-minute introductory trial`, features: [`${trialMinutes}-minute AI conversation`, "Voice input", "Translation", "Repeat Check"] },
  { code: "pro_monthly", planCode: "pro_monthly", name: "Pro", type: "subscription", currency: "USD", amount: monthlyUsd, interval: "month", features: ["AI conversations", "Translation", "Repeat Check", "On-demand grammar help"] },
  { code: "pro_annual", planCode: "pro_annual", name: "Pro Annual", type: "subscription", currency: "USD", amount: annualUsd, interval: "year", features: ["Everything in Pro", "Annual billing"] }
];

export function paidPlan(plans: BillingPlan[], period: "month" | "year") {
  return plans.find((plan) => {
    const interval = (plan.interval || plan.billingInterval || "").toLowerCase();
    const amount = plan.amount ?? plan.price;
    return plan.isActive !== false && Boolean(plan.planCode || plan.code) &&
      typeof amount === "number" && Number.isFinite(amount) && amount > 0 &&
      (period === "month" ? ["month", "monthly"].includes(interval) : ["year", "yearly", "annual"].includes(interval));
  });
}
