const agencyRows = [
  ['New client intake', 'Ready for review'],
  ['Missing documents', '4 items'],
  ['Risk notes', 'Address proof unclear'],
  ['Prepared case summary', 'Drafted'],
  ['Client language', 'English / Ukrainian / Russian / Slovak'],
];

const workflow = ['Client answers', 'Ria structures', 'Professional reviews'];

export function AgencySection({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="agencies" className="bg-night py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">For professionals</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Cleaner cases before the first consultation.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Ria does not replace agencies, lawyers, or immigration professionals. It helps them work faster with
            structured client intake, missing document detection, multilingual instructions, and expert-ready case
            summaries.
          </p>
          <button
            type="button"
            onClick={onJoin}
            className="mt-7 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
          >
            Join partner waitlist
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-3 shadow-agent backdrop-blur sm:p-4">
          <div className="rounded-2xl bg-white p-5 text-ink">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agency dashboard</p>
                <h3 className="mt-1 text-xl font-semibold">Ria-prepared case intake</h3>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-slateblue">Partner beta</span>
            </div>
            <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {agencyRows.map(([label, value]) => (
                <div key={label} className="grid gap-2 px-4 py-3 sm:grid-cols-[170px_1fr] sm:items-center">
                  <span className="text-sm font-semibold text-slate-500">{label}</span>
                  <span className="text-sm font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {workflow.map((item, index) => (
                <div key={item} className="rounded-2xl border border-line bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-teal-50 p-4">
              <p className="text-sm font-semibold text-harbor">Prepared client summary</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Applicant likely needs employment residence route. Criminal record translation and accommodation
                proof need attention before consultation. Ria summary ready for professional review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
