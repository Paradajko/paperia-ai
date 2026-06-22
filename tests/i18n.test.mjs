import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  try {
    return readFileSync(resolve(repoRoot, relativePath), 'utf8');
  } catch {
    return '';
  }
}

test('React root mounts App through I18nextProvider', () => {
  const main = read('src/main.tsx');

  assert.match(main, /import \{ I18nextProvider \} from 'react-i18next';/);
  assert.match(main, /import i18n from '\.\/i18n';/);
  assert.match(main, /<I18nextProvider i18n=\{i18n\}>[\s\S]*<App \/>[\s\S]*<\/I18nextProvider>/);
});

test('locale detection uses the first localized path segment', async () => {
  const { detectLocaleFromPath } = await importTypescriptModule(
    repoRoot,
    'src/i18n/locale.ts',
    'i18n-locale',
  );

  assert.equal(detectLocaleFromPath('/sk/'), 'sk');
  assert.equal(detectLocaleFromPath('/rs/checklist'), 'rs');
  assert.equal(detectLocaleFromPath('/ua/'), 'ua');
  assert.equal(detectLocaleFromPath('/privacy'), 'en');
});

test('locale detection falls back to English', () => {
  const i18nSource = read('src/i18n/index.ts');

  assert.match(i18nSource, /fallbackLng: 'en'/);
  assert.match(i18nSource, /window\.location\.pathname/);
});

test('all locale resources are imported and contain the base namespaces', () => {
  const i18nSource = read('src/i18n/index.ts');
  const expectedNamespaces = [
    'common',
    'header',
    'cookies',
    'landing',
    'socialProof',
    'slovakAdminContext',
    'footer',
    'howItWorks',
    'checklistFlow',
    'agency',
    'faq',
    'pricing',
    'wizard',
    'email',
    'metadata',
  ];

  for (const locale of ['en', 'sk', 'rs', 'ua']) {
    assert.match(
      i18nSource,
      new RegExp(`import ${locale} from '\\.\\.\\/locales\\/${locale}\\/translation\\.json';`),
    );
    const resource = JSON.parse(read(`src/locales/${locale}/translation.json`));
    assert.deepEqual(Object.keys(resource), expectedNamespaces);
  }
});
