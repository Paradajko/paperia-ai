const checklist = [
  { label: 'Passport copy', status: 'Ready', tone: 'green' },
  { label: 'Employment confirmation', status: 'Review', tone: 'blue' },
  { label: 'Criminal record translation', status: 'Missing', tone: 'amber' },
  { label: 'Accommodation proof', status: 'Missing', tone: 'amber' },
];

export function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-sky-100 blur-2xl lg:block" />
      <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Case preview</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">Slovakia temporary residence</h2>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-harbor">
            Employment
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Applicant" value="Non-EU worker" />
          <Metric label="Missing docs" value="3" highlight />
          <Metric label="Risk level" value="Medium" warning />
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-caution">Next step</p>
          <p className="mt-1 text-sm font-semibold text-ink">Prepare translated criminal record</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Foreign public documents may need official translation and legalization before submission.
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Timeline progress</span>
            <span>Documents in preparation</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 w-[58%] rounded-full bg-slateblue" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-medium text-slate-500">
            <span>Route</span>
            <span>Collect</span>
            <span>Submit</span>
            <span>Decision</span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200">
          {checklist.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-3 px-4 py-3 ${
                index !== checklist.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 flex-none rounded-full ${
                    item.tone === 'green'
                      ? 'bg-green-600'
                      : item.tone === 'blue'
                        ? 'bg-sky-600'
                        : 'bg-amber-500'
                  }`}
                />
                <span className="truncate text-sm font-medium text-slate-700">{item.label}</span>
              </div>
              <span className="flex-none rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight = false,
  warning = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        warning
          ? 'border-amber-200 bg-amber-50'
          : highlight
            ? 'border-teal-200 bg-teal-50'
            : 'border-slate-200 bg-slate-50'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
