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

test('landing page embeds honest social proof in the hero', () => {
  const landing = read('src/pages/LandingPage.tsx');
  const socialProof = read('src/components/SocialProof.tsx');

  assert.match(landing, /import \{ SocialProof \}/);
  assert.match(landing, /<TrustLine \/>[\s\S]*<SocialProof \/>/);
  assert.match(socialProof, /socialProof\.earlyStage/);
  assert.doesNotMatch(socialProof, /\b\d+\s+(people|ľuďom|clients|klient)/i);
});

test('social proof keeps the early-stage statement and six trust badges', () => {
  const socialProof = read('src/components/SocialProof.tsx');

  assert.match(socialProof, /socialProof\.earlyStage/);
  assert.match(socialProof, /socialProof\.description/);
  assert.match(socialProof, /socialProof\.badges/);
  assert.doesNotMatch(socialProof, /socialProof\.testimonials/);

  for (const name of ['en', 'sk', 'rs', 'ua']) {
    const proof = locale(name).socialProof;
    assert.equal(proof.badges.length, 6);
  }
});

test('Slovak administrative context lives on a dedicated Slovak route', () => {
  const app = read('src/App.tsx');
  const landing = read('src/pages/LandingPage.tsx');
  const administrationPage = read('src/pages/SlovakAdministrationPage.tsx');
  const context = read('src/components/SlovakAdminContext.tsx');
  const footer = read('src/components/Footer.tsx');
  const metadata = read('src/components/RouteMetadata.tsx');
  const sk = locale('sk').slovakAdminContext;

  assert.doesNotMatch(landing, /SlovakAdminContext/);
  assert.match(
    app,
    /path="\/sk\/administrativa"[\s\S]*element=\{<SlovakAdministrationPage \/>\}/,
  );
  assert.match(administrationPage, /<SlovakAdminContext \/>/);
  assert.match(
    footer,
    /locale === 'sk'[\s\S]*localizedPath\(locale, 'administrativa'\)/,
  );
  assert.match(metadata, /administration:/);
  assert.match(metadata, /pathname === '\/sk\/administrativa'/);
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
