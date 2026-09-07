export const analyticsEvents = {
  appOpened: "app_opened",
  loginStarted: "login_started",
  pricingPageViewed: "pricing_page_viewed",
  pricingCtaClicked: "pricing_cta_clicked",
  checkoutStarted: "checkout_started",
  checkoutFailed: "checkout_failed",
  homeCtaClicked: "home_cta_clicked",
  homeDemoScenarioChanged: "home_demo_scenario_changed",
  homeLanguageInterestClicked: "home_language_interest_clicked",
  footerLinkClicked: "footer_link_clicked",
  conversationStarted: "conversation_started",
  messageSubmitted: "message_submitted",
  voiceRecordingStarted: "voice_recording_started",
  voiceTranscribed: "voice_transcribed",
  learningCardSaved: "learning_card_saved",
  paymentSucceeded: "payment_succeeded",
  paymentCancelled: "payment_cancelled",
  paymentFailed: "payment_failed",
  languageSwitched: "language_switched",
  logoutClicked: "logout_clicked",
  logoutSucceeded: "logout_succeeded",
  logoutFailed: "logout_failed",
  readingPageViewed: "reading_page_viewed",
  readingLessonLoaded: "reading_lesson_loaded",
  readingTabViewed: "reading_tab_viewed",
  readingMaterialImportStarted: "reading_material_import_started",
  readingMaterialImported: "reading_material_imported",
  readingMaterialImportFailed: "reading_material_import_failed",
  readingQuestionAnswered: "reading_question_answered",
  readingAttemptSubmitted: "reading_attempt_submitted",
  readingNoteSaved: "reading_note_saved",
  readingAudioPlayed: "reading_audio_played",
  readingVocabularyAudioPlayed: "reading_vocabulary_audio_played"
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function paymentEventForStatus(status: string | null) {
  if (status === "cancelled" || status === "canceled") return analyticsEvents.paymentCancelled;
  if (status === "failed" || status === "error") return analyticsEvents.paymentFailed;
  return null;
}
