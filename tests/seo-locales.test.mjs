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

test('home head exposes all hreflang alternatives', () => {
  const html = read('index.html');
  for (const [hreflang, href] of [
    ['en', 'https://riadence.com/'],
    ['sk', 'https://riadence.com/sk/'],
    ['sr', 'https://riadence.com/rs/'],
    ['uk', 'https://riadence.com/ua/'],
    ['x-default', 'https://riadence.com/'],
  ]) {
    assert.match(
      html,
      new RegExp(`hreflang="${hreflang}" href="${href.replaceAll('/', '\\/')}"`),
    );
  }
});

test('RouteMetadata defines localized title, description, keywords, and og locale', () => {
  const metadata = read('src/components/RouteMetadata.tsx');

  for (const [path, locale, keywords] of [
    ['/sk/', 'sk_SK', 'pobyt, vízum, Slovensko'],
    ['/rs/', 'sr_RS', 'boravak, viza, Srbija'],
    ['/ua/', 'uk_UA', 'дозвіл на проживання, віза, ЄС'],
  ]) {
    assert.match(metadata, new RegExp(path.replaceAll('/', '\\/')));
    assert.match(metadata, new RegExp(locale));
    assert.match(metadata, new RegExp(keywords));
  }
  assert.match(metadata, /property="og:locale"|meta\[property="og:locale"\]/);
  assert.match(metadata, /meta\[name="keywords"\]/);
});

test('localized build entries, Vercel rewrites, and sitemap URLs are configured', () => {
  const vite = read('vite.config.ts');
  const vercel = read('vercel.json');
  const sitemap = read('public/sitemap.xml');

  for (const locale of ['sk', 'rs', 'ua']) {
    assert.match(vite, new RegExp(`${locale}: resolve\\(__dirname, '${locale}\\/index.html'\\)`));
    assert.match(vercel, new RegExp(`"source": "\\/${locale}"`));
    assert.match(vercel, new RegExp(`"destination": "\\/${locale}\\/index.html"`));
    assert.match(sitemap, new RegExp(`https:\\/\\/riadence\\.com\\/${locale}\\/`));
    assert.match(read(`${locale}/index.html`), /src="\/src\/main\.tsx"/);
  }
  for (const path of ['/', '/privacy', '/terms', '/unsubscribed']) {
    assert.match(sitemap, new RegExp(`<loc>https:\\/\\/riadence\\.com${path.replaceAll('/', '\\/')}</loc>`));
  }
});
