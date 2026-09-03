import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createLocalizedPageMetadata("en", "/contact", "Contact | AI Language Tutor", "Get help with AI Language Tutor, share product feedback, or ask about partnerships.");

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="CONTACT"
      title="Let&apos;s make speaking practice better."
      lead="Need help, have feedback, or want to work together? Send us a note and tell us what you are trying to learn."
    >
      <section className="info-section">
        <h2>Choose the right place to start</h2>
        <div className="info-card-grid">
          <article className="info-card">
            <p className="info-card-label">Product support</p>
            <h3>Something is not working?</h3>
            <p>
              Tell us what happened, which language you were practicing, and what device or browser you were using.
              We can usually diagnose a problem faster with those details.
            </p>
            <a className="info-card-link" href="mailto:support@ailanguagetutor.online">
              support@ailanguagetutor.online
            </a>
          </article>
          <article className="info-card">
            <p className="info-card-label">Ideas and feedback</p>
            <h3>Help shape the tutor</h3>
            <p>
              Tell us which conversations you want to practice, which corrections feel useful, or where the
              experience gets in your way.
            </p>
            <a className="info-card-link" href="mailto:hello@ailanguagetutor.online">
              hello@ailanguagetutor.online
            </a>
          </article>
          <article className="info-card">
            <p className="info-card-label">Partnerships</p>
            <h3>Build with us</h3>
            <p>
              We are open to conversations with language teachers, learning communities, and teams exploring
              conversation-first practice.
            </p>
            <a className="info-card-link" href="mailto:partners@ailanguagetutor.online">
              partners@ailanguagetutor.online
            </a>
          </article>
        </div>
      </section>

      <section className="info-section">
        <h2>What to include in a support message</h2>
        <p>A short, specific message helps us get to a useful answer sooner. Include:</p>
        <ul className="info-list">
          <li>The language you were learning and the practice mode you used.</li>
          <li>The page or action where the problem appeared.</li>
          <li>What you expected to happen and what happened instead.</li>
          <li>Your browser, device, and approximate time of the issue.</li>
          <li>A screenshot or short screen recording when the layout or audio is involved.</li>
        </ul>
      </section>

      <section className="info-callout">
        <strong>We read every message.</strong>
        <p>
          Support is handled by email while the product is growing. We aim to reply within two business days, but
          complex audio or account issues may take a little longer to investigate.
        </p>
      </section>

      <p className="info-inline-note">
        Questions about how we handle information? Read our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </InfoPage>
  );
}
