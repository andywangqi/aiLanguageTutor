"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Building2, Coffee, Languages, Mic, Plane, Sparkles, Utensils, Volume2 } from "lucide-react";

type DemoScenario = {
  id: string;
  languagePair: string;
  scenario: string;
  userMessage: string;
  aiMessage: string;
  naturalPhrase: string;
  visualLabel: string;
  visualMeta: string;
  visualDetail: string;
  VisualIcon: LucideIcon;
};

type BrowserLanguage = "en" | "zh-CN" | "zh-TW" | "ja" | "th" | "ko" | "es" | "fr";

type LocalizedDemoCopy = {
  languagePair: string;
  userMessage: string;
  aiMessage?: string;
};

const demoScenarios: DemoScenario[] = [
  {
    id: "airport",
    languagePair: "English → English",
    scenario: "Airport",
    userMessage: "I need to ask where my gate is.",
    aiMessage: 'You could say, "Excuse me, where is Gate 24?"',
    naturalPhrase: "Excuse me, where is Gate 24?",
    visualLabel: "Airport help",
    visualMeta: "Tomorrow · Terminal 2",
    visualDetail: "Gate 24",
    VisualIcon: Plane
  },
  {
    id: "coffee",
    languagePair: "Japanese → English",
    scenario: "Coffee shop",
    userMessage: "このコーヒーは持ち帰りできますか？",
    aiMessage: "Can I get this coffee to go?",
    naturalPhrase: "Can I get this to go, please?",
    visualLabel: "Cafe order",
    visualMeta: "Morning · Counter",
    visualDetail: "To go",
    VisualIcon: Coffee
  },
  {
    id: "restaurant",
    languagePair: "Spanish → English",
    scenario: "Restaurant",
    userMessage: "¿Tienen opciones vegetarianas?",
    aiMessage: "Do you have any vegetarian options?",
    naturalPhrase: "Do you have any vegetarian dishes?",
    visualLabel: "Menu question",
    visualMeta: "Dinner · Ordering",
    visualDetail: "Vegetarian",
    VisualIcon: Utensils
  },
  {
    id: "hotel",
    languagePair: "French → English",
    scenario: "Hotel",
    userMessage: "Je voudrais dire que j'ai une réservation.",
    aiMessage: "I'd like to say that I have a reservation.",
    naturalPhrase: "Hi, I have a reservation under my name.",
    visualLabel: "Check-in",
    visualMeta: "Evening · Front desk",
    visualDetail: "Reservation",
    VisualIcon: Building2
  }
];

const learningFlow = ["Native language", "AI understands", "Target expression", "Speak"];

