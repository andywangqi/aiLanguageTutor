"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Building2, Coffee, Languages, Mic, Plane, Sparkles, Utensils, Volume2 } from "lucide-react";
import type { DemoScenario, LandingDictionary } from "@/lib/i18n/types";
import { trackEvent } from "@/lib/analytics/client";
import { detectBrowserNativeLanguage, readNativeLanguagePreference, type DemoLanguage, isDemoLanguage } from "@/lib/i18n/language-preferences";

type BrowserLanguage = "en" | "zh-CN" | "zh-TW" | "ja" | "th" | "ko" | "es" | "fr";

const icons: Record<DemoScenario["id"], LucideIcon> = {
  airport: Plane,
  coffee: Coffee,
  restaurant: Utensils,
  hotel: Building2
};

export function InteractiveDemo({ dictionary }: { dictionary: LandingDictionary }) {
  const demo = dictionary.product.demo;
  const [browserLanguage, setBrowserLanguage] = useState<BrowserLanguage>("en");
  const [nativeLanguage, setNativeLanguage] = useState<DemoLanguage>("English");
  const [activeId, setActiveId] = useState<DemoScenario["id"]>("airport");
  const [hasDetectedLanguage, setHasDetectedLanguage] = useState(false);
  const baseActive = demo.scenarios.find((scenario) => scenario.id === activeId) ?? demo.scenarios[0];
  const active = getLocalizedScenario(baseActive, browserLanguage, nativeLanguage);
  const VisualIcon = icons[active.id];

  function selectScenario(nextId: DemoScenario["id"]) {
    if (nextId === activeId) return;

    void trackEvent("home_demo_scenario_changed", {
      from_scenario: activeId,
      to_scenario: nextId,
      browser_language: browserLanguage,
      native_language: nativeLanguage,
      locale: dictionary.locale
    });
    setActiveId(nextId);
  }

  useEffect(() => {
    const detected = detectBrowserLanguage();
    setBrowserLanguage(detected);
    setNativeLanguage(readNativeLanguagePreference() || detectBrowserNativeLanguage());
    setActiveId(defaultScenarioForLanguage(detected));
    setHasDetectedLanguage(true);

    const handleNativeLanguageChange = (event: Event) => {
      const language = (event as CustomEvent<string>).detail;
      if (isDemoLanguage(language)) setNativeLanguage(language);
    };
    window.addEventListener("ai-tutor-native-language-changed", handleNativeLanguageChange);
    return () => window.removeEventListener("ai-tutor-native-language-changed", handleNativeLanguageChange);
  }, []);

  return (
    <div className="demo-panel hero-product-demo" id="demo">
      <div className="demo-product-header">
        <div>
          <span className="demo-window-dot" aria-hidden="true" />
          <strong>{demo.productName}</strong>
        </div>
        <button className="demo-language-pair" type="button" aria-label={demo.languagePairLabel}>
          <Languages aria-hidden="true" size={16} />
          {active.languagePair}
        </button>
      </div>

      <div className="demo-scenario-tabs" aria-label={demo.scenarioLabel}>
        {demo.scenarios.map((scenario) => (
          <button
            className={scenario.id === active.id ? "active" : ""}
            type="button"
            key={scenario.id}
            onClick={() => selectScenario(scenario.id)}
          >
            {scenario.scenario}
          </button>
        ))}
      </div>

      <div className="demo-conversation" key={active.id} aria-live="polite">
        <aside className="demo-context-card" aria-label={`${active.scenario} ${demo.contextLabel}`}>
          <span className="demo-context-icon">
            <VisualIcon aria-hidden="true" size={20} />
          </span>
          <div>
            <span>{active.visualLabel}</span>
            <strong>{active.visualDetail}</strong>
            <small>{active.visualMeta}</small>
          </div>
        </aside>

        <div className="demo-message-stack" data-language-detected={hasDetectedLanguage}>
          <div className="demo-message-row user">
            <div className="demo-avatar">{demo.userLabel}</div>
            <div className="demo-chat-bubble user">
              <span>{demo.userInstruction}</span>
              <strong>{active.userMessage}</strong>
            </div>
          </div>

          <div className="demo-message-row tutor">
            <div className="demo-avatar tutor">AI</div>
            <div className="demo-chat-bubble tutor">
              <span>{demo.responseLabel}</span>
              <strong>{active.aiMessage}</strong>
              <div className="demo-learning-actions" aria-label={demo.actions.join(", ")}>
                <button type="button">
                  <Volume2 aria-hidden="true" size={15} />
                  {demo.actions[0]}
                </button>
                <button type="button">
                  <Languages aria-hidden="true" size={15} />
                  {demo.actions[1]}
                </button>
                <button type="button">
                  <BookOpen aria-hidden="true" size={15} />
                  {demo.actions[2]}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-assist-card">
          <span>
            <Sparkles aria-hidden="true" size={15} />
            {demo.moreNaturalLabel}
          </span>
          <strong>{active.naturalPhrase}</strong>
        </div>
      </div>

      <div className="demo-practice-row">
        <button type="button">
          <Mic aria-hidden="true" size={18} />
          {demo.practiceCta}
        </button>
        <div className="demo-mic-meter" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="demo-learning-flow" aria-label={demo.learningFlow.join(" → ")}>
        {demo.learningFlow.map((step, index) => (
          <span key={step}>
            {step}
            {index < demo.learningFlow.length - 1 ? <ArrowRight aria-hidden="true" size={13} /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function detectBrowserLanguage(): BrowserLanguage {
  if (typeof navigator === "undefined") return "en";

  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    if (normalized.startsWith("zh-tw") || normalized.startsWith("zh-hk") || normalized.startsWith("zh-mo")) return "zh-TW";
    if (normalized.startsWith("zh")) return "zh-CN";
    if (normalized.startsWith("ja")) return "ja";
    if (normalized.startsWith("th")) return "th";
    if (normalized.startsWith("ko")) return "ko";
    if (normalized.startsWith("es")) return "es";
    if (normalized.startsWith("fr")) return "fr";
    if (normalized.startsWith("en")) return "en";
  }

  return "en";
}

function defaultScenarioForLanguage(language: BrowserLanguage): DemoScenario["id"] {
  if (language === "ja") return "coffee";
  if (language === "es") return "restaurant";
  if (language === "fr") return "hotel";
  return "airport";
}

function getLocalizedScenario(scenario: DemoScenario, language: BrowserLanguage, nativeLanguage: DemoLanguage): DemoScenario {
  const copy = scenario.browserCopy?.[language];
  const localized = copy
    ? {
        ...scenario,
        languagePair: copy.languagePair,
        userMessage: copy.userMessage,
        aiMessage: copy.aiMessage ?? scenario.aiMessage
      }
    : scenario;
  return { ...localized, languagePair: `${nativeLanguage} → English` };
}
