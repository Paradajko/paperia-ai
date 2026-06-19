import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = '/private/tmp/riadence-leads-test';

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

test('saveLead posts the intake to the server completion endpoint', async () => {
  const { saveLead } = await importLeadsModule();
  const requests = [];
  const fetcher = async (url, init) => {
    requests.push({ url, init });
    return new Response(JSON.stringify({ ok: true, sequenceCount: 5 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  const values = {
    name: 'Ada',
    email: 'person@example.com',
    nationality: 'India',
    currentLocation: 'Outside Slovakia',
    purpose: 'employment',
    statusReason: 'I have an employer or job offer',
    documents: ['Passport'],
    concern: '',
    emailSequenceConsent: true,
  };

  const result = await saveLead(values, fetcher);

  assert.deepEqual(result, { error: null });
  assert.equal(requests[0].url, '/api/complete-intake');
  assert.deepEqual(JSON.parse(requests[0].init.body), values);
});

test('saveLead defaults missing consent to false', async () => {
  const { saveLead } = await importLeadsModule();
  let body;
  await saveLead(
    {
      name: '',
      email: 'person@example.com',
      nationality: 'India',
      currentLocation: '',
      purpose: 'employment',
      statusReason: '',
      documents: [],
      concern: '',
    },
    async (_url, init) => {
      body = JSON.parse(init.body);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    },
  );

  assert.equal(body.emailSequenceConsent, false);
});

test('saveLead returns an error when the completion endpoint fails', async () => {
  const { saveLead } = await importLeadsModule();
  const result = await saveLead(
    {
      name: '',
      email: 'person@example.com',
      nationality: 'India',
      currentLocation: '',
      purpose: 'employment',
      statusReason: '',
      documents: [],
      concern: '',
      emailSequenceConsent: false,
    },
    async () => new Response(JSON.stringify({ error: 'failed' }), { status: 500 }),
  );

  assert.ok(result.error instanceof Error);
});
