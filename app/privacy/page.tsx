import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createLocalizedPageMetadata("en", "/privacy", "Privacy Policy | AI Language Tutor", "Learn how AI Language Tutor handles account, conversation, voice, and website information.");

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="PRIVACY"
      title="Your practice is personal."
      lead="This policy explains what information AI Language Tutor may handle, why we use it, and the choices you have."
    >
      <section className="info-section">
        <h2>1. The short version</h2>
        <p>
          AI Language Tutor is built around personal practice. We use information to provide conversations,
          corrections, translations, pronunciation practice, account access, and product support. We do not sell
          your personal information.
        </p>
        <p>
          The current website prototype may show demo flows without connecting to a production authentication
          provider. When production account, payment, or AI providers are connected, this policy will be updated to
          describe those services precisely.
        </p>
      </section>

      <section className="info-section">
        <h2>2. Information you provide</h2>
        <p>Depending on the features you use, this may include:</p>
        <ul className="info-list">
          <li>Account details such as your name, email address, and sign-in provider.</li>
          <li>Your selected native language, target language, level, goals, and tutor preferences.</li>
          <li>Messages, saved phrases, corrections, and other learning notes you choose to keep.</li>
          <li>Voice input or audio recordings when you use speaking or pronunciation features.</li>
          <li>Messages you send to support or feedback addresses.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>3. Information collected automatically</h2>
        <p>
          We may receive basic technical information when you visit the site, such as your browser type, device
          category, approximate region, pages viewed, and error information. This helps us keep the product secure,
          understand which flows need improvement, and troubleshoot issues.
        </p>
        <p>
          We aim to collect only what is reasonably needed for those purposes. We do not use your conversation
          content to build an advertising profile.
        </p>
      </section>

      <section className="info-section">
        <h2>4. How we use information</h2>
        <ul className="info-list">
          <li>To provide the tutor, translation, text-to-speech, and pronunciation experiences you request.</li>
          <li>To remember your settings, saved words, conversation history, and learning progress.</li>
          <li>To personalize prompts, corrections, examples, and practice suggestions.</li>
          <li>To communicate about account, service, security, or support matters.</li>
          <li>To monitor reliability, prevent abuse, and improve the product.</li>
          <li>To meet legal obligations and protect the rights and safety of users and the service.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>5. AI and service providers</h2>
        <p>
          Some features may rely on specialized providers for authentication, speech recognition, language
          generation, translation, hosting, analytics, or payments. We share the minimum information needed for a
          provider to perform the requested service and require providers to handle it according to their
          agreements with us.
        </p>
        <p>
          We do not give providers permission to use your private practice content for unrelated advertising. The
          exact providers may change as the product evolves, and this page will be updated when that affects how
          information is handled.
        </p>
      </section>

      <section className="info-section">
        <h2>6. Voice and conversation data</h2>
        <p>
          Voice input is sent for the purpose of transcription, conversation, or pronunciation feedback when you
          activate those features. We work to limit retention and access to what is needed to deliver the feature,
          keep your history available when you choose to save it, and investigate a support request.
        </p>
        <p>
          Please do not share highly sensitive personal information, confidential business information, or another
          person&apos;s private information in a practice conversation.
        </p>
      </section>

      <section className="info-section">
        <h2>7. Your choices</h2>
        <ul className="info-list">
          <li>You can choose whether to use text input, voice input, or neither.</li>
          <li>You can review or remove saved words and learning notes where those controls are available.</li>
          <li>You can ask us to access, correct, export, or delete account information by contacting support.</li>
          <li>You can stop using the service at any time and ask us what information remains subject to retention requirements.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>8. Security and retention</h2>
        <p>
          We use reasonable administrative, technical, and organizational safeguards designed to protect
          information from unauthorized access, loss, misuse, or alteration. No internet service can guarantee
          absolute security.
        </p>
        <p>
          We keep information for as long as needed to provide the service, maintain a useful learning history,
          resolve disputes, meet legal requirements, or protect the service. Retention periods depend on the type of
          information and the feature involved.
        </p>
      </section>

      <section className="info-section">
        <h2>9. Children and international users</h2>
        <p>
          AI Language Tutor is not directed to children who are below the minimum age required to use online services
          in their location. If you believe a child has provided personal information without appropriate consent,
          contact us so we can review the request.
        </p>
        <p>
          Our service may be operated from, or use providers located in, countries different from your own. Where
          required, we use appropriate safeguards for cross-border transfers.
        </p>
      </section>

      <section className="info-section">
        <h2>10. Changes and contact</h2>
        <p>
          We may update this policy as the product, providers, or legal requirements change. The date at the top of
          this page shows when the latest version took effect. Material changes will be communicated through the
          service or another reasonable channel.
        </p>
        <p>
          Privacy questions or requests can be sent to{" "}
          <a href="mailto:privacy@ailanguagetutor.online">privacy@ailanguagetutor.online</a>. You can also visit our{" "}
          <Link href="/contact">Contact page</Link>.
        </p>
      </section>
    </InfoPage>
  );
}
