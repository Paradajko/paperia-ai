import type { ReactNode } from 'react';

const documentItems = [
  { name: 'Valid passport', status: 'Ready', note: 'Check expiry date' },
  { name: 'Employment confirmation', status: 'Employer', note: 'Ask HR for signed proof' },
  { name: 'Criminal record extract', status: 'Missing', note: 'Translation likely required' },
  { name: 'Accommodation proof', status: 'Missing', note: 'Address and consent must match' },
  { name: 'Financial means proof', status: 'Review', note: 'Confirm accepted format' },
];

const riskItems = [
  'Criminal record older than accepted window',
  'Translation not completed by a recognized translator',
  'Accommodation document missing owner consent',
];

const preparedItems = [
  'Personalized checklist',
  'Document plan',
  'Translation and apostille notes',
  'Timeline',
  'Risk flags',
  'Questions for your employer',
  'Expert-ready case summary',
];

export function ChecklistPreview() {
  return (
    <section id="product" className="bg-porcelain py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">What Ria prepares for you</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A case picture clear enough to avoid paying thousands just to understand where you stand.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Ria starts with employment-based residence in Slovakia and prepares the practical pieces applicants
            need before deciding whether expert support is necessary.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {preparedItems.map((item) => (
            <div key={item} className="rounded-2xl border border-line bg-white/70 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-harbor ring-1 ring-teal-100">
                  ✓
                </span>
                <span className="text-sm font-semibold text-slate-800">{item}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-night/10 bg-night p-2 shadow-agent">
            <div className="rounded-[1.55rem] bg-porcelain p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-night px-4 py-3 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">Ria generated output</p>
                  <p className="text-sm text-slate-300">Employment residence · Slovakia</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">Preview</span>
              </div>
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-harbor">Profile summary and route recommendation</p>
                  <h3 className="mt-1 text-2xl font-semibold text-ink">
                    Slovakia temporary residence - employment
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Applicant: non-EU worker · destination: Slovakia · purpose: employment. Confirm final
                    requirements with official sources or a qualified professional.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-caution">Risk level</p>
                  <p className="text-lg font-semibold text-amber-800">Medium</p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-line">
                {documentItems.map((item, index) => (
                  <div
                    key={item.name}
                    className={`grid gap-3 bg-white px-4 py-4 sm:grid-cols-[1fr_110px_1.2fr] sm:items-center ${
                      index !== documentItems.length - 1 ? 'border-b border-line' : ''
                    }`}
                  >
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Ready'
                          ? 'bg-green-50 text-approval'
                          : item.status === 'Missing'
                            ? 'bg-amber-50 text-caution'
                            : 'bg-sky-50 text-slateblue'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-sm text-slate-600">{item.note}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
                <p className="text-sm font-semibold text-harbor">Next action</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Request a fresh criminal record extract, then prepare official translation before submission.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <PreviewPanel title="Translation / apostille notes" tone="blue">
              <p>
                Foreign criminal records and public documents may need official translation and legalization before
                submission.
              </p>
            </PreviewPanel>
            <PreviewPanel title="Timeline and deadlines" tone="green">
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[62%] rounded-full bg-harbor" />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs font-medium text-slate-500">
                <span>Prepare</span>
                <span>Translate</span>
                <span>Submit</span>
                <span>Decision</span>
              </div>
            </PreviewPanel>
            <PreviewPanel title="Common mistakes" tone="amber">
              <ul className="space-y-2">
                {riskItems.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </PreviewPanel>
            <PreviewPanel title="Questions to ask employer" tone="blue">
              <p>Will they provide signed employment proof, salary confirmation, and any required office documents?</p>
            </PreviewPanel>
            <PreviewPanel title="Expert handoff" tone="green">
              <p>
                If the case has refusals, missing records, dependents, or unusual timelines, Ria can prepare a
                case summary for a verified expert later.
              </p>
            </PreviewPanel>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewPanel({
  title,
  tone,
  children,
}: {
  title: string;
  tone: 'blue' | 'green' | 'amber';
  children: ReactNode;
}) {
  const color = {
    blue: 'border-sky-100 bg-sky-50 text-slateblue',
    green: 'border-teal-100 bg-teal-50 text-harbor',
    amber: 'border-amber-100 bg-amber-50 text-caution',
  }[tone];

  return (
    <article className={`rounded-3xl border p-5 shadow-sm ${color}`}>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </article>
  );
}
