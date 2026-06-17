const faqs = [
  {
    question: 'Is Ria legal advice?',
    answer:
      'No. Ria provides general guidance and document organization support. She is not a lawyer and does not provide legal advice.',
  },
  {
    question: 'Can Ria submit my application?',
    answer:
      'No. Ria does not file applications, represent applicants, or guarantee approval. She helps you understand and prepare the process.',
  },
  {
    question: 'Which countries does Ria support?',
    answer:
      'The first MVP focuses on temporary residence in Slovakia, starting with employment-based residence for non-EU citizens.',
  },
  {
    question: 'What documents can I upload?',
    answer:
      'Not yet. Ria starts with the basics you type in. Document upload is planned for a later release.',
  },
  {
    question: 'Is my data private?',
    answer:
      'This MVP does not store sensitive personal documents. Future document tools should use explicit privacy and storage controls.',
  },
  {
    question: 'When should I contact an expert?',
    answer:
      'Contact an expert if your case includes refusals, missing records, dependents, unusual timelines, or any legal uncertainty.',
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
            Ria is here to help you understand and prepare, not to replace qualified professionals.
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
      </div>
    </section>
  );
}
