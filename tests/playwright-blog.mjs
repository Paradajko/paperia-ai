import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' });
  await page
    .getByRole('heading', {
      name: 'Practical residence guidance for Slovakia',
    })
    .waitFor();
  assert.equal(await page.title(), 'Blog | Riadence');
  await page
    .getByRole('link', {
      name: 'Slovakia Residence Permit for Serbian Citizens in 2026',
    })
    .click();
  await page
    .getByRole('heading', {
      name: 'Slovakia Residence Permit for Serbian Citizens in 2026',
    })
    .waitFor();
  await page.waitForFunction(
    () =>
      document
        .querySelector('meta[property="og:type"]')
        ?.getAttribute('content') === 'article',
  );
  assert.equal(
    await page.locator('meta[property="og:type"]').getAttribute('content'),
    'article',
  );
  assert.match(
    (await page.locator('meta[name="description"]').getAttribute('content')) ??
      '',
    /Serbian citizens preparing a Slovak residence application/,
  );
  const schema = JSON.parse(
    await page.locator('script[data-riadence-article-schema]').textContent(),
  );
  assert.equal(schema['@type'], 'Article');
  const articleWords = (await page.locator('main article').innerText())
    .split(/\s+/)
    .filter(Boolean);
  assert.ok(
    articleWords.length >= 800,
    `Rendered article has only ${articleWords.length} words`,
  );
  await page.screenshot({
    path: '/tmp/riadence-pilot-blog-article.png',
    fullPage: true,
  });

  await page.goto(`${baseUrl}/blog/not-published`, {
    waitUntil: 'networkidle',
  });
  await page.getByRole('heading', { name: 'Article not found' }).waitFor();
  assert.equal(
    await page.locator('meta[name="robots"]').getAttribute('content'),
    'noindex,nofollow',
  );
} finally {
  await browser.close();
}
