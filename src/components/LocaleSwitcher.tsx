import { useLocation, useNavigate } from 'react-router-dom';

import type { AppLocale } from '../i18n/locale';

const locales: Array<{
  locale: AppLocale;
  label: string;
  flag: string;
  path: string;
}> = [
  { locale: 'en', label: 'EN', flag: '🇬🇧', path: '/' },
  { locale: 'sk', label: 'SK', flag: '🇸🇰', path: '/sk/' },
  { locale: 'rs', label: 'RS', flag: '🇷🇸', path: '/rs/' },
  { locale: 'ua', label: 'UA', flag: '🇺🇦', path: '/ua/' },
];

export function LocaleSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeLocale: AppLocale = pathname.startsWith('/sk')
    ? 'sk'
    : pathname.startsWith('/rs')
      ? 'rs'
      : pathname.startsWith('/ua')
        ? 'ua'
        : 'en';

  return (
    <div
      aria-label="Language"
      className="hidden items-center rounded-full border border-[#DDE8DF] bg-white/80 p-1 sm:flex"
    >
      {locales.map(({ locale, label, flag, path }) => (
        <button
          key={locale}
          type="button"
          aria-label={`Switch to ${label}`}
          aria-pressed={activeLocale === locale}
          onClick={() => navigate(path)}
          className={`rounded-full px-2 py-1.5 text-xs font-semibold transition ${
            activeLocale === locale
              ? 'bg-[#0F8A6A] text-white'
              : 'text-slate-600 hover:bg-[#EEF7F1] hover:text-ink'
          }`}
        >
          <span aria-hidden="true">{flag}</span>{' '}
          <span className="hidden xl:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
