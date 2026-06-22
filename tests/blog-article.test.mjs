import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'slovakia-residence-permit-serbian-citizens-2026';

function read(path) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

test('pilot MDX article has the requested length, structure, and legal disclaimer', () => {
  const article = read(`src/content/blog/${slug}.mdx`);
  const words = article
    .replace(/^---[\s\S]*?---/, '')
    .split(/\s+/)
    .filter(Boolean);

  assert.ok(words.length >= 800, `Article has only ${words.length} words`);
  assert.ok(words.length <= 1500, `Article has ${words.length} words`);

  for (const heading of [
    'Why move from Serbia to Slovakia?',
    'Main residence routes',
    'Documents to prepare',
    'Apostilles and official translations',
    'Where to apply and how long it takes',
    'Common mistakes',
  ]) {
    assert.match(article, new RegExp(`## ${heading.replaceAll('?', '\\?')}`));
  }

  assert.match(
    article,
    /I am not a lawyer\. This is general information, not legal advice\./,
  );
  assert.match(article, /https:\/\/mic\.iom\.sk\/en\/residence\//);
});

test('pilot article is registered, linked, and included in the sitemap', () => {
  const registry = read('src/content/blog/index.ts');
  const indexPage = read('src/pages/blog/index.tsx');
  const sitemap = read('public/sitemap.xml');

  assert.match(registry, new RegExp(slug));
  assert.match(registry, /SlovakiaResidencePermitSerbianCitizens2026/);
  assert.match(indexPage, /blogArticles\.map/);
  assert.match(
    sitemap,
    new RegExp(`<loc>https:\\/\\/riadence\\.com\\/blog\\/${slug}<\\/loc>`),
  );
});

test('article metadata exposes Open Graph article data and JSON-LD Article schema', () => {
  const metadata = read('src/components/RouteMetadata.tsx');
  const articlePage = read('src/pages/blog/[slug].tsx');

  assert.match(metadata, /application\/ld\+json/);
  assert.match(metadata, /'@type': 'Article'/);
  assert.match(metadata, /datePublished/);
  assert.match(metadata, /author/);
  assert.match(metadata, /og:type/);
  assert.match(articlePage, /article\.sources/);
});
