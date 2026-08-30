import { localizedPath, type Locale } from "./i18n/config";
import { getFooterCopy } from "./i18n/footer-copy";
import type { LandingDictionary } from "./i18n/types";
import type { InfoSectionCopy } from "./i18n/info-types";

export const contentRoutes = {
  practice: ["talk", "get-help", "pronunciation", "vocabulary"],
  learn: ["conversation-topics", "learning-tips", "practice-guide", "blog"],
  company: ["about", "careers"],
  legal: ["cookies"]
} as const;

export type ContentCategory = keyof typeof contentRoutes;
export type ContentSlug = (typeof contentRoutes)[ContentCategory][number];

export type ContentCard = {
  label?: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
};

export type ContentCallout = {
  title: string;
  body: string;
  href: string;
  cta: string;
};

export type ContentPageCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  updated: string;
  sections: InfoSectionCopy[];
  cards?: ContentCard[];
  callout?: ContentCallout;
};

const updatedLabel = "August 30, 2026";

function storyCards(dictionary: LandingDictionary) {
  return dictionary.product.home.storySamples.map((sample) => ({
    label: sample.badge,
    title: sample.prompt,
    body: sample.response,
    cta: sample.actions[0]
  }));
}

export function getContentPageCopy(
  dictionary: LandingDictionary,
  locale: Locale,
  category: ContentCategory,
  slug: ContentSlug
): ContentPageCopy | null {
  const footer = getFooterCopy(locale);

  switch (`${category}/${slug}`) {
    case "practice/talk":
      return {
        eyebrow: footer.columns[0]?.title ?? "Practice",
        title: footer.columns[0]?.links[0]?.label ?? "Talk",
        lead: dictionary.sections.learn.lead,
        updated: updatedLabel,
        sections: dictionary.sections.learn.cards.map((card) => ({ title: card.title, paragraphs: [card.description] })),
        callout: {
          title: dictionary.product.workbench.startConversation,
          body: "Open the workbench and keep a real conversation moving while you practice speaking.",
          href: localizedPath(locale, "/app"),
          cta: dictionary.hero.primaryCta
        }
      };
    case "practice/get-help":
      return {
        eyebrow: footer.columns[0]?.title ?? "Practice",
        title: footer.columns[0]?.links[1]?.label ?? "Get Help",
        lead: dictionary.sections.modes.lead,
        updated: updatedLabel,
        sections: dictionary.sections.modes.items.map((item) => ({ title: item.title, paragraphs: [item.description] })),
        callout: {
          title: dictionary.sections.modes.items[0]?.title ?? "Help me say it",
          body: "Use your own language first, then let the Tutor show you the natural phrase in the language you are learning.",
          href: localizedPath(locale, "/app"),
          cta: dictionary.hero.primaryCta
        }
      };
    case "practice/pronunciation":
      return {
        eyebrow: footer.columns[0]?.title ?? "Practice",
        title: footer.columns[0]?.links[2]?.label ?? "Pronunciation",
        lead: dictionary.sections.stuck.lead,
        updated: updatedLabel,
        sections: [
          {
            title: dictionary.product.home.pronunciation.feedbackLabel,
            paragraphs: [dictionary.product.home.pronunciation.feedbackTitle, dictionary.product.home.pronunciation.feedbackBody]
          },
          {
            title: dictionary.product.home.pronunciation.label,
            paragraphs: [dictionary.product.home.pronunciation.copy]
          },
          {
            title: dictionary.product.home.pronunciation.ariaSyllables,
            bullets: dictionary.product.home.pronunciation.syllables
          }
        ],
        callout: {
          title: dictionary.product.home.pronunciation.cta,
          body: "Listen, repeat, and use the feedback to make your next attempt feel more natural.",
          href: localizedPath(locale, "/app"),
          cta: dictionary.hero.primaryCta
        }
      };
    case "practice/vocabulary":
      return {
        eyebrow: footer.columns[0]?.title ?? "Practice",
        title: footer.columns[0]?.links[3]?.label ?? "Vocabulary",
        lead: dictionary.sections.lesson.lead,
        updated: updatedLabel,
        sections: [
          {
            title: dictionary.product.home.vocabulary.label,
            paragraphs: [dictionary.product.home.vocabulary.note]
          },
          {
            title: dictionary.product.home.vocabulary.ariaLabel,
            bullets: dictionary.product.home.vocabulary.rows.map((row) => `${row.word} — ${row.meaning}`)
          },
          {
            title: dictionary.sections.personal.h2,
            paragraphs: [dictionary.sections.personal.lead]
          }
        ],
        cards: dictionary.product.home.vocabulary.rows.map((row) => ({
          label: row.practice,
          title: row.word,
          body: row.meaning,
          href: localizedPath(locale, "/app"),
          cta: dictionary.product.home.vocabulary.rows.length > 1 ? "Start practicing" : undefined
        }))
      };
    case "learn/conversation-topics":
      return {
        eyebrow: footer.columns[1]?.title ?? "Learn",
        title: footer.columns[1]?.links[0]?.label ?? "Conversation Topics",
        lead: dictionary.sections.languages.lead,
        updated: updatedLabel,
        sections: [
          {
            title: dictionary.sections.languages.h2,
            paragraphs: [dictionary.sections.languages.lead]
          },
          {
            title: "Scenario examples",
            bullets: dictionary.product.home.storySamples.map((sample) => `${sample.badge}: ${sample.prompt}`)
          }
        ],
        cards: storyCards(dictionary).map((card) => ({
          ...card,
          href: localizedPath(locale, "/app"),
          cta: dictionary.hero.primaryCta
        }))
      };
    case "learn/learning-tips":
      return {
        eyebrow: footer.columns[1]?.title ?? "Learn",
        title: footer.columns[1]?.links[1]?.label ?? "Learning Tips",
        lead: dictionary.sections.personal.lead,
        updated: updatedLabel,
        sections: [
          {
            title: dictionary.sections.personal.h2,
            paragraphs: [dictionary.sections.personal.lead]
          },
          {
            title: dictionary.sections.personal.eyebrow,
            bullets: dictionary.sections.personal.stats.map((item) => `${item.label}: ${item.value}`)
          },
          {
            title: dictionary.product.home.flowSteps[0] ?? "Speak",
            bullets: dictionary.product.home.flowSteps
          }
        ]
      };
    case "learn/practice-guide":
      return {
        eyebrow: footer.columns[1]?.title ?? "Learn",
        title: footer.columns[1]?.links[2]?.label ?? "Practice Guide",
        lead: dictionary.product.home.flowNote,
        updated: updatedLabel,
        sections: [
          {
            title: "How to start",
            bullets: [
              "Pick the language you want to speak.",
              "Tell the Tutor what you mean in your own language.",
              "Listen to the natural response and repeat it aloud.",
              "Keep the conversation going and save useful phrases."
            ]
          },
          {
            title: dictionary.sections.learn.h2,
            paragraphs: [dictionary.sections.learn.lead]
          },
          {
            title: dictionary.sections.modes.h2,
            paragraphs: [dictionary.sections.modes.lead]
          }
        ],
        callout: {
          title: dictionary.product.home.flowSteps.join(" → "),
          body: "Use this sequence every time you open the app so practice stays simple and repeatable.",
          href: localizedPath(locale, "/app"),
          cta: dictionary.hero.primaryCta
        }
      };
    case "learn/blog":
      return {
        eyebrow: footer.columns[1]?.title ?? "Learn",
        title: footer.columns[1]?.links[3]?.label ?? "Blog",
        lead: dictionary.sections.why.lead,
        updated: updatedLabel,
        sections: [
          {
            title: "What we write about",
            bullets: [
              "Turning native-language thoughts into natural target-language sentences.",
              "How to keep a speaking habit without building a huge study plan.",
              "When to listen, repeat, save, and move on instead of over-studying one line."
            ]
          },
          {
            title: dictionary.sections.why.h2,
            paragraphs: [dictionary.sections.why.lead]
          }
        ],
        cards: dictionary.sections.why.cards.map((card, index) => ({
          label: index === 0 ? "Guide" : index === 1 ? "Tip" : "Why it helps",
          title: card.title,
          body: card.description,
          href: localizedPath(locale, "/learn/practice-guide"),
          cta: dictionary.hero.secondaryCta
        }))
      };
    case "company/about":
      return {
        eyebrow: footer.columns[2]?.title ?? "Company",
        title: footer.columns[2]?.links[0]?.label ?? "About Us",
        lead: dictionary.sections.why.lead,
        updated: updatedLabel,
        sections: [
          {
            title: dictionary.sections.why.h2,
            paragraphs: [dictionary.sections.why.lead]
          },
          {
            title: dictionary.sections.personal.h2,
            paragraphs: [dictionary.sections.personal.lead]
          }
        ],
        cards: dictionary.sections.why.cards.map((card) => ({
          title: card.title,
          body: card.description,
          href: localizedPath(locale, "/learn/practice-guide"),
          cta: dictionary.hero.secondaryCta
        }))
      };
    case "company/careers":
      return {
        eyebrow: footer.columns[2]?.title ?? "Company",
        title: footer.columns[2]?.links[2]?.label ?? "Careers",
        lead: "We are building a small, focused team around conversation-first language learning.",
        updated: updatedLabel,
        sections: [
          {
            title: "What matters here",
            bullets: [
              "Clear product thinking and careful writing.",
              "Respect for local language habits and learning styles.",
              "Practical work on a product people use every day.",
              "A willingness to ship small, useful improvements quickly."
            ]
          },
          {
            title: "Not hiring yet?",
            paragraphs: ["If the right role is not open right now, you can still send a note and tell us what you would love to build."]
          }
        ],
        callout: {
          title: "Reach out anytime",
          body: "We are happy to hear from product, design, and engineering people who care about language learning.",
          href: localizedPath(locale, "/contact"),
          cta: footer.columns[2]?.links[1]?.label ?? "Contact"
        }
      };
    case "legal/cookies":
      return {
        eyebrow: footer.columns[3]?.title ?? "Legal",
        title: footer.columns[3]?.links[2]?.label ?? "Cookies",
        lead: "This page explains how we use cookies and similar storage to keep the site working and remember your preferences.",
        updated: updatedLabel,
        sections: [
          {
            title: "What we use",
            bullets: [
              "Essential cookies and browser storage that keep you signed in and preserve the page state.",
              "Language and display preferences so the site feels consistent when you return.",
              "Analytics signals that help us understand traffic, conversions, and broken flows.",
              "Payment and authentication session data when those features are enabled."
            ]
          },
          {
            title: "Your choices",
            paragraphs: [
              "You can clear cookies in your browser at any time, but some features may stop working until you sign in again or set your preferences once more.",
              "If we add a dedicated cookie control in the future, we will link it here and explain the options more clearly."
            ]
          }
        ]
      };
    default:
      return null;
  }
}

