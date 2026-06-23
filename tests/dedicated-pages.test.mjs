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

test('pricing and agency content live on dedicated localized routes', () => {
  const app = read('src/App.tsx');
  const pricingPage = read('src/pages/PricingPage.tsx');
  const agencyPage = read('src/pages/AgencyPage.tsx');

  for (const path of [
    '/pricing',
    '/sk/pricing',
    '/rs/pricing',
    '/ua/pricing',
  ]) {
    assert.match(app, new RegExp(`path="${path}"`));
  }

  for (const path of [
    '/for-agencies',
    '/sk/for-agencies',
    '/rs/for-agencies',
    '/ua/for-agencies',
  ]) {
    assert.match(app, new RegExp(`path="${path}"`));
  }

  assert.match(pricingPage, /<PricingCard/);
  assert.match(agencyPage, /<AgencySection/);
});

test('header and footer link to the current locale pricing and agency pages', () => {
  const header = read('src/components/Header.tsx');
  const footer = read('src/components/Footer.tsx');
  const localeSwitcher = read('src/components/LocaleSwitcher.tsx');
  const localeRoutes = read('src/i18n/locale.ts');

  assert.match(localeRoutes, /localizedPath/);
  assert.match(header, /localizedPath\(locale, 'for-agencies'\)/);
  assert.match(header, /localizedPath\(locale, 'pricing'\)/);
  assert.match(footer, /localizedPath\(locale, 'pricing'\)/);
  assert.match(localeSwitcher, /localizedPath\(locale, currentPage\)/);
});

test('dedicated pricing and agency routes expose route-specific metadata', () => {
  const metadata = read('src/components/RouteMetadata.tsx');

  assert.match(metadata, /pricing:/);
  assert.match(metadata, /agencies:/);
  assert.match(metadata, /pathname\.endsWith\('\/pricing'\)/);
  assert.match(metadata, /pathname\.endsWith\('\/for-agencies'\)/);
});
