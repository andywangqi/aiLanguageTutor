import Link from "next/link";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Target,
  Volume2
} from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { SectionHeading } from "./SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";

const flowSteps = ["Speak", "Understand", "Practice"];
const pronunciationBars = [34, 58, 72, 48, 64, 52, 76, 44];
const vocabRows = [
  { word: "delayed", meaning: "延迟的", practice: "Say it" },
  { word: "reservation", meaning: "预订", practice: "Say it" },
  { word: "crowded", meaning: "拥挤的", practice: "Say it" }
];
const memoryRows = [
  { label: "New phrases", value: "3" },
  { label: "Corrections", value: "2" },
  { label: "Words learned", value: "5" }
];
const benefitIcons = [Sparkles, Target, MessageSquareText];

const storySamples = [
  {
    badge: "Talk",
    prompt: "I go to Tokyo with my friend.",
    response:
      "A more natural way to say that is, 'I went to Tokyo with my friend.' What did you enjoy most about Tokyo?",
    actions: ["Correction", "Continue", "Keep talking"]
  },
  {
    badge: "Get Help",
    prompt: "我通常下班后回家做饭。",
    response:
      "You could say, 'I usually go home and cook, but sometimes I grab dinner with friends.'",
    actions: ["Listen", "Learn", "Try saying it"]
  },
  {
    badge: "Say It Again",
    prompt: "I had to work late yesterday.",
    response: "Great. Say it again, then your tutor will keep the conversation going.",
    actions: ["Listen", "Try again", "Continue"]
  }
];

const modeExamples = [
  { label: "You", text: "我想告诉我的老板我明天不能上班。" },
  { label: "AI Tutor", text: "You could say, 'I need to tell my boss that I cannot come to work tomorrow.'" }
];

