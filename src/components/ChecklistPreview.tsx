const riaOutput = [
  ['Likely route', 'Temporary residence for employment'],
  ['Missing', 'Criminal record extract, proof of accommodation, official translation'],
  ['Risk', 'Apostille may be required'],
  ['Next step', 'Confirm document country rules'],
  ['Expert summary', 'Ready to share'],
];

const preparedItems = [
  'Personalized checklist',
  'Document plan',
  'Translation and apostille notes',
  'Timeline',
  'Risk flags',
  'Questions for your employer',
];

export function ChecklistPreview() {
  return (
    <section id="product" className="bg-porcelain py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Sample case</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">See a sample case</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Ria turns a messy starting point into a route, document gaps, risk notes, and a cleaner expert handoff.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="rounded-[2rem] border border-line bg-white/72 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Applicant</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              Non-EU citizen with a job offer in Slovakia
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The applicant knows they need residence paperwork, but not which documents should be translated,
              legalized, or prepared before an appointment.
            </p>
            <div className="mt-6 grid gap-3">
              {preparedItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#EEF7F1]/70 px-4 py-3">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white text-sm font-bold text-harbor ring-1 ring-[#BFE6D2]">
                    ✓
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="rounded-[2rem] border border-[#DDE8DF] bg-[#FFFCF6] p-3 shadow-[0_24px_70px_rgba(11,23,38,0.08)]">
            <div className="rounded-[1.55rem] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Ria output</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Clear notes before paid help</h3>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-600">
                    I am not a lawyer. This is guidance only, not legal advice.
                  </p>
                </div>
                <span className="w-fit rounded-full bg-[#FFF8DD] px-3 py-1 text-xs font-semibold text-caution ring-1 ring-[#F4C95D]/45">
                  Medium risk
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {riaOutput.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-2 rounded-2xl border border-line bg-porcelain/70 px-4 py-3 sm:grid-cols-[140px_1fr] sm:items-start"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                    <span className="text-sm font-semibold leading-6 text-ink">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4">
                <p className="text-sm font-semibold text-harbor">Ria's plain-English explanation</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Prepare the criminal record first, because translation and apostille rules can add time before your
                  appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
