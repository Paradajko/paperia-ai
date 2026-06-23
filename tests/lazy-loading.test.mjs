import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return readFileSync(resolve(repoRoot, relativePath), 'utf8');
}

test('secondary routes are loaded lazily behind a stable suspense fallback', () => {
  const app = read('src/App.tsx');

  for (const page of [
    'PricingPage',
    'AgencyPage',
    'SlovakAdministrationPage',
  ]) {
    assert.match(
      app,
      new RegExp(
        `const ${page} = lazy\\(\\(\\) =>[\\s\\S]*import\\('\\./pages/${page}'\\)`,
      ),
    );
    assert.doesNotMatch(
      app,
      new RegExp(`import \\{ ${page} \\} from '\\./pages/${page}'`),
    );
  }

  assert.match(app, /<Suspense fallback=\{<RouteFallback \/>\}>/);
  assert.match(app, /function RouteFallback\(\)/);
});

test('intake modal is lazy and mounted only when it is open', () => {
  for (const page of [
    'src/pages/LandingPage.tsx',
    'src/pages/PricingPage.tsx',
    'src/pages/AgencyPage.tsx',
    'src/pages/SlovakAdministrationPage.tsx',
  ]) {
    const source = read(page);

    assert.match(
      source,
      /const RiaIntakeModal = lazy\(\(\) =>[\s\S]*import\('\.\.\/components\/RiaIntakeModal'\)/,
    );
    assert.doesNotMatch(
      source,
      /import \{ RiaIntakeModal \} from '\.\.\/components\/RiaIntakeModal'/,
    );
    assert.match(
      source,
      /intakeOpen && \([\s\S]*<Suspense fallback=\{null\}>[\s\S]*<RiaIntakeModal/,
    );
  }
});

test('locale resources use a stable translations cache chunk', () => {
  const viteConfig = read('vite.config.ts');

  assert.match(viteConfig, /manualChunks/);
  assert.match(viteConfig, /src\/locales/);
  assert.match(viteConfig, /return 'translations'/);
});
