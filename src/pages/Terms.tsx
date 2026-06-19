import {
  LegalPageLayout,
  LegalSection,
} from '../components/LegalPageLayout';

const linkClass =
  'font-semibold text-harbor underline decoration-[#A7F3D0] underline-offset-4 hover:text-night';

export function Terms() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      intro="These terms explain what Riadence provides, the limits of the service, and your responsibilities when using it."
    >
      <LegalSection title="What Riadence is">
        <p>
          Riadence is a free AI residence guide for non-EU citizens moving to
          Slovakia. It provides a five-step wizard, a personalized PDF
          checklist, practical AI follow-up through Ria, and service emails
          related to your request.
        </p>
      </LegalSection>

      <LegalSection title="What Riadence is not">
        <p>
          Riadence is not a law firm, not a lawyer, and not an immigration adviser.
          Ria is an AI assistant, not a qualified legal professional.
          Using the service does not create a lawyer-client, adviser-client, or
          fiduciary relationship.
        </p>
      </LegalSection>

      <LegalSection title="No guarantee">
        <p>
          Slovak government authorities and courts make all decisions about
          visas, residence permits, applications, deadlines, and enforcement.
          Riadence does not guarantee that an application will succeed, that
          an authority will process it within a particular time, or that every
          piece of information is complete, current, or accurate for your
          circumstances.
        </p>
        <p>
          Immigration rules and administrative practice can change. Verify
          important information with an official Slovak source or a licensed
          professional before acting or filing.
        </p>
      </LegalSection>

      <LegalSection title="Your responsibilities">
        <ul className="list-disc space-y-2 pl-6">
          <li>provide truthful, accurate, and current information;</li>
          <li>use Riadence only for lawful purposes;</li>
          <li>
            independently verify requirements, deadlines, documents, and
            official instructions;
          </li>
          <li>
            protect access to your email, device, downloaded PDF, and personal
            information;
          </li>
          <li>
            agree and pay any fees directly to a partner agency, lawyer, or
            other professional you choose to contact. Their services are
            separate from the free Riadence service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Riadence owns or licenses the Riadence name, Ria avatar, site design,
          software, and original content. You may use a PDF generated for you
          for your personal residence preparation and may share it with a
          professional helping with your case.
        </p>
        <p>
          You may not sell, systematically copy, republish, scrape, or create a
          competing service from Riadence content without written permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Riadence is not liable for
          indirect, incidental, special, consequential, or lost-profit damages,
          or for decisions, delays, refusals, costs, or losses caused by relying
          on the service.
        </p>
        <p>
          Our total liability relating to the service is limited to the amount
          you paid for it. The current free service has a value paid of EUR 0.
          Nothing in these terms excludes liability or consumer rights that
          cannot be excluded or limited under mandatory law.
        </p>
      </LegalSection>

      <LegalSection title="Availability and termination">
        <p>
          We may change, suspend, restrict, or discontinue all or part of
          Riadence. Where reasonably possible, we will provide notice before a
          material interruption. We may immediately restrict use that is
          unlawful, abusive, harmful, or threatens the service or other users.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms when the service or legal requirements
          change. If a change is material and we have your contact details, we
          will provide notice by email. Continued use after the effective date
          means the updated terms apply, subject to mandatory law.
        </p>
      </LegalSection>

      <LegalSection title="Governing law and disputes">
        <p>
          These terms are governed by Slovak law. Disputes are subject to the
          jurisdiction of the Slovak courts, without limiting any mandatory
          consumer right to use another competent court or dispute-resolution
          process.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms can be sent to{' '}
          <a className={linkClass} href="mailto:hello@riadence.com">
            hello@riadence.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
