import { ArrowRight, MessageCircle } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { InteractiveDemo } from "./InteractiveDemo";

export function Hero({ dictionary }: { dictionary: LandingDictionary }) {
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
            <ButtonLink href="/login">
              {dictionary.hero.primaryCta}
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
            <ButtonLink href="#method" variant="secondary">
              {dictionary.hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
        <InteractiveDemo dictionary={dictionary} />
      </div>
    </section>
  );
}
