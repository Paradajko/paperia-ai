import riaPortrait from '../assets/ria-portrait.png';

const resultRows = [
  ['Route', 'Temporary residence for employment'],
  ['Missing documents', '3'],
  ['Risk', 'Medium'],
  ['Next step', 'Translated criminal record'],
  ['Expert handoff', 'Optional'],
];

export function RiaHeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[680px] min-w-0">
      <div className="absolute -inset-x-5 top-12 h-48 rounded-full bg-coral/[0.12] blur-3xl" />
      <div className="relative rounded-[2.2rem] border border-night/10 bg-night p-2 shadow-agent">
        <div className="overflow-hidden rounded-[1.75rem] bg-porcelain">
          <div className="flex items-center justify-between border-b border-white/10 bg-night px-4 py-3 text-white sm:px-5">
            <div>
              <p className="text-sm font-semibold">Meet Ria</p>
              <p className="text-xs text-slate-300">AI residence guide · not a lawyer or consultant</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Guidance only
            </span>
          </div>

          <div className="grid gap-4 bg-[linear-gradient(135deg,rgba(231,222,208,.50)_0_1px,transparent_1px_26px)] p-4 sm:p-5">
            <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
              <section className="relative overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_18px_50px_rgba(16,32,51,0.12)]">
                <div className="relative h-[250px] sm:h-[310px] lg:h-full lg:min-h-[390px]">
                  <img
                    src={riaPortrait}
                    alt="Ria, AI residence guide portrait"
                    className="h-full w-full object-cover object-[center_26%]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/70 to-transparent p-5 pt-20 text-white">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h2 className="text-3xl font-semibold leading-none">Ria</h2>
                        <p className="mt-2 text-sm text-slate-200">AI residence guide</p>
                      </div>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                        AI guide
                      </span>
                    </div>
                    <p className="mt-4 rounded-2xl bg-white/12 px-3 py-2 text-xs leading-5 text-slate-100 ring-1 ring-white/15">
                      Guidance only · Not legal advice
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid min-w-0 gap-4">
                <section className="rounded-[1.6rem] border border-line bg-white p-4 shadow-[0_16px_40px_rgba(16,32,51,0.08)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-harbor">Chat preview</p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">Ria talks you through the route</h3>
                    </div>
                    <span className="hidden rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-harbor ring-1 ring-teal-100 xl:inline-flex">
                      Slovakia
                    </span>
                  </div>
                  <div className="space-y-3">
                    <ChatBubble speaker="Ria">
                      Tell me where you&apos;re from and why you&apos;re moving to Slovakia.
                    </ChatBubble>
                    <ChatBubble speaker="Applicant" applicant>
                      I have a job offer.
                    </ChatBubble>
                    <ChatBubble speaker="Ria">
                      Your likely route is temporary residence for employment. I found 3 documents to prepare first.
                    </ChatBubble>
                  </div>
                </section>

                <section className="rounded-[1.6rem] border border-line bg-white p-4 shadow-[0_16px_40px_rgba(16,32,51,0.08)]">
                  <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-harbor">Ria output</p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">Clear plan before paid help</h3>
                    </div>
                    <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-caution ring-1 ring-amber-100">
                      Medium risk
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {resultRows.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid gap-1 rounded-2xl bg-slate-50/80 px-3 py-2.5 xl:grid-cols-[112px_1fr] xl:items-center"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                        <span className="text-sm font-semibold text-ink">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  speaker,
  applicant = false,
  children,
}: {
  speaker: string;
  applicant?: boolean;
  children: string;
}) {
  return (
    <div className={`flex ${applicant ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          applicant
            ? 'rounded-tr-md bg-night text-white'
            : 'rounded-tl-md border border-line bg-porcelain text-slate-700'
        }`}
      >
        <p className={applicant ? 'text-xs font-semibold text-slate-300' : 'text-xs font-semibold text-harbor'}>
          {speaker}
        </p>
        <p className="mt-1">{children}</p>
      </div>
    </div>
  );
}
