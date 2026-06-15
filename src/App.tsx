import { AgencySection } from './components/AgencySection';
import { ChecklistFlow } from './components/ChecklistFlow';
import { ChecklistPreview } from './components/ChecklistPreview';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HowItWorks } from './components/HowItWorks';
import { PricingCard } from './components/PricingCard';
import { ProblemCard } from './components/ProblemCard';
import { RiaHeroMockup } from './components/RiaHeroMockup';

const problems = [
  {
    title: "I don't know which permit I need",
    description: 'Applicants often pay for help before they even understand the likely residence route.',
  },
  {
    title: "I don't know which documents are missing",
    description: 'Small gaps like translations, dates, or address proof can slow the entire process down.',
  },
  {
    title: "I don't understand the language or offices",
    description: 'The process involves unfamiliar terminology, local offices, and timing that is hard to decode.',
  },
  {
    title: 'I am afraid one mistake will delay my application',
    description: 'Ria surfaces practical risks early so applicants know when expert review is worth it.',
  },
];

const pricing = [
  {
    title: 'Free orientation',
    price: '€0',
    description: 'Route overview, first document list, and guidance-only disclaimer for early clarity.',
  },
  {
    title: 'Ria personal checklist',
    price: 'from €29',
    description: 'A deeper checklist, preparation timeline, and missing-document view for your case.',
    featured: true,
  },
  {
    title: 'Document preparation pack',
    price: 'from €79',
    description: 'Document organization support, translation flags, employer questions, and expert-ready handoff notes.',
  },
];

function App() {
  const scrollToChecklist = () => {
    document.getElementById('checklist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToAgencies = () => {
    document.getElementById('agencies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showWaitlistPlaceholder = () => {
    window.alert('Partner waitlist is a placeholder in this MVP. No data is submitted yet.');
  };

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <Header onStart={scrollToChecklist} />

      <main>
        <section className="overflow-hidden border-b border-line bg-[linear-gradient(180deg,#F7F3EA_0%,#FFFCF6_62%,#F3F7F4_100%)] py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 xl:gap-10">
            <div className="min-w-0">
              <p className="inline-flex rounded-full border border-line bg-porcelain px-3 py-1 text-sm font-semibold text-harbor shadow-sm">
                AI residence guide for Europe
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Meet Ria, your AI residence guide for Europe.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Before you pay an agency, Ria helps you understand your likely residence route, missing documents,
                timeline, and risks.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={scrollToChecklist}
                  className="rounded-full bg-night px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(11,23,38,0.2)] transition hover:bg-slate-800"
                >
                  Start with Ria
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="rounded-full border border-line bg-porcelain px-6 py-3 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-white"
                >
                  See how Ria helps
                </button>
              </div>
              <div className="mt-5 grid max-w-xl grid-cols-3 gap-2">
                <MiniProof label="First market" value="Slovakia" />
                <MiniProof label="Starting route" value="Employment" />
                <MiniProof label="Boundary" value="No legal advice" />
              </div>
            </div>
            <div className="min-w-0">
              <RiaHeroMockup />
            </div>
          </div>
        </section>

        <section className="bg-porcelain py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Why Ria exists</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Residence paperwork is expensive because the process is unclear.
                </h2>
              </div>
              <p className="rounded-3xl border border-line bg-white/70 p-5 text-base leading-7 text-slate-600 shadow-sm">
                Ria is the cheaper first step: understand your likely path, see what is missing, and decide whether
                your case needs a verified expert before committing to full-service support.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {problems.map((problem) => (
                <ProblemCard key={problem.title} {...problem} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <AudienceCard
              eyebrow="For non-EU citizens"
              title="Start with Ria before paying for full-service help."
              text="Understand your likely route, required documents, translations, deadlines, and common mistakes with a calm AI guide built for residence paperwork."
              button="Start with Ria"
              primary
              onClick={scrollToChecklist}
            />
            <AudienceCard
              eyebrow="For agencies and lawyers"
              title="Cleaner intake before consultation."
              text="Ria does not replace professionals. It helps prepare structured intake, missing-document views, and expert-ready summaries before the first call."
              button="Join partner waitlist"
              onClick={showWaitlistPlaceholder}
            />
          </div>
        </section>

        <ChecklistPreview />
        <ChecklistFlow />
        <HowItWorks />
        <AgencySection onJoin={showWaitlistPlaceholder} />

        <section id="pricing" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Pricing teaser</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Start with orientation, pay only when deeper preparation helps.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Pricing is illustrative for the MVP and not final production pricing. Ria does not guarantee
                approval, file applications, or replace licensed legal advice.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {pricing.map((item) => (
                <PricingCard key={item.title} {...item} />
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-line bg-porcelain p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Agency workspace</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Structured intake, multilingual instructions, and case handoff tools for professionals.
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-line">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

function MiniProof({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white/60 px-3 py-2 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function AudienceCard({
  eyebrow,
  title,
  text,
  button,
  primary = false,
  onClick,
}: {
  eyebrow: string;
  title: string;
  text: string;
  button: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <article
      className={`rounded-3xl border p-6 shadow-sm sm:p-8 ${
        primary
          ? 'border-teal-200 bg-[linear-gradient(135deg,#EAF8F4_0%,#FFFCF6_100%)] shadow-soft'
          : 'border-line bg-porcelain'
      }`}
    >
      <p className={`text-sm font-semibold uppercase tracking-wide ${primary ? 'text-harbor' : 'text-slateblue'}`}>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
      <button
        type="button"
        onClick={onClick}
        className={`mt-6 rounded-full px-5 py-3 text-sm font-semibold transition ${
          primary
            ? 'bg-harbor text-white hover:bg-teal-800'
            : 'border border-slate-300 bg-white text-ink hover:border-slate-400'
        }`}
      >
        {button}
      </button>
    </article>
  );
}

export default App;
