import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-3xl border border-[#BFE6D2] bg-[#FFFCF6]/95 p-4 shadow-[0_20px_60px_rgba(11,23,38,0.18)] backdrop-blur-xl sm:bottom-5 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-700">
          We use only essential cookies for site functionality. No tracking, no analytics. Read our{' '}
          <Link
            to="/privacy"
            className="font-semibold text-harbor underline decoration-[#A7F3D0] underline-offset-4 hover:text-night"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-none gap-2">
          <button
            type="button"
            onClick={() => decide('declined')}
            className="rounded-full border border-[#D7E9DE] bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-[#A7F3D0]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="rounded-full bg-[#0F8A6A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B6F56]"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
