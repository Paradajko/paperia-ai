import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(path) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

test('every translated primary checklist CTA has an explicit 48px height', () => {
  for (const path of [
    'src/components/Header.tsx',
    'src/pages/LandingPage.tsx',
    'src/components/FAQ.tsx',
  ]) {
    const source = read(path);
    const buttons = [
      ...source.matchAll(
        /<button[\s\S]*?className="([^"]*)"[\s\S]*?\{t\('common\.getChecklist'\)\}[\s\S]*?<\/button>/g,
      ),
    ];

    assert.ok(buttons.length > 0, `${path} should render a checklist CTA`);
    for (const [, className] of buttons) {
      assert.match(
        className,
        /(?:^|\s)h-12(?:\s|$)/,
        `${path} checklist CTA must render at exactly 48px`,
      );
    }
  }
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
