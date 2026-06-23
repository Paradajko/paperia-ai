import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AgencySection } from '../components/AgencySection';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import type { AppLocale } from '../i18n/locale';

const RiaIntakeModal = lazy(() =>
  import('../components/RiaIntakeModal').then((module) => ({
    default: module.RiaIntakeModal,
  })),
);

export function AgencyPage({ locale }: { locale: AppLocale }) {
  const { i18n } = useTranslation();
  const [intakeOpen, setIntakeOpen] = useState(false);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  const contactPartnerTeam = () => {
    window.location.href =
      'mailto:hello@riadence.com?subject=Riadence%20partner%20workspace';
  };

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <Header onStart={() => setIntakeOpen(true)} />
      <main className="pt-[68px]">
        <AgencySection onJoin={contactPartnerTeam} />
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
