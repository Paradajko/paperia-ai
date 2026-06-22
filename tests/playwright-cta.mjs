import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173';
const screenshotPath =
  process.env.PLAYWRIGHT_SCREENSHOT ?? '/tmp/riadence-cta-48px.png';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const ctas = page.getByRole('button', { name: 'Get your free checklist' });
  const count = await ctas.count();

  assert.ok(count > 0, 'Expected at least one visible primary checklist CTA');
  const heights = [];
  for (let index = 0; index < count; index += 1) {
    const cta = ctas.nth(index);
    if (await cta.isVisible()) {
      const box = await cta.boundingBox();
      assert.ok(box, `CTA ${index + 1} should have a measurable box`);
      heights.push(box.height);
      assert.ok(
        box.height >= 48,
        `CTA ${index + 1} rendered at ${box.height}px instead of at least 48px`,
      );
    }
  }

  assert.ok(heights.length > 0, 'Expected a visible measurable CTA');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(JSON.stringify({ heights, screenshotPath }));
} finally {
  await browser.close();
}
