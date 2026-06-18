import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = '/private/tmp/paperia-ria-test';

async function importRiaModule() {
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  execFileSync(
    resolve(repoRoot, 'node_modules/.bin/tsc'),
    [
      resolve(repoRoot, 'src/lib/ria.ts'),
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

  return import(`${pathToFileURL(resolve(tempDir, 'ria.js')).href}?t=${Date.now()}`);
}

test('createInitialRiaMessage summarizes the applicant intake', async () => {
  const { createInitialRiaMessage } = await importRiaModule();

  const message = createInitialRiaMessage({
    nationality: 'India',
    currentLocation: 'Outside Slovakia',
    residenceType: 'employment',
    documents: ['Passport'],
    concern: 'Do I need an apostille?',
  });

  assert.match(message, /India/);
  assert.match(message, /Outside Slovakia/);
  assert.match(message, /employment/);
  assert.match(message, /Passport/);
  assert.match(message, /apostille/);
});

test('requestRiaReply includes applicant context only when supplied', async () => {
  const { requestRiaReply } = await importRiaModule();
  const bodies = [];
  const fetcher = async (_url, init) => {
    bodies.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ reply: 'A useful answer.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  const messages = [{ role: 'user', content: 'What should I prepare?' }];
  const applicantContext = {
    nationality: 'India',
    destinationCountry: 'Slovakia',
    residenceType: 'employment',
    currentStep: 'first-checklist',
  };

  await requestRiaReply(messages, applicantContext, fetcher);
  await requestRiaReply(messages, undefined, fetcher);

  assert.deepEqual(bodies[0], { messages, applicantContext });
  assert.deepEqual(bodies[1], { messages });
});

test('requestRiaReply exposes only the user-friendly fallback on API failure', async () => {
  const { RIA_FALLBACK_MESSAGE, requestRiaReply } = await importRiaModule();
  const fetcher = async () =>
    new Response(JSON.stringify({ error: 'Sensitive upstream error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    await assert.rejects(
      requestRiaReply([{ role: 'user', content: 'Help' }], undefined, fetcher),
      { message: RIA_FALLBACK_MESSAGE },
    );
  } finally {
    console.error = originalConsoleError;
  }
});
