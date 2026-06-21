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

function leafPaths(value, prefix = '') {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => leafPaths(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      leafPaths(item, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [[prefix, value]];
}

test('all four languages have identical non-empty translation keys', () => {
  const resources = ['en', 'sk', 'rs', 'ua'].map((locale) =>
    JSON.parse(read(`src/locales/${locale}/translation.json`)),
  );
  const reference = leafPaths(resources[0]);

  for (const resource of resources) {
    const leaves = leafPaths(resource);
    assert.deepEqual(
      leaves.map(([path]) => path),
      reference.map(([path]) => path),
    );
    for (const [path, value] of leaves) {
      assert.equal(typeof value, 'string', `${path} must be a string`);
      assert.ok(value.trim(), `${path} must not be empty`);
    }
  }
});

test('all planned landing and wizard components use react-i18next', () => {
  for (const file of [
    'src/pages/LandingPage.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx',
    'src/components/HowItWorks.tsx',
    'src/components/ChecklistFlow.tsx',
    'src/components/AgencySection.tsx',
    'src/components/FAQ.tsx',
    'src/components/RiaIntakeModal.tsx',
  ]) {
    assert.match(read(file), /useTranslation/);
  }
});

test('lead locale is validated, posted, and stored by the completion RPC', () => {
  const leads = read('src/lib/leads.ts');
  const modal = read('src/components/RiaIntakeModal.tsx');
  const api = read('api/complete-intake.ts');
  const migration = read(
    'supabase/migrations/20260621000001_add_leads_locale.sql',
  );

  assert.match(leads, /locale: AppLocale/);
  assert.match(modal, /locale: currentLocale/);
  assert.match(api, /locale: AppLocale/);
  assert.match(api, /input_locale: input\.locale/);
  assert.match(
    migration,
    /add column locale text not null default 'en' check \(locale in \('en','sk','rs','ua'\)\)/i,
  );
  assert.match(migration, /input_locale text default 'en'/i);
  assert.match(migration, /coalesce\(input_locale, 'en'\)/i);
});

test('welcome email localizes subject and body for SK, RS, and UA', async () => {
  const { buildSequenceEmail } = await importTypescriptModule(
    repoRoot,
    'api/emails/templates.ts',
    'localized-welcome',
  );
  const expected = {
    sk: /Slovensk/,
    rs: /Slovačk/,
    ua: /Словаччин/,
  };

  for (const [locale, pattern] of Object.entries(expected)) {
    const email = buildSequenceEmail('welcome', {
      email: 'person@example.com',
      name: 'Alex',
      nationality: 'Serbia',
      destinationCountry: 'Slovakia',
      residenceType: 'employment',
      unsubscribeUrl: 'https://riadence.com/unsubscribe',
      locale,
    });
    assert.match(email.subject, pattern);
    assert.match(email.text, pattern);
    assert.match(email.html, pattern);
  }
});
