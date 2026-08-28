import { ArrowRight, MessageCircle } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { InteractiveDemo } from "./InteractiveDemo";

export function Hero({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
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
              href={localizedPath(locale, "/login")}
              eventName="home_cta_clicked"
              eventProperties={{ placement: "hero", cta: "primary", destination: "login", locale }}
            >
              {dictionary.hero.primaryCta}
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
            <ButtonLink
              href="#method"
              variant="secondary"
              eventName="home_cta_clicked"
              eventProperties={{ placement: "hero", cta: "secondary", destination: "method", locale }}
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
