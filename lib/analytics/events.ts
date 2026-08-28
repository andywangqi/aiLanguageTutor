export const analyticsEvents = {
  appOpened: "app_opened",
  loginStarted: "login_started",
  pricingPageViewed: "pricing_page_viewed",
  pricingCtaClicked: "pricing_cta_clicked",
  checkoutStarted: "checkout_started",
  checkoutFailed: "checkout_failed",
  homeCtaClicked: "home_cta_clicked",
  homeDemoScenarioChanged: "home_demo_scenario_changed",
  paymentSucceeded: "payment_succeeded",
  paymentCancelled: "payment_cancelled",
  paymentFailed: "payment_failed",
  languageSwitched: "language_switched",
  logoutClicked: "logout_clicked",
  logoutSucceeded: "logout_succeeded",
  logoutFailed: "logout_failed"
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function paymentEventForStatus(status: string | null) {
  if (status === "success") return analyticsEvents.paymentSucceeded;
  if (status === "cancelled" || status === "canceled") return analyticsEvents.paymentCancelled;
  if (status === "failed" || status === "error") return analyticsEvents.paymentFailed;
  return null;
}
