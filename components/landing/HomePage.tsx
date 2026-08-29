"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Headphones,
  Lightbulb,
  MessageCircle,
  Mic,
  Play,
  Sparkles,
  Target,
  Volume2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LandingDictionary } from "@/lib/i18n/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/analytics/client";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Header } from "./Header";
import { InteractiveDemo } from "./InteractiveDemo";

const featureIcons: LucideIcon[] = [MessageCircle, Lightbulb, Target];
const benefitIcons: LucideIcon[] = [MessageCircle, Lightbulb, Check, Sparkles];
const languageDetails = [
  ["English", "Practice English speaking", "EN", "language-english"],
  ["Spanish", "Practice Spanish speaking", "ES", "language-spanish"],
  ["Japanese", "Practice Japanese speaking", "JP", "language-japanese"],
  ["French", "Practice French speaking", "FR", "language-french"],
  ["German", "Practice German speaking", "DE", "language-german"],
  ["Korean", "Practice Korean speaking", "KR", "language-korean"],
  ["Chinese", "Practice Chinese speaking", "ZH", "language-chinese"]
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePage({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  const { sections, product } = dictionary;

  return (
    <div className="home-v1-page">
      <Header dictionary={dictionary} locale={locale} />
      <main>
        <section className="home-v1-hero">
          <div className="home-v1-container home-v1-hero-grid">
            <div className="home-v1-hero-copy">
              <p className="home-v1-eyebrow"><Sparkles size={13} aria-hidden="true" />{dictionary.hero.eyebrow}</p>
              <h1>{dictionary.hero.h1}</h1>
              <p className="home-v1-lead">{dictionary.hero.lead}</p>
              <div className="home-v1-hero-actions">
                <ButtonLink href={localizedPath(locale, "/login")} eventName="home_cta_clicked" eventProperties={{ placement: "hero", cta: "primary", destination: "login", locale }}>
                  {dictionary.hero.primaryCta}<ArrowRight size={16} aria-hidden="true" />
                </ButtonLink>
                <button className="home-v1-outline-cta" type="button" onClick={() => scrollToSection("home-features")}>{dictionary.hero.secondaryCta}</button>
              </div>
              <div className="home-v1-proof" aria-label="Learner trust">
                <div className="home-v1-avatars" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>R</span></div>
                <div><div className="home-v1-stars" aria-label="5 out of 5 stars">★★★★★</div><small>Trusted by learners<br />around the world</small></div>
              </div>
            </div>
            <InteractiveDemo dictionary={dictionary} />
          </div>
        </section>

        <section className="home-v1-benefits" aria-label="Product benefits">
          <div className="home-v1-container home-v1-benefits-grid">
            {[
              [sections.learn.cards[0]?.title ?? "Talk Naturally", sections.learn.cards[0]?.description ?? "Speak in the language you are learning."],
              [sections.learn.cards[1]?.title ?? "Get Help Instantly", sections.learn.cards[1]?.description ?? "Get help when you get stuck."],
              ["Learn by Speaking", "Get corrections and learn useful expressions."],
              ["Track Your Progress", "Review what you learned and keep improving."]
            ].map(([title, text], index) => {
              const Icon = benefitIcons[index];
              return <div className="home-v1-benefit" key={title}><span className={`home-v1-benefit-icon benefit-${index}`}><Icon size={17} aria-hidden="true" /></span><div><strong>{title}</strong><span>{text}</span></div></div>;
            })}
          </div>
        </section>

        <section className="home-v1-section home-v1-white" id="home-features">
          <div className="home-v1-container">
            <HomeSectionHeading eyebrow="Core features" title={sections.learn.h2} lead={sections.learn.lead} />
            <div className="home-v1-feature-grid">
              {sections.learn.cards.map((card, index) => {
                const Icon = featureIcons[index] ?? MessageCircle;
                const sample = product.home.storySamples[index] ?? product.home.storySamples[0];
                return <article className="home-v1-feature-card" key={card.title}>
                  <span className={`home-v1-card-icon card-icon-${index}`}><Icon size={18} aria-hidden="true" /></span>
                  <h3>{card.title}</h3><p>{card.description}</p>
                  <div className={`home-v1-mini-dialogue mini-${index}`}><span>{product.demo.tutorLabel}</span><strong>{sample?.response ?? "Keep the conversation moving."}</strong></div>
                  <button type="button" onClick={() => scrollToSection("home-help")} className="home-v1-text-link">{index === 0 ? "Start talking" : index === 1 ? "Learn more" : "Try it now"}<ArrowRight size={14} aria-hidden="true" /></button>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="home-v1-section home-v1-warm" id="home-help">
          <div className="home-v1-container home-v1-help-grid">
            <div className="home-v1-section-copy"><p className="home-v1-kicker">Stuck? No problem</p><h2>{sections.modes.h2}</h2><p>{sections.modes.lead}</p><div className="home-v1-small-actions"><span>Explain</span><span>Translate</span><span>Practice</span></div></div>
            <div className="home-v1-chat-preview" aria-label="Example of getting help">
              <div className="home-v1-chat-line home-v1-chat-user"><span>You</span><strong>I want to book a table for tomorrow at 2 PM.</strong></div>
              <div className="home-v1-chat-line home-v1-chat-ai"><span>AI Tutor · English</span><strong>You could say: <em>I&apos;d like to book a table for tomorrow at 2 PM.</em></strong><div className="home-v1-chat-actions"><span><Volume2 size={12} />Listen</span><span><BookOpen size={12} />Practice</span></div></div>
              <div className="home-v1-chat-line home-v1-chat-user compact"><span>You</span><strong>I&apos;d like to book a table for tomorrow at 2 PM.</strong></div><div className="home-v1-chat-line home-v1-chat-ai compact"><span>AI Tutor</span><strong>Great! How many people will be in your party?</strong></div>
            </div>
          </div>
        </section>

        <section className="home-v1-section home-v1-blue"><div className="home-v1-container home-v1-three-feature-grid"><HomeFeaturePanel icon={Headphones} title={sections.corrections.h2} copy={sections.corrections.lead} points={sections.corrections.points} color="blue" /><HomeFeaturePanel icon={Volume2} title={sections.stuck.h2} copy={sections.stuck.lead} points={sections.stuck.points} color="orange" /><HomeFeaturePanel icon={BookOpen} title={sections.lesson.h2} copy={sections.lesson.lead} points={sections.lesson.steps} color="green" /></div></section>

        <section className="home-v1-section home-v1-white" id="home-languages"><div className="home-v1-container"><HomeSectionHeading eyebrow="Languages" title={sections.languages.h2} lead={sections.languages.lead} /><div className="home-v1-language-grid">{languageDetails.map(([name, description, code, className]) => <button type="button" className="home-v1-language-card" key={name} onClick={() => void trackEvent("home_language_interest_clicked", { language: name, locale })}><span className={`home-v1-language-visual ${className}`}><strong>{code}</strong><span aria-hidden="true" /></span><span className="home-v1-language-copy"><strong>{name}</strong><small>{description}</small></span></button>)}</div><button type="button" className="home-v1-centered-link" onClick={() => scrollToSection("home-faq")}>View all languages <ArrowRight size={14} aria-hidden="true" /></button></div></section>

        <section className="home-v1-section home-v1-soft-warm"><div className="home-v1-container"><HomeSectionHeading eyebrow="Why choose us" title={sections.why.h2} lead={sections.why.lead} /><div className="home-v1-why-grid">{sections.why.cards.map((card, index) => <article className="home-v1-why-card" key={card.title}><span className={`home-v1-why-icon why-${index}`}><Sparkles size={17} /></span><div><h3>{card.title}</h3><p>{card.description}</p></div></article>)}</div></div></section>

        <section className="home-v1-section home-v1-white" id="home-faq"><div className="home-v1-container"><HomeSectionHeading eyebrow="FAQ" title={sections.faq.h2} lead={sections.faq.lead} /><div className="home-v1-faq-grid">{sections.faq.items.slice(0, 8).map((item) => <details className="home-v1-faq" key={item.question}><summary>{item.question}<ChevronDown size={16} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className="home-v1-cta-section"><div className="home-v1-container"><div className="home-v1-cta-panel"><div><h2>{sections.cta.h2}</h2><p>{sections.cta.lead}</p><div className="home-v1-cta-actions"><ButtonLink href={localizedPath(locale, "/login")} variant="secondary" eventName="home_cta_clicked" eventProperties={{ placement: "final", cta: "primary", destination: "login", locale }}>{sections.cta.primaryCta}<ArrowRight size={15} /></ButtonLink><ButtonLink href={localizedPath(locale, "/pricing")} variant="ghost" eventName="home_cta_clicked" eventProperties={{ placement: "final", cta: "secondary", destination: "pricing", locale }}>{sections.cta.secondaryCta}</ButtonLink></div></div><div className="home-v1-student-visual" aria-hidden="true"><div className="home-v1-speech speech-one">Hello!<br />Nice to meet you.</div><div className="home-v1-student-head" /><div className="home-v1-student-body" /><div className="home-v1-phone" /><div className="home-v1-speech speech-two">I&apos;d love to<br />learn more!</div></div></div></div></section>
      </main>
      <HomeFooter dictionary={dictionary} locale={locale} />
    </div>
  );
}

function HomeSectionHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return <div className="home-v1-heading"><p className="home-v1-kicker">{eyebrow}</p><h2>{title}</h2>{lead ? <p>{lead}</p> : null}</div>;
}

function HomeFeaturePanel({ icon: Icon, title, copy, points, color }: { icon: LucideIcon; title: string; copy: string; points: string[]; color: string }) {
  return <article className={`home-v1-feature-panel panel-${color}`}><div className="home-v1-feature-panel-copy"><span className="home-v1-panel-icon"><Icon size={18} /></span><h2>{title}</h2><p>{copy}</p><ul>{points.slice(0, 3).map((point) => <li key={point}><Check size={13} />{point}</li>)}</ul></div><div className="home-v1-panel-mock"><span>AI Tutor</span><strong>{points[0] ?? "Personalized practice"}</strong><div className="home-v1-wave"><i /><i /><i /><i /><i /><i /><i /><i /></div><small><Play size={11} fill="currentColor" /> Try it again</small></div></article>;
}

function HomeFooter({ dictionary, locale }: { dictionary: LandingDictionary; locale: Locale }) {
  return <footer className="home-v1-footer"><div className="home-v1-container home-v1-footer-grid"><div className="home-v1-footer-brand"><Link href={localizedPath(locale, "/")}><span className="home-v1-brand-mark"><img src="/arno.svg" alt="" /></span><strong>AI Language Tutor</strong></Link><p>{dictionary.footer.rights}</p><p>Practice speaking with an AI tutor and improve your language skills in real conversations.</p></div><FooterColumn title="Practice" links={["Talk", "Get Help", "Pronunciation", "Vocabulary"]} onSelect={() => scrollToSection("home-help")} /><FooterColumn title="Learn" links={["Conversation Topics", "Learning Tips", "Practice Guide", "Blog"]} onSelect={() => scrollToSection("home-features")} /><FooterColumn title="Company" links={["About Us", "Contact", "Careers"]} onSelect={() => void trackEvent("footer_link_clicked", { locale })} /><FooterColumn title="Legal" links={["Privacy Policy", "Terms of Service", "Cookies"]} onSelect={() => void trackEvent("footer_link_clicked", { locale })} /></div></footer>;
}

function FooterColumn({ title, links, onSelect }: { title: string; links: string[]; onSelect: () => void }) {
  return <nav className="home-v1-footer-column" aria-label={title}><h3>{title}</h3>{links.map((link) => <button type="button" onClick={onSelect} key={link}>{link}</button>)}</nav>;
}
