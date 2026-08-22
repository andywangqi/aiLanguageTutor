import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Languages,
  Lightbulb,
  Mic2,
  MessageSquareText,
  PenLine,
  SlidersHorizontal,
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

const cardIcons = [Mic2, PenLine, Target];
const whyIcons = [Sparkles, SlidersHorizontal, MessageSquareText];
const correctionIcons = [PenLine, Languages, MessageSquareText, Volume2];

export function HomePage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const { sections } = dictionary;

  return (
    <>
      <Header dictionary={dictionary} locale={locale} />
      <main>
        <Hero dictionary={dictionary} />

        <section className="section section-white" id="method">
          <div className="container">
            <SectionHeading
              eyebrow={sections.learn.eyebrow}
              title={sections.learn.h2}
              lead={sections.learn.lead}
            />
            <div className="feature-grid three">
              {sections.learn.cards.map((card, index) => {
                const Icon = cardIcons[index] ?? Sparkles;
                return (
                  <article className="feature-card" key={card.title}>
                    <span className="icon-tile orange">
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

        <section className="section section-warm">
          <div className="container split-grid">
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.modes.eyebrow}
                title={sections.modes.h2}
                lead={sections.modes.lead}
              />
              <div className="mode-flow" aria-label="Tutor learning flow">
                {["Say", "Talk", "Improve"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="mode-list">
              {sections.modes.items.map((item, index) => (
                <article className="mode-card" key={item.title}>
                  <span className={index === 0 ? "mode-number orange" : "mode-number blue"}>
                    {index + 1}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-blue">
          <div className="container correction-grid">
            <div className="correction-board" aria-label="Tutor correction example">
              <div className="correction-row muted">
                <span>You said</span>
                <strong>I am agree with you.</strong>
              </div>
              <div className="correction-row active">
                <span>Better</span>
                <strong>I agree with you.</strong>
              </div>
              <div className="correction-note">
                <Lightbulb aria-hidden="true" size={18} />
                <p>Use “agree” as a verb. You do not need “am” before it.</p>
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
                {sections.corrections.points.map((point, index) => {
                  const Icon = correctionIcons[index] ?? CheckCircle2;
                  return (
                    <div className="check-item" key={point}>
                      <Icon aria-hidden="true" size={18} />
                      <span>{point}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-white">
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
            <div className="ask-panel">
              <span className="panel-label">Say It</span>
              <p className="ask-question">How do I say this naturally?</p>
              <div className="answer-strip">
                <strong>I’m still getting used to it.</strong>
                <small>Natural, casual, and useful in everyday conversation.</small>
              </div>
              <button type="button">
                Practice this
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="section section-warm lesson-section">
          <div className="container lesson-grid">
            <div>
              <SectionHeading
                align="left"
                eyebrow={sections.lesson.eyebrow}
                title={sections.lesson.h2}
                lead={sections.lesson.lead}
              />
            </div>
            <div className="lesson-chain">
              {sections.lesson.steps.map((step, index) => (
                <div className="lesson-step" key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-white">
          <div className="container personal-grid">
            <div className="progress-panel">
              <div className="progress-header">
                <div>
                  <span className="panel-label">Tutor memory</span>
                  <strong>Updated after each session</strong>
                </div>
                <Brain aria-hidden="true" size={24} />
              </div>
              <div className="bar-chart" aria-hidden="true">
                {[38, 48, 43, 58, 67, 75, 83, 91].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
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

        <section className="section section-blue" id="languages">
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
          </div>
        </section>

        <section className="section section-white">
          <div className="container">
            <SectionHeading eyebrow={sections.why.eyebrow} title={sections.why.h2} lead={sections.why.lead} />
            <div className="feature-grid three">
              {sections.why.cards.map((card, index) => {
                const Icon = whyIcons[index] ?? BookOpen;
                return (
                  <article className="feature-card" key={card.title}>
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

        <section className="section section-warm" id="faq">
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
                <ButtonLink href="#method" variant="ghost">
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
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>{dictionary.footer.brand}</h2>
          <p>{dictionary.footer.rights}</p>
          <a href="mailto:support@example.com">support@example.com</a>
        </div>
        {dictionary.footer.columns.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
