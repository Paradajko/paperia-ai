import { useState } from 'react';

import { AgencySection } from './components/AgencySection';
import { ChecklistFlow } from './components/ChecklistFlow';
import { ChecklistPreview } from './components/ChecklistPreview';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HowItWorks } from './components/HowItWorks';
import { PricingCard } from './components/PricingCard';
import { ProblemCard } from './components/ProblemCard';
import { PaperiaHeroMockup } from './components/PaperiaHeroMockup';
import { RiaIntakeModal } from './components/RiaIntakeModal';

const problems = [
  {
    title: 'Unclear document lists',
    description: 'Different sources say different things, so it is hard to know what actually applies to your case.',
  },
  {
    title: 'Agency costs too early',
    description: 'Many people pay before they even understand the likely route or what is missing.',
  },
  {
    title: 'Translation and apostille risks',
    description: 'A document can look ready until an office asks for a translation, legalization, or newer version.',
  },
  {
    title: 'Fear of one mistake',
    description: 'Applicants often worry that one missing proof or wrong date can delay the whole process.',
  },
  {
    title: 'Wrong route confusion',
    description: 'Employment, study, family, and business routes can look similar until the paperwork starts.',
  },
  {
    title: 'Appointments feel high stakes',
    description: 'It is stressful to show up without knowing which questions or missing documents may come up.',
  },
];

const avoidItems = [
  'Paying an agency before you understand your case',
  'Missing translations or apostille',
  'Wrong residence route',
  'Confusing document requirements',
  'Deadline surprises',
  'Going to an appointment unprepared',
];

const pricing = [
  {
    title: 'Paperia checklist',
    price: 'Free',
    description:
      'Complete the Slovakia wizard, get your personalized PDF checklist, receive email follow-up, and ask Ria practical questions.',
    badge: 'Always free',
    featured: true,
  },
  {
    title: 'Licensed agency or lawyer',
    price: 'Case by case',
    description:
      'Optional paid support for asylum, deportation defense, appeals, prior refusals, or unusually complex family reunification cases.',
    badge: 'Complex cases only',
  },
];

function App() {
  const [intakeOpen, setIntakeOpen] = useState(false);

  const openIntake = () => {
    setIntakeOpen(true);
  };

  const contactPartnerTeam = () => {
    window.location.href = 'mailto:hello@riadence.com?subject=Paperia%20partner%20workspace';
  };

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <Header onStart={openIntake} />

      <main className="pt-[68px]">
        <section className="overflow-hidden border-b border-[#BFE6D2] bg-[radial-gradient(circle_at_50%_48%,rgba(167,243,208,0.26),transparent_30%),linear-gradient(180deg,#FFFCF6_0%,#F3FBF6_50%,#E4F5EA_100%)] py-5 sm:py-6 lg:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex rounded-full bg-[#EEF7F1] px-4 py-1.5 text-sm font-semibold text-[#0F8A6A] shadow-sm ring-1 ring-[#BFE6D2]">
                Free Slovakia residence checklist
              </p>
              <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-tight text-[#0B1726] sm:text-4xl lg:text-5xl">
                Moving from the Balkans, India, Turkey, Ukraine, or beyond to{' '}
                <span className="text-[#0F8A6A]">Slovakia?</span>
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Answer five practical questions and Ria prepares a personalized PDF checklist for your likely
                residence route, documents, timeline, and next steps.
              </p>
            </div>

            <div className="mx-auto mt-5 max-w-3xl text-center lg:hidden">
              <HeroActions onStart={openIntake} showTrust={false} />
            </div>

            <div className="mt-3 sm:mt-4 lg:mt-2">
              <PaperiaHeroMockup />
            </div>

            <div className="mx-auto mt-4 max-w-3xl text-center lg:hidden">
              <TrustLine />
            </div>

            <div className="mx-auto mt-2 hidden max-w-3xl text-center lg:block">
              <HeroActions onStart={openIntake} />
            </div>
          </div>
        </section>

        <section className="bg-porcelain py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-harbor">The paperwork problem</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Residence paperwork is confusing when nobody explains it.
                </h2>
              </div>
              <p className="rounded-3xl border border-line bg-white/70 p-5 text-base leading-7 text-slate-600 shadow-sm">
                Paperia gives you a structured first step: build a Slovakia-specific checklist, keep the result as a
                PDF, and know when a complex case needs licensed help.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem) => (
                <ProblemCard key={problem.title} {...problem} />
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />

        <section className="border-y border-line bg-[linear-gradient(180deg,#FFFCF6_0%,#EEF7F1_100%)] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-harbor">From confusion to a clearer plan</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                What a structured checklist helps you avoid
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Your answers become a clearer route, document plan, PDF timeline, and handoff summary.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {avoidItems.map((item) => (
                <article key={item} className="rounded-3xl border border-line bg-white/74 p-5 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#EEF7F1] text-sm font-bold text-[#0F8A6A] ring-1 ring-[#DDE8DF]">
                    ✓
                  </span>
                  <h3 className="mt-4 text-base font-semibold leading-6 text-ink">{item}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ChecklistPreview />
        <ChecklistFlow onStart={openIntake} />
        <AgencySection onJoin={contactPartnerTeam} />

        <section id="pricing" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Simple pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Paperia is free. Professional help is case by case.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                There is no monthly subscription. Standard checklist generation stays free; complex legal work is
                priced directly by the licensed agency or lawyer handling the case.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
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

        <section className="bg-[linear-gradient(180deg,#EEF7F1_0%,#FFFCF6_100%)] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-harbor">Final check</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Start your Slovakia residence checklist.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Answer five questions, download your personalized PDF, then ask Ria any follow-up questions.
            </p>
            <button
              type="button"
              onClick={openIntake}
              className="mt-7 rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
            >
              Get your free checklist
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <RiaIntakeModal open={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </div>
  );
}

function HeroActions({ onStart, showTrust = true }: { onStart: () => void; showTrust?: boolean }) {
  return (
    <>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
        >
          Get your free checklist
        </button>
        <button
          type="button"
          onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="rounded-full border border-[#D7E9DE] bg-white/76 px-6 py-3 text-sm font-semibold text-ink transition hover:border-[#A7F3D0] hover:bg-white"
        >
          View sample PDF
        </button>
      </div>
      <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-5 text-slate-600">
        I am not a lawyer. This is guidance only, not legal advice.
      </p>
      {showTrust && (
        <div className="mt-4">
          <TrustLine />
        </div>
      )}
    </>
  );
}

function TrustLine() {
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm font-medium text-slate-600">
      <span>Guidance only</span>
      <span className="text-[#0F8A6A]">·</span>
      <span>Not legal advice</span>
      <span className="text-[#0F8A6A]">·</span>
      <span>Expert handoff when needed</span>
    </div>
  );
}

export default App;
