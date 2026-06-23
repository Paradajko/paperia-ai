import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { detectLocaleFromPath, localizedPath } from '../i18n/locale';
import { Logo } from './Logo';

export function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const locale = detectLocaleFromPath(pathname);
  const home = localizedPath(locale);

  return (
    <footer className="bg-porcelain">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <Logo sublabel />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {t('footer.description')}
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 md:text-right">
            <Link to={localizedPath(locale, 'pricing')} className="hover:text-ink">
              {t('common.pricing')}
            </Link>
            <a href={`${home}#faq`} className="hover:text-ink">
              {t('common.faq')}
            </a>
            {locale === 'sk' && (
              <Link
                to={localizedPath(locale, 'administrativa')}
                className="hover:text-ink"
              >
                {t('slovakAdminContext.eyebrow')}
              </Link>
            )}
            <Link to="/privacy" className="hover:text-ink">
              {t('common.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-ink">
              {t('common.terms')}
            </Link>
            <a href="mailto:hello@riadence.com" className="hover:text-ink">
              {t('common.contact')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
