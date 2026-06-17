import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = '/private/tmp/paperia-leads-test';

async function importLeadsModule() {
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  execFileSync(
    resolve(repoRoot, 'node_modules/.bin/tsc'),
    [
      resolve(repoRoot, 'src/lib/leads.ts'),
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

  return import(`${pathToFileURL(resolve(tempDir, 'leads.js')).href}?t=${Date.now()}`);
}

test('buildLeadInsert maps intake values to the leads insert payload', async () => {
  const { buildLeadInsert } = await importLeadsModule();

  const payload = buildLeadInsert({
    email: 'person@example.com',
    nationality: 'Ukraine',
    currentLocation: 'Already in Slovakia',
    purpose: 'employment',
    statusReason: 'I have an employer or job offer',
    documents: ['Passport', 'Accommodation proof'],
    concern: 'Criminal record timing',
  });

  assert.deepEqual(payload, {
    email: 'person@example.com',
    nationality: 'Ukraine',
    current_location: 'Already in Slovakia',
    purpose: 'employment',
    status_reason: 'I have an employer or job offer',
    documents: ['Passport', 'Accommodation proof'],
    concern: 'Criminal record timing',
    checklist_route: null,
    source: 'web',
    status: 'new',
  });
});
