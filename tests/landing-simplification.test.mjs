import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  try {
    return readFileSync(resolve(repoRoot, relativePath), 'utf8');
  } catch {
    return '';
  }
}

test('landing page renders five focused content sections', () => {
  const landing = read('src/pages/LandingPage.tsx');

  assert.equal((landing.match(/<section\b/g) ?? []).length, 2);
  assert.match(landing, /<HowItWorks \/>/);
  assert.match(landing, /<ChecklistPreview \/>/);
  assert.match(landing, /<FAQ onStart=\{openIntake\} \/>/);
  assert.doesNotMatch(landing, /ChecklistFlow/);
  assert.doesNotMatch(landing, /clarityEyebrow|clarityTitle|avoidItems/);
});

test('hero has one primary action and embeds compact trust proof', () => {
  const landing = read('src/pages/LandingPage.tsx');
  const socialProof = read('src/components/SocialProof.tsx');

  assert.doesNotMatch(landing, /common\.samplePdf/);
  assert.equal(
    (landing.match(/\{t\('common\.getChecklist'\)\}/g) ?? []).length,
    1,
  );
  assert.match(landing, /<SocialProof \/>/);
  assert.match(socialProof, /socialProof\.earlyStage/);
  assert.match(socialProof, /socialProof\.badges/);
  assert.doesNotMatch(socialProof, /<section/);
  assert.doesNotMatch(socialProof, /socialProof\.testimonials/);
});

test('problem section selects exactly three audience-relevant pain points', () => {
  const landing = read('src/pages/LandingPage.tsx');

  assert.match(landing, /problemIndexes = \[0, 4, 2\]/);
  assert.match(landing, /problemIndexes\.map\(\(index\) => allProblems\[index\]\)/);
});

test('FAQ owns the final conversion action with a 48px target', () => {
  const faq = read('src/components/FAQ.tsx');

  assert.match(faq, /onStart: \(\) => void/);
  assert.match(faq, /landing\.finalTitle/);
  assert.match(faq, /landing\.finalDescription/);
  assert.match(
    faq,
    /onClick=\{onStart\}[\s\S]*className="[^"]*h-12[^"]*"[\s\S]*common\.getChecklist/,
  );
});
