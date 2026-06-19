import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = '/private/tmp/riadence-pdf-test';

async function importPdfDataModule() {
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  execFileSync(
    resolve(repoRoot, 'node_modules/.bin/tsc'),
    [
      resolve(repoRoot, 'src/lib/pdf-data.ts'),
      '--target',
      'ES2022',
      '--module',
      'ES2022',
      '--moduleResolution',
      'bundler',
      '--outDir',
      tempDir,
      '--skipLibCheck',
      '--strict',
      '--esModuleInterop',
      '--lib',
      'ES2022,DOM',
    ],
    { cwd: repoRoot },
  );

  return import(`${pathToFileURL(resolve(tempDir, 'pdf-data.js')).href}?t=${Date.now()}`);
}

test('buildChecklistContent personalizes the employment route and missing documents', async () => {
  const { buildChecklistContent } = await importPdfDataModule();

  const content = buildChecklistContent(
    {
      name: 'Mira',
      email: 'mira@example.com',
      nationality: 'Serbia',
      currentLocation: 'Outside Slovakia',
      purpose: 'employment',
      statusReason: 'I have an employer or job offer',
      documents: ['Passport'],
      concern: 'Do I need an apostille?',
    },
    new Date('2026-06-18T00:00:00Z'),
  );

  assert.equal(content.preparedFor, 'Mira');
  assert.match(content.routeTitle, /employment/i);
  assert.ok(content.documentsNeeded.includes('Employment contract or promise of employment'));
  assert.ok(!content.documentsNeeded.includes('Passport'));
  assert.match(content.timeline.join(' '), /employer/i);
  assert.equal(content.verifiedDate, 'June 18, 2026');
});

test('buildChecklistContent includes official links and emergency contacts', async () => {
  const { buildChecklistContent } = await importPdfDataModule();

  const content = buildChecklistContent({
    name: '',
    email: 'person@example.com',
    nationality: 'India',
    currentLocation: 'Outside Slovakia',
    purpose: 'study',
    statusReason: 'I have a school admission',
    documents: [],
    concern: 'What should I prepare?',
  });

  assert.ok(content.officialResources.some((item) => item.url.includes('slov-lex.sk')));
  assert.ok(content.officialResources.some((item) => item.url.includes('minv.sk')));
  assert.ok(content.emergencyContacts.some((item) => item.includes('112')));
  assert.match(content.disclaimer, /not a lawyer/i);
  assert.match(content.disclaimer, /https:\/\/riadence\.com\/privacy/);
  assert.match(content.disclaimer, /https:\/\/riadence\.com\/terms/);
});
