"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { InteractiveDemo } from "./InteractiveDemo";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function Hero({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    void supabase.auth.getSession().then(({ data }) => { if (active) setIsAuthenticated(Boolean(data.session)); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setIsAuthenticated(Boolean(session)));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  const heroHref = isAuthenticated ? localizedPath(locale, "/app") : `${localizedPath(locale, "/login")}?next=${encodeURIComponent(localizedPath(locale, "/app"))}`;
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <MessageCircle aria-hidden="true" size={17} />
            {dictionary.hero.eyebrow}
          </p>
          <h1>{dictionary.hero.h1}</h1>
          <p className="hero-lead">{dictionary.hero.lead}</p>
          <div className="hero-actions">
            <ButtonLink
              href={heroHref}
              eventName="home_cta_clicked"
              eventProperties={{ placement: "hero", cta: "primary", destination: "login", locale }}
            >
              {dictionary.hero.primaryCta}
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
            <ButtonLink
              href={localizedPath(locale, "/pricing")}
              variant="secondary"
              eventName="home_cta_clicked"
              eventProperties={{ placement: "hero", cta: "secondary", destination: "pricing", locale }}
            >
              {dictionary.hero.secondaryCta}
            </ButtonLink>
          </div>
          <div className="hero-proof" aria-label={dictionary.nav.product}>
            {(dictionary.hero.proof ?? []).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <InteractiveDemo dictionary={dictionary} />
      </div>
    </section>
  );
}
