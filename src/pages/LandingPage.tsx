import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChecklistPreview } from '../components/ChecklistPreview';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HowItWorks } from '../components/HowItWorks';
import { ProblemCard } from '../components/ProblemCard';
import { RiadenceHeroMockup } from '../components/RiadenceHeroMockup';
import { SocialProof } from '../components/SocialProof';
import type { AppLocale } from '../i18n/locale';

const RiaIntakeModal = lazy(() =>
  import('../components/RiaIntakeModal').then((module) => ({
    default: module.RiaIntakeModal,
  })),
);

type TextCard = { title: string; description: string };
const problemIndexes = [0, 4, 2];

export function LandingPage({ locale }: { locale: AppLocale }) {
  const { t, i18n } = useTranslation();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const allProblems = t('landing.problems', {
    returnObjects: true,
  }) as TextCard[];
  const problems = problemIndexes.map((index) => allProblems[index]);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  const openIntake = () => {
    setIntakeOpen(true);
  };

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <Header onStart={openIntake} />

      <main className="pt-[68px]">
        <section className="overflow-hidden border-b border-[#BFE6D2] bg-[radial-gradient(circle_at_50%_48%,rgba(167,243,208,0.26),transparent_30%),linear-gradient(180deg,#FFFCF6_0%,#F3FBF6_50%,#E4F5EA_100%)] py-5 sm:py-6 lg:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex rounded-full bg-[#EEF7F1] px-4 py-1.5 text-sm font-semibold text-[#0F8A6A] shadow-sm ring-1 ring-[#BFE6D2]">
                {t('landing.badge')}
              </p>
              <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-tight text-[#0B1726] sm:text-4xl lg:text-5xl">
                {t('landing.heroBefore')}{' '}
                <span className="text-[#0F8A6A]">{t('landing.heroCountry')}</span>
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {t('landing.heroDescription')}
              </p>
            </div>

            <div className="mt-3 sm:mt-4 lg:mt-2">
              <RiadenceHeroMockup />
            </div>

            <div className="mx-auto mt-4 max-w-3xl text-center">
              <HeroActions onStart={openIntake} />
            </div>
          </div>
        </section>

        <section className="bg-porcelain py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-harbor">{t('landing.problemEyebrow')}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {t('landing.problemTitle')}
                </h2>
              </div>
              <p className="rounded-3xl border border-line bg-white/70 p-5 text-base leading-7 text-slate-600 shadow-sm">
                {t('landing.problemIntro')}
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

        <ChecklistPreview />

        <FAQ onStart={openIntake} />
      </main>

      <Footer />
      {intakeOpen && (
        <Suspense fallback={null}>
          <RiaIntakeModal open onClose={() => setIntakeOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

function HeroActions({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();

  return (
    <>
      <button
        type="button"
        onClick={onStart}
        className="h-12 rounded-full bg-[#0F8A6A] px-6 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
      >
        {t('common.getChecklist')}
      </button>
      <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-5 text-slate-600">
        {t('common.disclaimer')}
      </p>
      <div className="mt-4">
        <TrustLine />
      </div>
      <SocialProof />
    </>
  );
}

function TrustLine() {
  const { t } = useTranslation();
  const trust = t('landing.trust', { returnObjects: true }) as string[];

  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm font-medium text-slate-600">
      <span>{trust[0]}</span>
      <span className="text-[#0F8A6A]">·</span>
      <span>{trust[1]}</span>
      <span className="text-[#0F8A6A]">·</span>
      <span>{trust[2]}</span>
    </div>
  );
}
