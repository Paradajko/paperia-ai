import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { RiaIntakeModal } from '../components/RiaIntakeModal';
import { SlovakAdminContext } from '../components/SlovakAdminContext';

export function SlovakAdministrationPage() {
  const { i18n } = useTranslation();
  const [intakeOpen, setIntakeOpen] = useState(false);

  useEffect(() => {
    void i18n.changeLanguage('sk');
  }, [i18n]);

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <Header onStart={() => setIntakeOpen(true)} />
      <main className="pt-[68px]">
        <SlovakAdminContext />
      </main>
      <Footer />
      <RiaIntakeModal open={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </div>
  );
}