export function InteractiveDemo() {
  const [browserLanguage, setBrowserLanguage] = useState<BrowserLanguage>("en");
  const [activeId, setActiveId] = useState(demoScenarios[0].id);
  const [hasDetectedLanguage, setHasDetectedLanguage] = useState(false);
  const baseActive = demoScenarios.find((scenario) => scenario.id === activeId) ?? demoScenarios[0];
  const active = getLocalizedScenario(baseActive, browserLanguage);
  const VisualIcon = active.VisualIcon;

  useEffect(() => {
    const detected = detectBrowserLanguage();
    setBrowserLanguage(detected);
    setActiveId(defaultScenarioForLanguage(detected));
    setHasDetectedLanguage(true);
  }, []);

  return (
    <div className="demo-panel hero-product-demo" id="demo">
      <div className="demo-product-header">
        <div>
          <span className="demo-window-dot" aria-hidden="true" />
          <strong>AI Language Tutor</strong>
        </div>
        <button className="demo-language-pair" type="button" aria-label="Current language pair">
          <Languages aria-hidden="true" size={16} />
          {active.languagePair}
        </button>
      </div>

      <div className="demo-scenario-tabs" aria-label="Conversation scenario">
        {demoScenarios.map((scenario) => (
          <button
            className={scenario.id === active.id ? "active" : ""}
            type="button"
            key={scenario.id}
            onClick={() => setActiveId(scenario.id)}
          >
            {scenario.scenario}
          </button>
        ))}
      </div>

      <div className="demo-conversation" key={active.id} aria-live="polite">
        <aside className="demo-context-card" aria-label={`${active.scenario} context`}>
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
            <div className="demo-avatar">You</div>
            <div className="demo-chat-bubble user">
              <span>Tell your tutor what you mean</span>
              <strong>{active.userMessage}</strong>
            </div>
          </div>

          <div className="demo-message-row tutor">
            <div className="demo-avatar tutor">AI</div>
            <div className="demo-chat-bubble tutor">
              <span>Target-language response</span>
              <strong>{active.aiMessage}</strong>
              <div className="demo-learning-actions" aria-label="Learning actions">
                <button type="button">
                  <Volume2 aria-hidden="true" size={15} />
                  Listen
                </button>
                <button type="button">
                  <Languages aria-hidden="true" size={15} />
                  Translate
                </button>
                <button type="button">
                  <BookOpen aria-hidden="true" size={15} />
                  Learn
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-assist-card">
          <span>
            <Sparkles aria-hidden="true" size={15} />
            More natural:
          </span>
          <strong>{active.naturalPhrase}</strong>
        </div>
      </div>

      <div className="demo-practice-row">
        <button type="button">
          <Mic aria-hidden="true" size={18} />
          Practice this phrase
        </button>
        <div className="demo-mic-meter" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="demo-learning-flow" aria-label="Learning flow">
        {learningFlow.map((step, index) => (
          <span key={step}>
            {step}
            {index < learningFlow.length - 1 ? <ArrowRight aria-hidden="true" size={13} /> : null}
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

    if (normalized.startsWith("zh-tw") || normalized.startsWith("zh-hk") || normalized.startsWith("zh-mo")) {
      return "zh-TW";
    }
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

function defaultScenarioForLanguage(language: BrowserLanguage) {
  if (language === "ja") return "coffee";
  if (language === "es") return "restaurant";
  if (language === "fr") return "hotel";
  return "airport";
}

function getLocalizedScenario(scenario: DemoScenario, language: BrowserLanguage): DemoScenario {
  const copy = localizedDemoCopy[scenario.id]?.[language];
  return copy
    ? {
        ...scenario,
        languagePair: copy.languagePair,
        userMessage: copy.userMessage,
        aiMessage: copy.aiMessage ?? scenario.aiMessage
      }
    : scenario;
}

const localizedDemoCopy: Record<string, Partial<Record<BrowserLanguage, LocalizedDemoCopy>>> = {
  airport: {
    en: {
      languagePair: "English → English",
      userMessage: "I need to ask where my gate is.",
      aiMessage: 'You could say, "Excuse me, where is Gate 24?"'
    },
    "zh-CN": {
      languagePair: "Chinese → English",
      userMessage: "我明天要去机场，但是不知道怎么问登机口在哪里。"
    },
    "zh-TW": {
      languagePair: "Chinese → English",
      userMessage: "我明天要去機場，但是不知道怎麼問登機口在哪裡。"
    },
    th: {
      languagePair: "Thai → English",
      userMessage: "พรุ่งนี้ฉันจะไปสนามบิน แต่ไม่รู้ว่าจะถามว่าประตูขึ้นเครื่องอยู่ที่ไหน"
    },
    ko: {
      languagePair: "Korean → English",
      userMessage: "내일 공항에 가는데 탑승구가 어디인지 어떻게 물어봐야 할지 모르겠어요."
    }
  },
  coffee: {
    ja: {
      languagePair: "Japanese → English",
      userMessage: "このコーヒーは持ち帰りできますか？"
    },
    en: {
      languagePair: "English → English",
      userMessage: "I want to ask if I can take this coffee to go.",
      aiMessage: 'You could say, "Can I get this coffee to go, please?"'
    },
    "zh-CN": {
      languagePair: "Chinese → English",
      userMessage: "我想问这杯咖啡可以打包带走吗？"
    },
    "zh-TW": {
      languagePair: "Chinese → English",
      userMessage: "我想問這杯咖啡可以外帶嗎？"
    }
  },
  restaurant: {
    es: {
      languagePair: "Spanish → English",
      userMessage: "¿Tienen opciones vegetarianas?"
    },
    en: {
      languagePair: "English → English",
      userMessage: "I want to ask if you have vegetarian options.",
      aiMessage: 'You could say, "Do you have any vegetarian options?"'
    },
    "zh-CN": {
      languagePair: "Chinese → English",
      userMessage: "我想问你们有没有素食选择。"
    },
    "zh-TW": {
      languagePair: "Chinese → English",
      userMessage: "我想問你們有沒有素食選擇。"
    }
  },
  hotel: {
    fr: {
      languagePair: "French → English",
      userMessage: "Je voudrais dire que j'ai une réservation."
    },
    en: {
      languagePair: "English → English",
      userMessage: "I want to say that I have a reservation.",
      aiMessage: 'You could say, "Hi, I have a reservation under my name."'
    },
    "zh-CN": {
      languagePair: "Chinese → English",
      userMessage: "我想说我有一个预订。"
    },
    "zh-TW": {
      languagePair: "Chinese → English",
      userMessage: "我想說我有一個預訂。"
    }
  }
};
