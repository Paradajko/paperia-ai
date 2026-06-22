import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(path) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

function locale(name) {
  return JSON.parse(read(`src/locales/${name}/translation.json`));
}

test('landing page places honest social proof between the hero and process content', () => {
  const landing = read('src/pages/LandingPage.tsx');
  const socialProof = read('src/components/SocialProof.tsx');

  assert.match(landing, /import \{ SocialProof \}/);
  assert.ok(
    landing.indexOf('<SocialProof') < landing.indexOf('<HowItWorks'),
    'Social proof should appear before HowItWorks',
  );
  assert.match(socialProof, /socialProof\.earlyStage/);
  assert.doesNotMatch(socialProof, /\b\d+\s+(people|ľuďom|clients|klient)/i);
});

test('Slovak administrative context is rendered only for the Slovak route', () => {
  const landing = read('src/pages/LandingPage.tsx');
  const context = read('src/components/SlovakAdminContext.tsx');
  const sk = locale('sk').slovakAdminContext;

  assert.ok(landing.includes("{locale === 'sk' && <SlovakAdminContext />}"));
  assert.match(context, /slovakAdminContext\.items/);
  assert.equal(sk.items.length, 9);
  assert.deepEqual(
    sk.items.map(({ title }) => title),
    [
      'Cudzinecká polícia',
      'Ministerstvo vnútra SR',
      'Úrad práce, sociálnych vecí a rodiny',
      'Zdravotná poisťovňa',
      'Sociálna poisťovňa',
      'Trvalý pobyt / prechodný pobyt',
      'Rodné číslo',
      'Nostrifikácia dokladov',
      'Apostila / superlegalizácia',
    ],
  );
  assert.ok(
    sk.items.every(
      ({ description }) =>
        typeof description === 'string' && description.trim().length >= 40,
    ),
  );
});
