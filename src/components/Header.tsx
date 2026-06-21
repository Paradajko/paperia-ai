import { useTranslation } from 'react-i18next';

import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';

type HeaderProps = {
  onStart: () => void;
};

export function Header({ onStart }: HeaderProps) {
  const { t } = useTranslation();
  const navItems = [
    { label: t('header.nav.how'), href: '#how-it-works' },
    { label: t('header.nav.sample'), href: '#product' },
    { label: t('header.nav.agencies'), href: '#agencies' },
    { label: t('header.nav.pricing'), href: '#pricing' },
    { label: t('header.nav.faq'), href: '#faq' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#DDE8DF]/80 bg-[#FFFCF6]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden border-l border-[#DDE8DF] pl-3 text-xs font-semibold text-slate-500 xl:block">
            {t('header.tagline')}
          </span>
        </div>
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-3.5 py-2 transition hover:bg-[#EEF7F1] hover:text-[#0B1726]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={onStart}
            className="rounded-full bg-[#0F8A6A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,138,106,0.18)] transition hover:bg-[#0B6F56] sm:px-5"
          >
            {t('common.getChecklist')}
          </button>
        </div>
      </div>
    </header>
  );
}