export function HomePage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const { sections } = dictionary;

  return (
    <>
      <Header dictionary={dictionary} locale={locale} />
      <main>
        <Hero dictionary={dictionary} />

        <section className="section section-white story-section" id="method">
          <div className="container">
              <SectionHeading
                eyebrow={sections.learn.eyebrow}
                title={sections.learn.h2}
                lead={sections.learn.lead}
              />
            <div className="story-grid">
              {sections.learn.cards.map((card, index) => {
                const sample = storySamples[index];

                return (
                  <article className="story-card" key={card.title}>
                    <div className="story-card-top">
                      <span className="story-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="story-pill">{sample.badge}</span>
                    </div>
                    <h3>{card.title}</h3>
                    <div className="story-dialogue">
                      <div className="story-sample story-user">
                        <small>You</small>
                        <strong>{sample.prompt}</strong>
                      </div>
                      <div className="story-sample story-tutor">
                        <small>AI Tutor</small>
                        <strong>{sample.response}</strong>
                      </div>
                    </div>
                    <p>{card.description}</p>
                    <div className="story-actions" aria-label={card.title}>
                      {sample.actions.map((action) => (
                        <span key={action}>{action}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-warm">
          <div className="container split-grid product-grid">
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.modes.eyebrow}
                title={sections.modes.h2}
                lead={sections.modes.lead}
              />
              <div className="flow-track" aria-label="Learning flow">
                {flowSteps.map((step, index) => (
                  <span key={step}>
                    {step}
                    {index < flowSteps.length - 1 ? <ChevronRight aria-hidden="true" size={14} /> : null}
                  </span>
                ))}
              </div>
              <p className="flow-note">
                You do not need a full lesson before you can speak. One conversation creates the practice you need.
              </p>
            </div>
            <div className="mode-stack">
              {sections.modes.items.map((item, index) => (
                <article className="mode-card mode-story-card" key={item.title}>
                  <div className="mode-card-head">
                    <span className={index === 0 ? "mode-number orange" : "mode-number blue"}>{index + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="mode-example">
                    <small>{modeExamples[index]?.label}</small>
                    <strong>{modeExamples[index]?.text}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-blue" id="corrections">
          <div className="container correction-grid">
            <div className="correction-board">
              <div className="correction-row muted">
                <span>You said</span>
                <strong>I go to Tokyo yesterday.</strong>
              </div>
              <div className="correction-row active">
                <span>Your tutor</span>
                <strong>I went to Tokyo yesterday.</strong>
              </div>
              <div className="correction-note">
                <Lightbulb aria-hidden="true" size={18} />
                <p>
                  Use <strong>went</strong> because yesterday is in the past. Try it again out loud.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.corrections.eyebrow}
                title={sections.corrections.h2}
                lead={sections.corrections.lead}
              />
              <div className="correction-list">
                {sections.corrections.points.map((point) => (
                  <div className="check-item" key={point}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-white" id="pronunciation">
          <div className="container split-grid reverse-on-mobile">
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.stuck.eyebrow}
                title={sections.stuck.h2}
                lead={sections.stuck.lead}
              />
              <ul className="clean-list">
                {sections.stuck.points.map((point) => (
                  <li key={point}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pronunciation-panel">
              <div className="panel-header">
                <span className="panel-label">Pronunciation Practice</span>
                <span className="live-dot">Live</span>
              </div>
              <div className="pronunciation-word">
                <Volume2 aria-hidden="true" size={18} />
                <strong>comfortable</strong>
              </div>
              <div className="pronunciation-score">
                <span>Tutor feedback</span>
                <strong>Clear and natural</strong>
                <p>Try making the middle sound softer, then say the phrase once more.</p>
              </div>
              <div className="voice-wave" aria-hidden="true">
                {pronunciationBars.map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="pronunciation-details" aria-label="Syllables">
                <span>comf</span>
                <span>ter</span>
                <span>ble</span>
              </div>
              <p className="pronunciation-copy">
                Listen, speak, and improve your pronunciation as you practice.
              </p>
              <ButtonLink href="/login" variant="secondary" className="pronunciation-button">
                Try again
                <ChevronRight aria-hidden="true" size={18} />
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="section section-warm">
          <div className="container split-grid lesson-grid">
            <div className="vocab-panel">
              <div className="panel-header">
                <span className="panel-label">Vocabulary</span>
                <BookOpen aria-hidden="true" size={18} />
              </div>
              <div className="vocab-table" role="table" aria-label="Words you actually used">
                <div className="vocab-head" role="row">
                  <span role="columnheader">Word</span>
                  <span role="columnheader">Meaning</span>
                  <span role="columnheader">Practice</span>
                </div>
                {vocabRows.map((row) => (
                  <div className="vocab-row" role="row" key={row.word}>
                    <strong role="cell">{row.word}</strong>
                    <span role="cell">{row.meaning}</span>
                    <button type="button" aria-label={`Practice ${row.word}`}>
                      {row.practice}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.lesson.eyebrow}
                title={sections.lesson.h2}
                lead={sections.lesson.lead}
              />
              <div className="lesson-strip">
                {sections.lesson.steps.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
              <p className="lesson-note">
                No random vocabulary lists. Learn the words that come from your own conversations.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-blue" id="review">
          <div className="container personal-grid">
            <div className="memory-panel">
              <div className="panel-header">
                <span className="panel-label">Review</span>
                <Brain aria-hidden="true" size={18} />
              </div>
              <div className="memory-list">
                {memoryRows.map((row) => (
                  <div className="memory-item" key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
              <div className="stat-grid">
                {sections.personal.stats.map((stat) => (
                  <div key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.personal.eyebrow}
                title={sections.personal.h2}
                lead={sections.personal.lead}
              />
              <ul className="clean-list compact">
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Adapts to your current speaking level
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Reuses your past mistakes for better practice
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Keeps lessons connected to real conversations
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section section-white" id="languages">
          <div className="container">
            <SectionHeading
              eyebrow={sections.languages.eyebrow}
              title={sections.languages.h2}
              lead={sections.languages.lead}
            />
            <div className="language-cloud">
              {sections.languages.items.map((language) => (
                <span key={language}>{language}</span>
              ))}
            </div>
            <p className="language-note">Practice the language you actually want to speak, and expand from there.</p>
          </div>
        </section>

        <section className="section section-warm">
          <div className="container">
            <SectionHeading eyebrow={sections.why.eyebrow} title={sections.why.h2} lead={sections.why.lead} />
            <div className="benefit-grid">
              {sections.why.cards.map((card, index) => {
                const Icon = benefitIcons[index] ?? Sparkles;

                return (
                  <article className="benefit-card" key={card.title}>
                    <span className="icon-tile blue">
                      <Icon aria-hidden="true" size={24} />
                    </span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-white" id="faq">
          <div className="container">
            <SectionHeading eyebrow={sections.faq.eyebrow} title={sections.faq.h2} lead={sections.faq.lead} />
            <div className="faq-grid">
              {sections.faq.items.map((item, index) => (
                <details className="faq-item" key={item.question} open={index < 2}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-panel">
              <h2>{sections.cta.h2}</h2>
              <p>{sections.cta.lead}</p>
              <div className="cta-actions">
                <ButtonLink href="/login" variant="secondary">
                  {sections.cta.primaryCta}
                  <ChevronRight aria-hidden="true" size={18} />
                </ButtonLink>
                <ButtonLink href="/pricing" variant="ghost">
                  {sections.cta.secondaryCta}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer dictionary={dictionary} />
    </>
  );
}

function Footer({ dictionary }: { dictionary: LandingDictionary }) {
  const footerLinks: Record<string, string> = {
    "Say It": "#demo",
    Talk: "#demo",
    "Get Help": "#method",
    Corrections: "#corrections",
    "Open App": "/app",
    "Conversation Practice": "#method",
    "Speaking Practice": "#method",
    "Pronunciation Practice": "#pronunciation",
    Review: "#review",
    Contact: "/contact",
    Privacy: "/privacy",
    Terms: "/terms"
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>{dictionary.footer.brand}</h2>
          <p>{dictionary.footer.rights}</p>
          <a href="mailto:support@ailanguagetutor.com">support@ailanguagetutor.com</a>
        </div>
        {dictionary.footer.columns.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <Link href={footerLinks[link] ?? "/"} key={link}>
                {link}
              </Link>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
