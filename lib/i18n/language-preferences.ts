export const nativeLanguagePreferenceKey = "ai-tutor-native-language";

export type DemoLanguage = "English" | "Chinese" | "Japanese" | "Thai" | "Korean" | "Spanish" | "French" | "German";

const languageByBrowserPrefix: Array<[string, DemoLanguage]> = [
  ["zh-tw", "Chinese"], ["zh-hk", "Chinese"], ["zh-mo", "Chinese"], ["zh", "Chinese"],
  ["ja", "Japanese"], ["th", "Thai"], ["ko", "Korean"], ["es", "Spanish"],
  ["fr", "French"], ["de", "German"], ["en", "English"]
];

export function detectBrowserNativeLanguage(): DemoLanguage {
  if (typeof navigator === "undefined") return "English";
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    const match = languageByBrowserPrefix.find(([prefix]) => candidate.toLowerCase().startsWith(prefix));
    if (match) return match[1];
  }
  return "English";
}

export function readNativeLanguagePreference(): DemoLanguage | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(nativeLanguagePreferenceKey);
    return isDemoLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveNativeLanguagePreference(language: string) {
  if (typeof window === "undefined" || !isDemoLanguage(language)) return;
  try {
    window.localStorage.setItem(nativeLanguagePreferenceKey, language);
    window.dispatchEvent(new CustomEvent("ai-tutor-native-language-changed", { detail: language }));
  } catch {
    // A blocked localStorage must not prevent language settings from being used.
  }
}

export function isDemoLanguage(value: string | null | undefined): value is DemoLanguage {
  return value === "English" || value === "Chinese" || value === "Japanese" || value === "Thai"
    || value === "Korean" || value === "Spanish" || value === "French" || value === "German";
}
