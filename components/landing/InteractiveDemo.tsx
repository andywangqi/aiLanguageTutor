"use client";

import { useState } from "react";
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

const demoScenarios: DemoScenario[] = [
  {
    id: "airport",
    languagePair: "Chinese → English",
    scenario: "Airport",
    userMessage: "我明天要去机场，但是不知道怎么问登机口在哪里。",
    aiMessage: "I'm going to the airport tomorrow, but I don't know how to ask where my gate is.",
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
  const [activeId, setActiveId] = useState(demoScenarios[0].id);
  const active = demoScenarios.find((scenario) => scenario.id === activeId) ?? demoScenarios[0];
  const VisualIcon = active.VisualIcon;

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

        <div className="demo-message-stack">
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
