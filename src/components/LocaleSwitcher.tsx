import { useLocation, useNavigate } from 'react-router-dom';

import {
  detectLocaleFromPath,
  localizedPath,
  pageFromPath,
  type AppLocale,
} from '../i18n/locale';

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

type LocaleSwitcherProps = {
  compact?: boolean;
};

export function LocaleSwitcher({ compact = false }: LocaleSwitcherProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeLocale = detectLocaleFromPath(pathname);
  const currentPathPage = pageFromPath(pathname);
  const currentPage = ['pricing', 'for-agencies'].includes(currentPathPage)
    ? currentPathPage
    : '';
  const switchLocale = (locale: AppLocale) => {
    navigate(localizedPath(locale, currentPage));
  };

  if (compact) {
    return (
      <label className="relative block sm:hidden">
        <span className="sr-only">Language</span>
        <select
          aria-label="Language"
          value={activeLocale}
          onChange={(event) => {
            const selected = locales.find(
              ({ locale }) => locale === event.target.value,
            );
            if (selected) switchLocale(selected.locale);
          }}
          className="min-h-11 min-w-14 appearance-none rounded-full border border-[#DDE8DF] bg-white px-3 pr-7 text-xs font-semibold text-slate-700"
        >
          {locales.map(({ locale, label, flag }) => (
            <option key={locale} value={locale}>
              {flag} {label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500"
        >
          ▾
        </span>
      </label>
    );
  }

  return (
    <div
      aria-label="Language"
      className="hidden items-center rounded-full border border-[#DDE8DF] bg-white/80 p-1 sm:flex"
    >
      {locales.map(({ locale, label, flag }) => (
        <button
          key={locale}
          type="button"
          aria-label={`Switch to ${label}`}
          aria-pressed={activeLocale === locale}
          onClick={() => switchLocale(locale)}
          className={`min-h-11 min-w-11 rounded-full px-2 text-xs font-semibold transition ${
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