export function getContentPagePath(category: ContentCategory, slug: ContentSlug) {
  return `/${category}/${slug}`;
}

export function getContentPageTitle(dictionary: LandingDictionary, locale: Locale, category: ContentCategory, slug: ContentSlug) {
  const footer = getFooterCopy(locale);
  const labels = footer.columns;

  switch (`${category}/${slug}`) {
    case "practice/talk":
      return labels[0]?.links[0]?.label ?? "Talk";
    case "practice/get-help":
      return labels[0]?.links[1]?.label ?? "Get Help";
    case "practice/pronunciation":
      return labels[0]?.links[2]?.label ?? "Pronunciation";
    case "practice/vocabulary":
      return labels[0]?.links[3]?.label ?? "Vocabulary";
    case "learn/conversation-topics":
      return labels[1]?.links[0]?.label ?? "Conversation Topics";
    case "learn/learning-tips":
      return labels[1]?.links[1]?.label ?? "Learning Tips";
    case "learn/practice-guide":
      return labels[1]?.links[2]?.label ?? "Practice Guide";
    case "learn/blog":
      return labels[1]?.links[3]?.label ?? "Blog";
    case "company/about":
      return labels[2]?.links[0]?.label ?? "About Us";
    case "company/careers":
      return labels[2]?.links[2]?.label ?? "Careers";
    case "legal/cookies":
      return labels[3]?.links[2]?.label ?? "Cookies";
    default:
      return dictionary.seo.title;
  }
}






