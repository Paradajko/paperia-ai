const faqs = [
  {
    question: 'Is Ria legal advice?',
    answer:
      'No. Ria provides general guidance and document organization support. It is not a law firm and does not provide legal advice.',
  },
  {
    question: 'Can Ria guarantee approval?',
    answer:
      'No. Ria does not file applications, represent applicants, or guarantee approval. It helps you understand and organize the process.',
  },
  {
    question: 'Which country is supported first?',
    answer:
      'The first MVP focuses on temporary residence in Slovakia, starting with employment-based residence for non-EU citizens.',
  },
  {
    question: 'Can agencies use Ria?',
    answer:
      'Yes. The professional track is designed for agencies, lawyers, translators, and relocation helpers that want cleaner intake and document preparation.',
  },
  {
    question: 'Does Ria store my documents?',
    answer:
      'Not in this MVP. There is no backend and no document upload. Future document tools should use explicit privacy and storage controls.',
  },
  {
    question: 'What if my case is complicated?',
    answer:
      'Ria can flag risk factors and prepare a summary for expert handoff later. Complex cases should be reviewed by a licensed immigration professional.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Clear boundaries, clear next steps.
          </h2>
        </div>
        <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-porcelain shadow-sm">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5 open:bg-slate-50 first:rounded-t-3xl last:rounded-b-3xl">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-ink">
                {faq.question}
                <span className="text-xl text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
