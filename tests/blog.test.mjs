import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(path) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

test('React Router registers the blog index and slug routes', () => {
  const app = read('src/App.tsx');

  assert.match(app, /import \{ BlogIndex \} from '\.\/pages\/blog\/index';/);
  assert.match(app, /import \{ BlogArticlePage \} from '\.\/pages\/blog\/\[slug\]';/);
  assert.match(app, /path="\/blog" element=\{<BlogIndex \/>\}/);
  assert.match(app, /path="\/blog\/:slug" element=\{<BlogArticlePage \/>\}/);
});

test('blog index reads from a typed registry and links registered articles', () => {
  const indexPage = read('src/pages/blog/index.tsx');
  const registry = read('src/content/blog/index.ts');

  assert.match(indexPage, /blogArticles/);
  assert.match(indexPage, /to=\{`\/blog\/\$\{article\.slug\}`\}/);
  assert.match(registry, /export type BlogArticle/);
  assert.match(registry, /export const blogArticles: BlogArticle\[\]/);
  assert.match(registry, /export function getBlogArticle/);
});

test('unknown article slugs render a visible 404 instead of redirecting home', () => {
  const articlePage = read('src/pages/blog/[slug].tsx');

  assert.match(articlePage, /getBlogArticle\(slug\)/);
  assert.match(articlePage, /404/);
  assert.match(articlePage, /Article not found/);
  assert.doesNotMatch(articlePage, /<Navigate/);
});

test('blog routes have title, description, Open Graph, canonical, and noindex handling', () => {
  const metadata = read('src/components/RouteMetadata.tsx');

  assert.match(metadata, /Blog \| Riadence/);
  assert.match(metadata, /pathname === '\/blog'/);
  assert.match(metadata, /pathname\.startsWith\('\/blog\/'\)/);
  assert.match(metadata, /og:type/);
  assert.match(metadata, /rel = 'canonical'/);
  assert.match(metadata, /noindex,nofollow/);
});

test('sitemap includes the blog index URL', () => {
  assert.match(
    read('public/sitemap.xml'),
    /<loc>https:\/\/riadence\.com\/blog<\/loc>/,
  );
});
