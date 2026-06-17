const steps = [
  {
    title: 'Tell Ria your situation',
    text: 'Where you are from, why you are moving, and what documents you already have.',
  },
  {
    title: 'Ria builds your checklist',
    text: 'She shows your likely route, missing documents, risks, and next steps.',
  },
  {
    title: 'Bring a clear case to an expert',
    text: 'You can share a clean summary with an agency, lawyer, or relocation specialist.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-porcelain py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How Ria helps you before you pay anyone
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-line bg-white/74 p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-harbor text-sm font-bold text-white">
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
