import {
  LegalPageLayout,
  LegalSection,
} from '../components/LegalPageLayout';

const externalLinkClass =
  'font-semibold text-harbor underline decoration-[#A7F3D0] underline-offset-4 hover:text-night';

export function Privacy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      intro="This policy explains what personal data Riadence uses, why we use it, who helps us process it, and the choices available to you."
    >
      <LegalSection title="Who we are / Data controller">
        <div className="rounded-2xl bg-porcelain p-5 text-sm leading-7 text-slate-700 ring-1 ring-line">
          <p>Riadence is operated by:</p>
          <p>Fabian Sarkozi</p>
          <p>Trading as: Fabian Sarkozi - Gejming</p>
          <p>IČO (Company ID): 57158738</p>
          <p>DIČ (Tax ID): 1130643118</p>
          <p>Registered at: Okresný úrad Bratislava (Slovakia)</p>
          <p>Address: Nábrežie arm. gen. Ludvíka Svobodu 20, 811 02 Bratislava, Slovakia</p>
          <p>
            Contact:{' '}
            <a className={externalLinkClass} href="mailto:hello@riadence.com">
              hello@riadence.com
            </a>
          </p>
        </div>
      </LegalSection>

      <LegalSection title="What data we collect">
        <p>Depending on how you use Riadence, we may process:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>your email address, which is required to deliver the service;</li>
          <li>your name, if you choose to provide it;</li>
          <li>
            nationality, destination country, residence type, current
            location, document status, and the concern entered in the wizard;
          </li>
          <li>
            messages you send to Ria and the context needed to answer them;
          </li>
          <li>
            technical information such as IP address, request time, browser
            information, and server logs used for security and reliability.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Why we collect it">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            to run the five-step wizard and create your personalized PDF
            checklist;
          </li>
          <li>
            to email the requested checklist information and service
            follow-up;
          </li>
          <li>to answer practical questions through Ria;</li>
          <li>
            to maintain security, prevent abuse, diagnose errors, and improve
            the product;
          </li>
          <li>
            to send optional product or marketing communication only where you
            have consented.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Legal basis">
        <p>
          We process data needed to provide the service you requested on the
          basis of taking steps at your request and performing our service.
          We rely on legitimate interests for service security, reliability,
          limited product improvement, and necessary operational follow-up,
          balanced against your rights.
        </p>
        <p>
          We rely on consent for optional newsletters or marketing follow-up.
          You may withdraw that consent at any time without affecting earlier
          lawful processing.
        </p>
      </LegalSection>

      <LegalSection title="Marketing communications">
        <p>
          We may send you a 14-day email guide with practical residence tips and case examples. This is opt-in: you must explicitly agree before we send these emails. You can unsubscribe anytime using the link in each email footer.
        </p>
      </LegalSection>

      <LegalSection title="Third parties">
        <p>
          We use service providers only where needed to operate Riadence. They
          may process data under their own terms and our applicable data
          processing arrangements:
        </p>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            Resend for email delivery —{' '}
            <a
              className={externalLinkClass}
              href="https://resend.com/legal/privacy"
              rel="noreferrer"
              target="_blank"
            >
              Resend Privacy Policy
            </a>
          </li>
          <li>
            Supabase for database hosting —{' '}
            <a
              className={externalLinkClass}
              href="https://supabase.com/privacy"
              rel="noreferrer"
              target="_blank"
            >
              Supabase Privacy Policy
            </a>
          </li>
          <li>
            OpenAI for AI chat responses —{' '}
            <a
              className={externalLinkClass}
              href="https://openai.com/policies/privacy-policy"
              rel="noreferrer"
              target="_blank"
            >
              OpenAI Privacy Policy
            </a>
          </li>
          <li>
            Vercel for website hosting and server logs —{' '}
            <a
              className={externalLinkClass}
              href="https://vercel.com/legal/privacy-policy"
              rel="noreferrer"
              target="_blank"
            >
              Vercel Privacy Policy
            </a>
          </li>
        </ul>
        <p>
          Some providers may process data outside the European Economic Area.
          Where required, transfers are protected through an adequacy decision,
          Standard Contractual Clauses, or another lawful safeguard.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep data">
        <p>
          Lead and wizard data is normally kept for up to two years from your
          last interaction so we can provide follow-up, maintain service
          continuity, and improve Riadence. Email subscription data is kept
          until you unsubscribe or withdraw consent.
        </p>
        <p>
          We delete data earlier after a valid request unless we must keep it
          for legal claims, security, accounting, or another legal obligation.
          Technical logs are retained only for the period reasonably needed
          for security and operations.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under GDPR Articles 15–22, where applicable, you may request access,
          correction, deletion, restriction of processing, data portability,
          or object to processing. You may also withdraw consent at any time
          and ask not to be subject to a decision based solely on automated
          processing that has legal or similarly significant effects.
        </p>
        <p>
          Email{' '}
          <a className={externalLinkClass} href="mailto:hello@riadence.com">
            hello@riadence.com
          </a>{' '}
          to exercise a right. We may need to verify your identity before
          acting on a request.
        </p>
        <p>
          You may lodge a complaint with the Office for Personal Data
          Protection of the Slovak Republic (ÚOOÚ):{' '}
          <a
            className={externalLinkClass}
            href="https://dataprotection.gov.sk"
            rel="noreferrer"
            target="_blank"
          >
            dataprotection.gov.sk
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Cookies and browser storage">
        <p>
          Riadence currently uses only essential browser storage needed for
          site functionality, such as remembering your cookie notice choice,
          session-related state, and your device color preference. We do not
          use tracking cookies or analytics.
        </p>
        <p>
          If we add analytics or other non-essential technologies, we will
          update this policy and request consent where required before using
          them.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy when Riadence, our providers, or legal
          requirements change. If a change is material and we have your contact
          details, we will provide notice by email. The current version will
          always show its update date.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
