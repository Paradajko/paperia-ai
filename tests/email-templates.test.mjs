import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('all five sequence templates include required branding, legal links, and unsubscribe', async () => {
  const { EMAIL_TEMPLATES, buildSequenceEmail } = await importTypescriptModule(
    repoRoot,
    'api/emails/templates.ts',
    'email-templates',
  );
  const keys = [
    'welcome',
    'education-day2',
    'checklist-reminder-day5',
    'case-study-day8',
    'agency-handoff-day14',
  ];

  assert.deepEqual(Object.keys(EMAIL_TEMPLATES), keys);

  for (const key of keys) {
    const email = buildSequenceEmail(key, {
      email: 'ada@example.com',
      name: 'Ada',
      nationality: 'India',
      destinationCountry: 'Slovakia',
      residenceType: 'employment',
      unsubscribeUrl:
        'https://riadence.com/api/unsubscribe?token=signed&email=ada%40example.com',
    });

    assert.ok(email.subject);
    assert.ok(email.html);
    assert.ok(email.text);
    assert.match(email.html, /https:\/\/riadence\.com\/ria-guide-half\.png/);
    assert.match(email.html, /https:\/\/riadence\.com\/privacy/);
    assert.match(email.html, /https:\/\/riadence\.com\/terms/);
    assert.match(email.html, /api\/unsubscribe\?token=/);
    assert.match(email.text, /Unsubscribe:/);
    assert.match(email.text, /not legal advice/i);
    assert.match(email.headers['List-Unsubscribe'], /api\/unsubscribe/);
    assert.equal(
      email.headers['List-Unsubscribe-Post'],
      'List-Unsubscribe=One-Click',
    );
  }
});

test('sequence content is educational, honest, and safely personalized', async () => {
  const { buildSequenceEmail } = await importTypescriptModule(
    repoRoot,
    'api/emails/templates.ts',
    'email-content',
  );
  const context = {
    email: 'person@example.com',
    name: '<Ada>',
    nationality: '<India>',
    destinationCountry: 'Slovakia',
    residenceType: 'employment',
    unsubscribeUrl: 'https://riadence.com/api/unsubscribe?token=x&email=y',
  };

  const education = buildSequenceEmail('education-day2', context);
  assert.match(education.text, /translation/i);
  assert.match(education.text, /apostille/i);
  assert.match(education.text, /health insurance/i);

  const reminder = buildSequenceEmail('checklist-reminder-day5', context);
  assert.match(reminder.text, /https:\/\/riadence\.com/);
  assert.match(reminder.text, /Ria/i);

  const caseStudy = buildSequenceEmail('case-study-day8', context);
  assert.match(caseStudy.subject, /India/);
  assert.match(caseStudy.text, /illustrative example/i);
  assert.doesNotMatch(caseStudy.html, /<Ada>|<India>/);

  const handoff = buildSequenceEmail('agency-handoff-day14', context);
  assert.match(handoff.text, /may earn a commission/i);
  assert.match(handoff.html, /mailto:hello@riadence\.com/);
  assert.doesNotMatch(handoff.text, /verified agency marketplace/i);
});
