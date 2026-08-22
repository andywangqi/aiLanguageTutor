"use client";

import { useState } from "react";
import { Languages, Mic, Sparkles, Volume2 } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";

type DemoMode = "sayIt" | "talk";

export function InteractiveDemo({ dictionary }: { dictionary: LandingDictionary }) {
  const [mode, setMode] = useState<DemoMode>("sayIt");
  const isSayIt = mode === "sayIt";
  const prompt = isSayIt ? "我明天可能会迟到。" : "What did you do this weekend?";
  const response = isSayIt
    ? dictionary.demo.response
    : "I went to a small cafe and practiced ordering in English. Nice work. Try: “I ordered coffee without checking the menu.”";

  return (
    <div className="demo-panel" id="demo">
      <div className="demo-topline">
        <span>{dictionary.demo.title}</span>
        <span className="live-dot">Live</span>
      </div>

      <div className="segmented-control" aria-label="Tutor mode">
        <button className={isSayIt ? "active" : ""} type="button" onClick={() => setMode("sayIt")}>
          {dictionary.demo.tabs.sayIt}
        </button>
        <button className={!isSayIt ? "active" : ""} type="button" onClick={() => setMode("talk")}>
          {dictionary.demo.tabs.talk}
        </button>
      </div>

      <div className="message-stack">
        <div className="message message-user">
          <small>{dictionary.demo.promptLabel}</small>
          <strong>{prompt}</strong>
        </div>
        <div className="message message-tutor">
          <small>{dictionary.demo.responseLabel}</small>
          <strong>{response}</strong>
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
          <strong>{dictionary.demo.hint}</strong>
        </div>
        <button type="button" aria-label="Start speaking">
          <Sparkles aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
