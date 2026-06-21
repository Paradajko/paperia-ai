import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type ConsentState = 'show' | 'accepted' | 'declined';

const STORAGE_KEY = 'riadence_cookie_consent';

function readConsent(): ConsentState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'declined' ? stored : 'show';
  } catch {
    return 'show';
  }
}

export function CookieConsent() {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<ConsentState>(readConsent);

  const decide = (decision: Exclude<ConsentState, 'show'>) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, decision);
    } catch {
      // The disclosure can still be dismissed when browser storage is unavailable.
    }
    setConsent(decision);
  };

  if (consent !== 'show') {
    return null;
  }

  return (
    <aside
      aria-label={t('cookies.title')}
      className="fixed inset-x-3 bottom-3 z-[70] max-w-[400px] rounded-2xl border border-[#BFE6D2] bg-[#FFFCF6]/95 p-3 shadow-[0_18px_45px_rgba(11,23,38,0.16)] backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:p-4"
    >
      <h2 className="text-sm font-semibold text-ink">{t('cookies.title')}</h2>
      <p className="mt-1 text-xs leading-5 text-slate-700 sm:text-sm">
        {t('cookies.body')}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => decide('declined')}
          className="min-h-11 rounded-full border border-[#D7E9DE] bg-white px-4 text-sm font-semibold text-ink transition hover:border-[#A7F3D0]"
        >
          {t('cookies.decline')}
        </button>
        <button
          type="button"
          onClick={() => decide('accepted')}
          className="min-h-11 rounded-full bg-[#0F8A6A] px-4 text-sm font-semibold text-white transition hover:bg-[#0B6F56]"
        >
          {t('cookies.accept')}
        </button>
      </div>
    </aside>
  );
}
