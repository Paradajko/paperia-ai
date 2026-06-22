import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AgencySection } from '../components/AgencySection';
import { ChecklistFlow } from '../components/ChecklistFlow';
import { ChecklistPreview } from '../components/ChecklistPreview';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HowItWorks } from '../components/HowItWorks';
import { PricingCard } from '../components/PricingCard';
import { ProblemCard } from '../components/ProblemCard';
import { RiadenceHeroMockup } from '../components/RiadenceHeroMockup';
import { RiaIntakeModal } from '../components/RiaIntakeModal';
import { SlovakAdminContext } from '../components/SlovakAdminContext';
import { SocialProof } from '../components/SocialProof';
import type { AppLocale } from '../i18n/locale';

type TextCard = { title: string; description: string };
type PricingItem = TextCard & { price: string; badge: string };

export function LandingPage({ locale }: { locale: AppLocale }) {
  const { t, i18n } = useTranslation();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const problems = t('landing.problems', { returnObjects: true }) as TextCard[];
  const avoidItems = t('landing.avoidItems', { returnObjects: true }) as string[];
  const pricing = t('landing.pricingCards', {
    returnObjects: true,
  }) as PricingItem[];

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  const openIntake = () => {
    setIntakeOpen(true);
  };

  const contactPartnerTeam = () => {
    window.location.href = 'mailto:hello@riadence.com?subject=Riadence%20partner%20workspace';
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

            <div className="mx-auto mt-5 max-w-3xl text-center lg:hidden">
              <HeroActions onStart={openIntake} showTrust={false} />
            </div>

            <div className="mt-3 sm:mt-4 lg:mt-2">
              <RiadenceHeroMockup />
            </div>

            <div className="mx-auto mt-4 max-w-3xl text-center lg:hidden">
              <TrustLine />
            </div>

            <div className="mx-auto mt-2 hidden max-w-3xl text-center lg:block">
              <HeroActions onStart={openIntake} />
            </div>
          </div>
        </section>

        <SocialProof />

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
        {locale === 'sk' && <SlovakAdminContext />}

        <section className="border-y border-line bg-[linear-gradient(180deg,#FFFCF6_0%,#EEF7F1_100%)] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-harbor">{t('landing.clarityEyebrow')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t('landing.clarityTitle')}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {t('landing.clarityDescription')}
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
              <p className="text-sm font-semibold uppercase tracking-wide text-harbor">{t('landing.pricingEyebrow')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t('landing.pricingTitle')}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {t('landing.pricingDescription')}
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {pricing.map((item, index) => (
                <PricingCard key={item.title} {...item} featured={index === 0} />
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-line bg-porcelain p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{t('landing.workspaceTitle')}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {t('landing.workspaceDescription')}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-line">
                  {t('landing.comingSoon')}
                </span>
              </div>
            </div>
          </div>
        </section>

        <FAQ />

        <section className="bg-[linear-gradient(180deg,#EEF7F1_0%,#FFFCF6_100%)] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-harbor">{t('landing.finalEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t('landing.finalTitle')}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t('landing.finalDescription')}
            </p>
            <button
              type="button"
              onClick={openIntake}
              className="mt-7 min-h-12 rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
            >
              {t('common.getChecklist')}
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
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onStart}
          className="min-h-12 rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,138,106,0.22)] transition hover:bg-[#0B6F56]"
        >
          {t('common.getChecklist')}
        </button>
        <button
          type="button"
          onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="min-h-12 rounded-full border border-[#D7E9DE] bg-white/76 px-6 py-3 text-sm font-semibold text-ink transition hover:border-[#A7F3D0] hover:bg-white"
        >
          {t('common.samplePdf')}
        </button>
      </div>
      <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-5 text-slate-600">
        {t('common.disclaimer')}
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
