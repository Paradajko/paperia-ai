export function ChecklistFlow() {
  return (
    <section id="checklist" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Start here</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Start with Ria before expensive agency packages.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Many applicants pay for full-service help because they cannot tell what is missing. Ria starts with
            structure: your route, document gaps, risk flags, and the point where expert review makes sense.
          </p>
        </div>

        <div className="rounded-[2rem] border border-line bg-porcelain p-5 shadow-agent sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nationality" value="Non-EU citizen" />
            <Field label="Purpose of stay" value="Employment" />
            <Field label="Has employer?" value="Yes, Slovak employer" />
            <Field label="Current location" value="Outside Slovakia" />
          </div>
          <div className="mt-5 rounded-3xl border border-dashed border-teal-200 bg-white/70 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Disabled result preview</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  In this MVP, the flow is visual only. The next version can connect these answers to static rules
                  and then generate a Ria checklist for Slovakia.
                </p>
              </div>
              <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-harbor ring-1 ring-teal-100">
                Preview mode
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Result label="Likely route" value="Employment" />
              <Result label="Missing" value="3 docs" />
              <Result label="Next action" value="Translate record" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        disabled
        value={value}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700"
      >
        <option>{value}</option>
      </select>
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
