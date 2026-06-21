export type AppLocale = 'en' | 'sk' | 'rs' | 'ua';

export function detectLocaleFromPath(pathname: string): AppLocale {
  const match = pathname.match(/^\/(sk|rs|ua)(?:\/|$)/);
  return (match?.[1] as AppLocale | undefined) ?? 'en';
}
