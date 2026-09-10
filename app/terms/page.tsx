import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createLocalizedPageMetadata("en", "/terms", "Terms of Service | AI Language Tutor", "Read the terms for using AI Language Tutor conversation and speaking practice features.");

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="TERMS"
      title="A clear agreement for better practice."
      lead="These terms describe the rules for using AI Language Tutor and the responsibilities we each have."
    >
      <section className="info-section">
        <h2>1. Using the service</h2>
        <p>
          By accessing AI Language Tutor, you agree to these Terms of Service and to use the service in a lawful,
          respectful way. If you do not agree, please do not use the service.
        </p>
        <p>
          You must be legally able to enter into this agreement. If you use the service for an organization, you
          confirm that you have authority to accept these terms for that organization.
        </p>
      </section>

      <section className="info-section">
        <h2>2. Your account</h2>
        <ul className="info-list">
          <li>Keep the information connected to your account accurate and up to date.</li>
          <li>Protect access to your sign-in method and tell us promptly if you suspect unauthorized use.</li>
          <li>Do not share, sell, or transfer an account in a way that creates security or billing risk.</li>
          <li>You are responsible for activity that happens through your account unless it resulted from our error.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>3. Conversation and AI output</h2>
        <p>
          AI Language Tutor generates practice responses, translations, explanations, and feedback. AI output can
          be incomplete, incorrect, overly confident, or unsuitable for a particular situation. Treat it as a
          learning aid, not as professional, medical, legal, financial, or emergency advice.
        </p>
        <p>
          You are responsible for checking important language, cultural, workplace, or travel decisions before
          relying on them outside the product.
        </p>
      </section>

      <section className="info-section">
        <h2>4. Acceptable use</h2>
        <p>You may not use the service to:</p>
        <ul className="info-list">
          <li>Break the law, infringe another person&apos;s rights, or facilitate harm.</li>
          <li>Harass, threaten, impersonate, exploit, or target another person.</li>
          <li>Upload malware, attempt unauthorized access, or interfere with service reliability.</li>
          <li>Probe, scrape, copy, reverse engineer, or reproduce the product except where the law allows it.</li>
          <li>Submit private information about another person without permission.</li>
          <li>Evade usage limits, payment controls, security measures, or account restrictions.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>5. Plans, payments, and trials</h2>
        <p>
          Available plans, prices, limits, and included features are shown on the{" "}
          <Link href="/pricing">Pricing page</Link>. A free experience may have time, feature, or usage limits.
          Paid plans may renew according to the option selected at checkout.
        </p>
        <p>
          Before a paid subscription is activated, the checkout experience will show the price, billing interval,
          and applicable taxes or fees. You authorize the selected payment provider to charge the payment method
          you provide.
        </p>
      </section>

      <section className="info-section">
        <h2>6. Cancellation and refunds</h2>
        <p>
          You may cancel a recurring plan using the account or payment controls made available for your purchase.
          Cancellation normally stops the next renewal while access continues through the current paid period,
          unless the checkout terms say otherwise.
        </p>
        <p>
          Refund eligibility depends on the purchase channel, local law, and the terms shown at checkout. For help
          with a billing issue, contact <a href="mailto:scottthornton815@gmail.com">scottthornton815@gmail.com</a>{" "}
          with the account email and transaction details.
        </p>
      </section>

      <section className="info-section">
        <h2>7. Your content and our rights</h2>
        <p>
          You keep the rights you already have in the messages, examples, and recordings you submit. You give us
          the limited permission needed to host, process, transmit, and display that content to provide the
          features you request.
        </p>
        <p>
          The product, interface, branding, software, and original materials belong to AI Language Tutor or its
          licensors. These terms do not transfer ownership of them to you.
        </p>
      </section>

      <section className="info-section">
        <h2>8. Availability and changes</h2>
        <p>
          We are building and improving the service continuously. Features may change, be paused, or be removed.
          We do not promise that every feature will be available at every moment or on every device.
        </p>
        <p>
          We may update these terms when the service or legal requirements change. Continued use after an updated
          version takes effect means you accept the revised terms.
        </p>
      </section>

      <section className="info-section">
        <h2>9. Suspension and termination</h2>
        <p>
          We may limit or suspend access when necessary to protect users, the service, our providers, or the public;
          to investigate abuse; to address unpaid charges; or to comply with law. Where practical, we will explain
          the reason and provide a path to resolve the issue.
        </p>
        <p>
          You may stop using the service at any time. Provisions that need to continue after termination, including
          payment obligations, ownership, disclaimers, and dispute terms, will continue to apply.
        </p>
      </section>

      <section className="info-section">
        <h2>10. Disclaimers and limits</h2>
        <p>
          To the extent permitted by law, the service is provided on an &quot;as available&quot; basis without
          guarantees that it will be uninterrupted, error-free, or suitable for every learning goal. We are not
          responsible for decisions you make based only on AI-generated output.
        </p>
        <p>
          Nothing in these terms limits rights or remedies that cannot legally be limited in your location. Any
          additional limits will be applied only to the extent permitted by applicable law.
        </p>
      </section>

      <section className="info-section">
        <h2>11. Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:scottthornton815@gmail.com">scottthornton815@gmail.com</a>. For general product help, use
          our <Link href="/contact">Contact page</Link>.
        </p>
      </section>
    </InfoPage>
  );
}
