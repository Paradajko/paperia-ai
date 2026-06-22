import assert from 'node:assert/strict';
import { webkit } from 'playwright';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://riadence.com';
const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL;
const browser = await webkit.launch({ headless: true });
const page = await browser.newPage({ acceptDownloads: true });
const diagnostics = [];

if (apiBaseUrl) {
  await page.route('**/api/**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const response = await route.fetch({
      url: `${apiBaseUrl}${requestUrl.pathname}`,
    });
    await route.fulfill({ response });
  });
}

page.on('console', (message) => {
  diagnostics.push(`console:${message.type()}:${message.text()}`);
});
page.on('pageerror', (error) => {
  diagnostics.push(`pageerror:${error.message}`);
});
page.on('response', (response) => {
  if (response.url().includes('/api/')) {
    diagnostics.push(`response:${response.status()}:${response.url()}`);
  }
});

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Get your free checklist' }).first().click();

  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Nationality').selectOption('Serbia');
  await page.getByLabel('Current location').selectOption('Outside Slovakia');
  await page.getByLabel('Purpose of stay').selectOption('employment');
  await page
    .getByLabel('Current status / reason')
    .selectOption('I have an employer or job offer');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByText('Passport', { exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page
    .getByRole('textbox', { name: 'Your biggest question' })
    .fill('Which documents need an apostille?');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByLabel('Name (optional)').fill('WebKit PDF Test');
  await page
    .getByRole('textbox', { name: 'Email' })
    .fill(`webkit-pdf-${Date.now()}@example.com`);
  const riaResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/ria-chat'),
    { timeout: 30_000 },
  );
  await page.getByRole('button', { name: "Show Ria's checklist" }).click();
  await page
    .getByRole('heading', { name: 'Your Slovakia route is ready to review.' })
    .waitFor({ timeout: 30_000 });
  await riaResponsePromise;

  const pdfResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/generate-pdf'),
    { timeout: 30_000 },
  );
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.getByRole('button', { name: 'Download your PDF checklist' }).click();
  const pdfResponse = await pdfResponsePromise;
  const download = await downloadPromise;

  assert.equal(pdfResponse.status(), 200);
  assert.match(pdfResponse.headers()['content-type'] ?? '', /application\/pdf/);
  assert.match(download.suggestedFilename(), /\.pdf$/);
  assert.equal(
    await page.getByText(
      'Sorry, your PDF could not be generated right now. Please try again.',
    ).count(),
    0,
  );
  console.log(JSON.stringify({ diagnostics, filename: download.suggestedFilename() }));
} catch (error) {
  console.error(JSON.stringify({ diagnostics }));
  throw error;
} finally {
  if (apiBaseUrl) {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  }
  await browser.close();
}
