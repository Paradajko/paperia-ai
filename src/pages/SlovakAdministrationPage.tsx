import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { SlovakAdminContext } from '../components/SlovakAdminContext';

const RiaIntakeModal = lazy(() =>
  import('../components/RiaIntakeModal').then((module) => ({
    default: module.RiaIntakeModal,
  })),
);

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
      {intakeOpen && (
        <Suspense fallback={null}>
          <RiaIntakeModal open onClose={() => setIntakeOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
