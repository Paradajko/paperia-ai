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
