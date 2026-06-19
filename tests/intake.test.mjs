import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = '/private/tmp/riadence-intake-test';

async function importIntakeModule() {
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  execFileSync(
    resolve(repoRoot, 'node_modules/.bin/tsc'),
    [
      resolve(repoRoot, 'src/lib/intake.ts'),
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

  return import(`${pathToFileURL(resolve(tempDir, 'intake.js')).href}?t=${Date.now()}`);
}

const completeValues = {
  name: 'Mira',
  nationality: 'Serbia',
  currentLocation: 'Outside Slovakia',
  purpose: 'employment',
  statusReason: 'I have an employer or job offer',
  documents: ['Passport'],
  concern: 'I need to understand apostille requirements.',
  email: 'mira@example.com',
  emailSequenceConsent: false,
};

test('email sequence consent defaults to false in the wizard source', () => {
  const source = readFileSync(resolve(repoRoot, 'src/components/RiaIntakeModal.tsx'), 'utf8');
  assert.match(source, /emailSequenceConsent:\s*false/);
  assert.match(
    source,
    /Send me the 14-day Riadence email guide with practical residence tips and case examples\. I can unsubscribe anytime\./,
  );
  assert.match(source, /to="\/privacy"/);
});

test('step 2 requires nationality and purpose', async () => {
  const { validateWizardStep } = await importIntakeModule();

  assert.deepEqual(
    validateWizardStep(2, {
      ...completeValues,
      nationality: '',
      purpose: '',
    }),
    {
      nationality: 'Choose your nationality.',
      purpose: 'Choose your purpose of stay.',
    },
  );
});

test('step 4 requires the applicant concern', async () => {
  const { validateWizardStep } = await importIntakeModule();

  assert.deepEqual(
    validateWizardStep(4, { ...completeValues, concern: '  ' }),
    { concern: 'Tell Ria what worries you most.' },
  );
});

test('step 5 requires a valid email address', async () => {
  const { validateWizardStep } = await importIntakeModule();

  assert.deepEqual(
    validateWizardStep(5, { ...completeValues, email: 'not-an-email' }),
    { email: 'Enter a valid email address.' },
  );
  assert.deepEqual(validateWizardStep(5, completeValues), {});
});
