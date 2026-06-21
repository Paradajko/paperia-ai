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

test('LocaleSwitcher renders four labeled flag buttons', () => {
  const switcher = read('src/components/LocaleSwitcher.tsx');

  for (const [locale, label, flag] of [
    ['en', 'EN', '🇬🇧'],
    ['sk', 'SK', '🇸🇰'],
    ['rs', 'RS', '🇷🇸'],
    ['ua', 'UA', '🇺🇦'],
  ]) {
    assert.match(switcher, new RegExp(`locale: '${locale}'`));
    assert.match(switcher, new RegExp(`label: '${label}'`));
    assert.match(switcher, new RegExp(`flag: '${flag}'`));
  }
});

test('LocaleSwitcher click navigates to each locale route', () => {
  const switcher = read('src/components/LocaleSwitcher.tsx');

  assert.match(switcher, /useNavigate\(\)/);
  assert.match(switcher, /path: '\/'/);
  assert.match(switcher, /path: '\/sk\/'/);
  assert.match(switcher, /path: '\/rs\/'/);
  assert.match(switcher, /path: '\/ua\/'/);
  assert.match(switcher, /onClick=\{\(\) => navigate\(path\)\}/);
});

test('active locale follows pathname and localized landing routes are mounted', () => {
  const app = read('src/App.tsx');
  const header = read('src/components/Header.tsx');
  const landing = read('src/pages/LandingPage.tsx');
  const switcher = read('src/components/LocaleSwitcher.tsx');

  assert.match(switcher, /useLocation\(\)/);
  assert.match(switcher, /pathname\.startsWith\('\/sk'\)/);
  assert.match(switcher, /pathname\.startsWith\('\/rs'\)/);
  assert.match(switcher, /pathname\.startsWith\('\/ua'\)/);
  assert.match(switcher, /aria-pressed=\{activeLocale === locale\}/);
  assert.match(app, /path="\/" element=\{<LandingPage locale="en" \/>\}/);
  assert.match(app, /path="\/sk\/" element=\{<LandingPage locale="sk" \/>\}/);
  assert.match(app, /path="\/rs\/" element=\{<LandingPage locale="rs" \/>\}/);
  assert.match(app, /path="\/ua\/" element=\{<LandingPage locale="ua" \/>\}/);
  assert.match(app, /path="\*" element=\{<Navigate to="\/" replace \/>\}/);
  assert.match(header, /<LocaleSwitcher \/>/);
  assert.ok(header.indexOf('<LocaleSwitcher />') < header.indexOf('onClick={onStart}'));
  assert.match(landing, /locale: AppLocale/);
  assert.match(landing, /changeLanguage\(locale\)/);
});
