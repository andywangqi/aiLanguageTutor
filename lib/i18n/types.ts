import type { Locale } from "./config";

export type TutorMode = {
  title: string;
  description: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  points?: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LandingDictionary = {
  locale: Locale;
  seo: {
    title: string;
    description: string;
  };
  nav: {
    product: string;
    method: string;
    languages: string;
    faq: string;
    app: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
  };
  demo: {
    title: string;
    tabs: {
      sayIt: string;
      talk: string;
    };
    promptLabel: string;
    prompt: string;
    responseLabel: string;
    response: string;
    actions: string[];
    turn: string;
    hint: string;
  };
  sections: {
    learn: {
      eyebrow: string;
      h2: string;
      lead: string;
      cards: FeatureCard[];
    };
    modes: {
      eyebrow: string;
      h2: string;
      lead: string;
      items: TutorMode[];
    };
    corrections: {
      eyebrow: string;
      h2: string;
      lead: string;
      points: string[];
    };
    stuck: {
      eyebrow: string;
      h2: string;
      lead: string;
      points: string[];
    };
    lesson: {
      eyebrow: string;
      h2: string;
      lead: string;
      steps: string[];
    };
    personal: {
      eyebrow: string;
      h2: string;
      lead: string;
      stats: Array<{ label: string; value: string }>;
    };
    languages: {
      eyebrow: string;
      h2: string;
      lead: string;
      items: string[];
    };
    why: {
      eyebrow: string;
      h2: string;
      lead: string;
      cards: FeatureCard[];
    };
    faq: {
      eyebrow: string;
      h2: string;
      lead: string;
      items: FaqItem[];
    };
    cta: {
      h2: string;
      lead: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
  footer: {
    brand: string;
    rights: string;
    columns: Array<{ title: string; links: string[] }>;
  };
};
