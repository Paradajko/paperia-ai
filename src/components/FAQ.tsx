const faqs = [
  {
    question: "I'm from Serbia — do I need a work permit for Slovakia?",
    answer:
      'Visa-free entry for a short visit is not the same as permission to work or live in Slovakia. For employment, Serbian citizens generally need the correct employment and residence authorization for their situation. Your employer, job type, and length of stay affect the route, so verify the current requirements with the Slovak authorities or a licensed immigration lawyer.',
  },
  {
    question: 'How is this different from asking ChatGPT?',
    answer:
      'Paperia starts with a structured Slovakia-focused wizard instead of an open-ended chat. It collects the same practical inputs every time, organizes them into a route and document plan, and gives you a personalized PDF checklist. Ria chat is available afterwards for follow-up questions.',
  },
  {
    question: 'What does the free PDF checklist include?',
    answer:
      'It includes your likely Slovakia residence route, documents you already have, likely missing items, translation or apostille reminders, a practical timeline, official-source links, and questions to verify before an appointment. It is general information, not a legal opinion.',
  },
  {
    question: 'Is Paperia a law firm? Can you guarantee my visa approval?',
    answer:
      'No. Paperia is not a law firm, Ria is not a lawyer, and nobody can guarantee a residence or visa outcome. Paperia helps you organize information and prepare better questions. A government authority makes the final decision.',
  },
  {
    question: 'When are the 2026 changes to Slovak residence law taking effect?',
    answer:
      'There is no single blanket date that safely covers every 2026 change. Each amendment can have its own effective date and transitional rules. Check the current wording and effective date in Slov-Lex and confirm the requirement with the Slovak Ministry of Interior, a Slovak embassy, or a licensed immigration lawyer before filing.',
  },
  {
    question: 'What happens after I download the checklist? Do you follow up by email?',
    answer:
      'You receive a welcome follow-up at the email you provided, and you can keep the PDF for your own preparation. Ria remains available in the completed wizard for practical follow-up questions. Paperia does not submit the application for you.',
  },
  {
    question: 'Do you handle complex cases like asylum or deportation?',
    answer:
      'Paperia is free for standard checklist preparation. Asylum, deportation defense, appeals, prior refusals, and other high-risk cases need a licensed professional. Paperia may recommend a partner agency or lawyer when the case is genuinely complex.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Guidance first. Expert support when needed.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Slovakia-focused answers for applicants from the Balkans, India, Turkey, Ukraine, Georgia, Vietnam, and
            other non-EU countries.
          </p>
        </div>
        <div className="mt-10 divide-y divide-line rounded-[2rem] border border-line bg-white/70 shadow-sm">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5 open:bg-porcelain/70 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-ink">
                {faq.question}
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-porcelain text-lg text-harbor transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 rounded-3xl border border-[#BFE6D2] bg-[#EEF7F1] px-5 py-4 text-sm font-medium leading-6 text-slate-700">
          I am not a lawyer. Paperia and Ria provide general information, not legal advice. Verify current rules with
          an official Slovak source or a licensed immigration lawyer.
        </p>
      </div>
    </section>
  );
}
