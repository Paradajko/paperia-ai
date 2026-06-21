import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/translation.json';
import rs from '../locales/rs/translation.json';
import sk from '../locales/sk/translation.json';
import ua from '../locales/ua/translation.json';
import { detectLocaleFromPath } from './locale';

export { detectLocaleFromPath };
export type { AppLocale } from './locale';

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'pathLocale',
  lookup: () =>
    detectLocaleFromPath(
      typeof window === 'undefined' ? '/' : window.location.pathname,
    ),
});

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sk: { translation: sk },
      rs: { translation: rs },
      ua: { translation: ua },
    },
    supportedLngs: ['en', 'sk', 'rs', 'ua'],
    fallbackLng: 'en',
    detection: {
      order: ['pathLocale'],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
