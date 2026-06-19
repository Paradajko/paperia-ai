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

test('saveLead schedules the welcome email 100ms after a successful insert', async () => {
  const { saveLead } = await importLeadsModule();
  const scheduled = [];
  const requests = [];
  const storage = {
    from(table) {
      assert.equal(table, 'leads');
      return {
        async insert() {
          return { error: null };
        },
      };
    },
  };
  const schedule = (callback, delay) => {
    scheduled.push({ callback, delay });
    return 1;
  };
  const fetcher = async (url, init) => {
    requests.push({ url, init });
    return new Response(null, { status: 200 });
  };
  const values = {
    email: 'person@example.com',
    nationality: 'India',
    currentLocation: 'Outside Slovakia',
    purpose: 'employment',
    statusReason: 'I have an employer or job offer',
    documents: ['Passport'],
    concern: '',
  };

  const result = await saveLead(values, storage, schedule, fetcher);

  assert.deepEqual(result, { error: null });
  assert.equal(requests.length, 0);
  assert.equal(scheduled.length, 1);
  assert.equal(scheduled[0].delay, 100);

  scheduled[0].callback();
  await Promise.resolve();

  assert.equal(requests[0].url, '/api/send-welcome');
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    email: 'person@example.com',
    nationality: 'India',
    destinationCountry: 'Slovakia',
    residenceType: 'employment',
  });
});

test('saveLead does not schedule an email when the Supabase insert fails', async () => {
  const { saveLead } = await importLeadsModule();
  let scheduled = false;
  const insertError = { message: 'Insert failed' };
  const storage = {
    from() {
      return {
        async insert() {
          return { error: insertError };
        },
      };
    },
  };

  const result = await saveLead(
    {
      email: 'person@example.com',
      nationality: 'India',
      currentLocation: '',
      purpose: 'employment',
      statusReason: '',
      documents: [],
      concern: '',
    },
    storage,
    () => {
      scheduled = true;
      return 1;
    },
    async () => new Response(null, { status: 200 }),
  );

  assert.equal(result.error, insertError);
  assert.equal(scheduled, false);
});

test('welcome email rejection is logged without changing the saved lead result', async () => {
  const { saveLead } = await importLeadsModule();
  let scheduledCallback;
  const logged = [];
  const originalConsoleError = console.error;
  console.error = (...args) => logged.push(args);

  try {
    const result = await saveLead(
      {
        email: 'person@example.com',
        nationality: 'India',
        currentLocation: '',
        purpose: 'employment',
        statusReason: '',
        documents: [],
        concern: '',
      },
      {
        from() {
          return {
            async insert() {
              return { error: null };
            },
          };
        },
      },
      (callback) => {
        scheduledCallback = callback;
        return 1;
      },
      async () => {
        throw new Error('Email service unavailable');
      },
    );

    assert.deepEqual(result, { error: null });
    scheduledCallback();
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));
    assert.equal(logged.length, 1);
  } finally {
    console.error = originalConsoleError;
  }
});
