"use client";

import { useState } from "react";
import { Languages, Mic, Sparkles, Volume2 } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";

type DemoMode = "sayIt" | "talk" | "practice";

const demoModes: Record<
  DemoMode,
  {
    prompt: string;
    response: string;
    detailLabel: string;
    detail: string;
    hint: string;
  }
> = {
  sayIt: {
    prompt: "我明天可能会迟到。",
    response: "I might be late tomorrow.",
    detailLabel: "Translation",
    detail: "我明天可能会迟到。",
    hint: "Say the sentence in your own language, then hear the natural version."
  },
  talk: {
    prompt: "What did you do this weekend?",
    response: "I went to a small cafe and practiced ordering in English. What about you?",
    detailLabel: "Keep going",
    detail: "Ask a follow-up and keep the conversation moving.",
    hint: "Use the language you're learning while the tutor keeps the chat alive."
  },
  practice: {
    prompt: "I go there yesterday.",
    response: "I went there yesterday.",
    detailLabel: "Correction",
    detail: "Use went because yesterday is already in the past.",
    hint: "See the correction, understand it, and try again."
  }
};

export function InteractiveDemo({ dictionary }: { dictionary: LandingDictionary }) {
  const [mode, setMode] = useState<DemoMode>("sayIt");
  const active = demoModes[mode];

  return (
    <div className="demo-panel" id="demo">
      <div className="demo-topline">
        <span>{dictionary.demo.title}</span>
        <span className="live-dot">Live</span>
      </div>

      <div className="segmented-control" aria-label="Tutor mode">
        <button className={mode === "sayIt" ? "active" : ""} type="button" onClick={() => setMode("sayIt")}>
          {dictionary.demo.tabs.sayIt}
        </button>
        <button className={mode === "talk" ? "active" : ""} type="button" onClick={() => setMode("talk")}>
          {dictionary.demo.tabs.talk}
        </button>
        <button className={mode === "practice" ? "active" : ""} type="button" onClick={() => setMode("practice")}>
          {dictionary.demo.tabs.practice}
        </button>
      </div>

      <div className="message-stack">
        <div className="message message-user">
          <small>{dictionary.demo.promptLabel}</small>
          <strong>{active.prompt}</strong>
        </div>
        <div className="message message-tutor">
          <small>{dictionary.demo.responseLabel}</small>
          <strong>{active.response}</strong>
          <div className="demo-insight">
            <span className="demo-insight-label">{active.detailLabel}</span>
            <p>{active.detail}</p>
          </div>
          <div className="demo-actions" aria-label="Tutor actions">
            <span>
              <Volume2 aria-hidden="true" size={15} />
              {dictionary.demo.actions[0]}
            </span>
            <span>
              <Languages aria-hidden="true" size={15} />
              {dictionary.demo.actions[1]}
            </span>
            <span>
              <Mic aria-hidden="true" size={15} />
              {dictionary.demo.actions[2]}
            </span>
          </div>
        </div>
      </div>

      <div className="practice-bar">
        <div>
          <span>{dictionary.demo.turn}</span>
          <strong>{active.hint}</strong>
        </div>
        <button type="button" aria-label="Start speaking">
          <Sparkles aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
