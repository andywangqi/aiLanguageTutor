import Link from "next/link";
import type { Metadata } from "next";
import { InfoPage } from "./InfoPage";
import { scenarios, type Scenario } from "@/lib/scenarios";
import { siteUrl } from "@/lib/seo/metadata";

export function scenarioMetadata(scenario: Scenario): Metadata {
  const url = `${siteUrl}/learn/${scenario.slug}`;
  return { title: scenario.title, description: scenario.description,
    alternates: { canonical: url }, robots: { index: true, follow: true },
    openGraph: { title: scenario.title, description: scenario.description, url, type: "article" },
    twitter: { card: "summary", title: scenario.title, description: scenario.description }
  };
}

export function ScenarioPage({ scenario }: { scenario: Scenario }) {
  return <InfoPage title={scenario.title} lead={scenario.description} eyebrow="English speaking scenarios" updated="September 17, 2026" hideLanguageSwitcher>
    <p>By AI Language Tutor</p>
    <section className="info-section"><h2>Who this practice is for</h2><p>{scenario.audience}</p></section>
    <section className="info-callout"><h2>Start with a guided conversation</h2><p>{scenario.prompt}</p><Link href={`/app?scenario=${scenario.slug}`}>Open this practice in the tutor</Link></section>
    <section className="info-section"><h2>Questions and example answers</h2><p>Use these examples as a starting point. Change the details and say the answer in your own words.</p>
      {scenario.questions.map(([question, answer]) => <section key={question}><h3>{question}</h3><p>{answer}</p></section>)}
    </section>
    <section className="info-section"><h2>Useful phrases</h2><ul>{scenario.phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}</ul></section>
    <section className="info-section"><h2>Practice with Say It and Talk</h2><p>{scenario.routine}</p><p>In Say It, enter what you mean in your own language. Listen to the expression and repeat it, or choose to continue by typing. In Talk, use Help me say it to prepare an expression without leaving the conversation. Translation and grammar explanations are available on demand.</p></section>
    <section className="info-section"><h2>Mistakes to avoid</h2><ul>{scenario.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="info-section"><h2>Questions about this practice</h2>{scenario.faq.map(([question, answer]) => <section key={question}><h3>{question}</h3><p>{answer}</p></section>)}</section>
    <section className="info-section"><h2>Try another conversation</h2><ul>{scenarios.filter((item) => item.slug !== scenario.slug).map((item) => <li key={item.slug}><Link href={`/learn/${item.slug}`}>{item.title}</Link></li>)}</ul><Link href="/pricing">Check current trial and subscription plans</Link></section>
  </InfoPage>;
}
