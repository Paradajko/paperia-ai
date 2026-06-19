const agencyRows = [
  ['Case type', 'Appeal after previous refusal'],
  ['Risk level', 'Professional review required'],
  ['Missing documents', '3 priority items'],
  ['Prepared summary', 'Ready for consultation'],
  ['Client language', 'English / Ukrainian / Serbian / Slovak'],
];

const workflow = ['Client answers', 'Ria structures', 'Professional reviews'];

export function AgencySection({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="agencies" className="bg-[#064E3B] py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#A7F3D0]">For professionals</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ria does not replace experts. She prepares better clients.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#D9F6EA]/82">
            Riadence stays free for standard checklist preparation. Licensed agencies and lawyers are most useful for
            genuinely complex cases: asylum, deportation defense, appeals, previous refusals, or family reunification
            with a difficult case history.
          </p>
          <button
            type="button"
            onClick={onJoin}
            className="mt-7 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#064E3B] transition hover:bg-[#EEF7F1]"
          >
            Partner with Riadence
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/12 bg-white/[0.08] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur sm:p-4">
          <div className="rounded-2xl bg-white p-5 text-ink">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Professional intake</p>
                <h3 className="mt-1 text-xl font-semibold">Ria-prepared case intake</h3>
              </div>
              <span className="rounded-full bg-[#EEF7F1] px-3 py-1 text-xs font-semibold text-harbor ring-1 ring-[#BFE6D2]">Partner beta</span>
            </div>
            <div className="mt-4 divide-y divide-[#DDE8DF] rounded-2xl border border-line">
              {agencyRows.map(([label, value]) => (
                <div key={label} className="grid gap-2 px-4 py-3 sm:grid-cols-[170px_1fr] sm:items-center">
                  <span className="text-sm font-semibold text-slate-500">{label}</span>
                  <span className="text-sm font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {workflow.map((item, index) => (
                <div key={item} className="rounded-2xl border border-line bg-[#F7FBF8] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-[#BFE6D2] bg-[#EEF7F1] p-4">
              <p className="text-sm font-semibold text-harbor">Prepared client summary</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Applicant has a previous refusal and a family reunification route with disputed supporting evidence.
                Ria has organized the timeline and missing records for licensed professional review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
