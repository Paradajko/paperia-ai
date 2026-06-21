import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function locale(name) {
  return JSON.parse(
    readFileSync(
      resolve(repoRoot, `src/locales/${name}/translation.json`),
      'utf8',
    ),
  );
}

test('hero help cards are sourced from translations', () => {
  const source = readFileSync(
    resolve(repoRoot, 'src/components/RiadenceHeroMockup.tsx'),
    'utf8',
  );

  assert.match(source, /useTranslation/);
  assert.match(source, /landing\.heroCards/);
  assert.doesNotMatch(source, /title: 'Ria maps your Slovakia route'/);
});

test('all locales define the six hero card labels', () => {
  for (const name of ['en', 'sk', 'rs', 'ua']) {
    const cards = locale(name).landing.heroCards;
    assert.equal(cards.length, 6);
    assert.ok(cards.every((card) => typeof card === 'string' && card.trim()));
  }

  assert.deepEqual(locale('en').landing.heroCards.slice(0, 3), [
    'Ria maps your Slovakia route',
    'Ria builds your PDF checklist',
    'Ria flags missing documents',
  ]);
  assert.deepEqual(locale('sk').landing.heroCards.slice(0, 3), [
    'Ria vytvorí tvoju trasu na Slovensko',
    'Ria pripraví tvoj PDF kontrolný zoznam',
    'Ria upozorní na chýbajúce dokumenty',
  ]);
});
