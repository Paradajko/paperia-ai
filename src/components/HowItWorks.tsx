const steps = [
  {
    title: 'Answer a few questions',
    text: 'Start with nationality, purpose of stay, employer status, and current location.',
  },
  {
    title: 'Get your Ria checklist',
    text: 'See route, documents, translations, likely risks, and common mistakes.',
  },
  {
    title: 'Prepare your documents',
    text: 'Use the document plan to ask your employer, translator, or authority for the right proof.',
  },
  {
    title: 'Escalate when needed',
    text: 'Complicated cases can be handed to a verified expert with a structured summary.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-porcelain py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Practical guidance before professional fees.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-line bg-white/70 p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-night text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
