import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(path) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

test('primary landing CTAs expose 48px touch targets', () => {
  const landing = read('src/pages/LandingPage.tsx');
  const checklistFlow = read('src/components/ChecklistFlow.tsx');
  const agency = read('src/components/AgencySection.tsx');

  assert.ok(
    (landing.match(/min-h-12/g) ?? []).length >= 3,
    'Landing page should have 48px primary and secondary CTA targets',
  );
  assert.match(checklistFlow, /min-h-12/);
  assert.match(agency, /min-h-12/);
});

test('wizard action buttons expose 48px touch targets', () => {
  const modal = read('src/components/RiaIntakeModal.tsx');

  assert.match(
    modal,
    /min-h-12 rounded-full border border-\[#DDE8DF\] bg-white px-5/,
  );
  assert.match(
    modal,
    /min-h-12 rounded-full bg-\[#0F8A6A\] px-6/,
  );
  assert.ok(
    (modal.match(/min-h-12/g) ?? []).length >= 5,
    'Wizard CTA and send actions should use 48px targets',
  );
});

test('hero help cards use a denser desktop footprint with readable labels', () => {
  const hero = read('src/components/RiadenceHeroMockup.tsx');

  assert.match(hero, /lg:h-\[78px\] lg:w-\[220px\]/);
  assert.match(hero, /sm:text-xs[\s\S]*lg:text-sm/);
});
