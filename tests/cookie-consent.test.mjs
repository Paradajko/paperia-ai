import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(
  resolve(repoRoot, 'src/components/CookieConsent.tsx'),
  'utf8',
);

test('cookie consent persists accept and decline decisions and hides afterwards', () => {
  assert.match(source, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(source, /localStorage\.setItem\(STORAGE_KEY, decision\)/);
  assert.match(source, /consent !== 'show'/);
  assert.match(source, /decide\('accepted'\)/);
  assert.match(source, /decide\('declined'\)/);
});

test('cookie consent uses localized copy and compact 44px actions', () => {
  assert.match(source, /useTranslation/);
  for (const key of [
    'cookies.title',
    'cookies.body',
    'cookies.accept',
    'cookies.decline',
  ]) {
    assert.match(source, new RegExp(`t\\('${key.replace('.', '\\.')}'\\)`));
  }
  assert.match(source, /max-w-\[400px\]/);
  assert.match(source, /min-h-11/);
});
