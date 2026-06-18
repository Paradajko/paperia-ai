type ChecklistFlowProps = {
  onStart: () => void;
};

const intakeSteps = [
  ['1', 'Choose Slovakia', 'Confirm your destination and start the focused residence wizard.'],
  ['2', 'Describe your situation', 'Add nationality, current location, purpose, and current status.'],
  ['3', 'Mark your documents', 'Check the papers you already have and tell Ria what worries you most.'],
  ['4', 'Get the PDF', 'Save your lead, review the route, and download your personalized checklist.'],
];

export function ChecklistFlow({ onStart }: ChecklistFlowProps) {
  return (
    <section id="checklist" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Start here</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Build your Slovakia checklist step by step.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Paperia turns five structured answers into a practical PDF checklist. No account or document uploads are
            needed for this first version.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-7 rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
          >
            Get your free checklist
          </button>
        </div>

        <div className="rounded-[2rem] border border-line bg-porcelain p-5 shadow-[0_24px_70px_rgba(15,78,59,0.10)] sm:p-6">
          <div className="grid gap-3">
            {intakeSteps.map(([number, title, text]) => (
              <article key={title} className="grid gap-3 rounded-3xl border border-[#DDE8DF] bg-white/76 p-4 sm:grid-cols-[44px_1fr] sm:items-start">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF7F1] text-sm font-bold text-[#0F8A6A] ring-1 ring-[#BFE6D2]">
                  {number}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-dashed border-[#BFE6D2] bg-white/70 p-5">
            <p className="text-sm font-semibold text-ink">Free, PDF-first guidance</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Start with a structured route and document plan. Ria is not a lawyer, does not file applications, and
              cannot guarantee approval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
