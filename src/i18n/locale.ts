export type AppLocale = 'en' | 'sk' | 'rs' | 'ua';

export function detectLocaleFromPath(pathname: string): AppLocale {
  const match = pathname.match(/^\/(sk|rs|ua)(?:\/|$)/);
  return (match?.[1] as AppLocale | undefined) ?? 'en';
}

export function localizedPath(locale: AppLocale, page = ''): string {
  const normalizedPage = page.replace(/^\/+|\/+$/g, '');
  const localePrefix = locale === 'en' ? '' : `/${locale}`;

  if (!normalizedPage) {
    return locale === 'en' ? '/' : `${localePrefix}/`;
  }

  return `${localePrefix}/${normalizedPage}`;
}

export function pageFromPath(pathname: string): string {
  return pathname
    .replace(/^\/(sk|rs|ua)(?=\/|$)/, '')
    .replace(/^\/+|\/+$/g, '');
}
