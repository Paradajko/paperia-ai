import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AgencySection } from '../components/AgencySection';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { RiaIntakeModal } from '../components/RiaIntakeModal';
import type { AppLocale } from '../i18n/locale';

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
      <RiaIntakeModal open={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </div>
  );
}
