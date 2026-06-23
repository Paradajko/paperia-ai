import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { PricingCard } from '../components/PricingCard';
import { RiaIntakeModal } from '../components/RiaIntakeModal';
import type { AppLocale } from '../i18n/locale';

type PricingItem = {
  title: string;
  description: string;
  price: string;
  badge: string;
};

export function PricingPage({ locale }: { locale: AppLocale }) {
  const { t, i18n } = useTranslation();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const pricing = t('pricing.cards', {
    returnObjects: true,
  }) as PricingItem[];

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <Header onStart={() => setIntakeOpen(true)} />
      <main className="pt-[68px]">
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
                {t('pricing.eyebrow')}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t('pricing.title')}
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {t('pricing.description')}
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
                  <p className="text-sm font-semibold text-ink">
                    {t('pricing.workspaceTitle')}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {t('pricing.workspaceDescription')}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-line">
                  {t('pricing.comingSoon')}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <RiaIntakeModal open={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </div>
  );
}
