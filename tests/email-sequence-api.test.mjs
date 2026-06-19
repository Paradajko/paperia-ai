import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function createResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    redirectedTo: undefined,
    sent: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
    },
    send(payload) {
      this.sent = payload;
    },
    redirect(code, path) {
      this.statusCode = code;
      this.redirectedTo = path;
    },
  };
}

const intake = {
  email: 'ada@example.com',
  name: 'Ada',
  nationality: 'India',
  currentLocation: 'Outside Slovakia',
  purpose: 'employment',
  statusReason: 'I have an employer or job offer',
  documents: ['Passport'],
  concern: 'Apostille',
};

test('complete-intake rejects invalid or incomplete wizard data', async () => {
  const { createCompleteIntakeHandler } = await importTypescriptModule(
    repoRoot,
    'api/complete-intake.ts',
    'complete-validation',
  );
  let called = false;
  const handler = createCompleteIntakeHandler({
    completeIntake: async () => {
      called = true;
      throw new Error('should not run');
    },
    sendEmail: async () => ({ error: null }),
    updateSequence: async () => {},
    createContact: async () => ({ error: null }),
    unsubscribeSecret: 'test-secret',
  });
  const response = createResponse();

  await handler(
    { method: 'POST', body: { ...intake, concern: '', email: 'bad' } },
    response,
  );

  assert.equal(response.statusCode, 400);
  assert.equal(called, false);
});

test('complete-intake creates the consent-gated sequence and sends welcome', async () => {
  const { createCompleteIntakeHandler } = await importTypescriptModule(
    repoRoot,
    'api/complete-intake.ts',
    'complete-intake',
  );

  for (const consent of [false, true]) {
    const calls = { complete: [], sent: [], updated: [], contacts: [] };
    const handler = createCompleteIntakeHandler({
      completeIntake: async (input) => {
        calls.complete.push(input);
        return {
          leadId: 'lead-1',
          sequenceId: 'sequence-1',
          sequenceCount: input.emailSequenceConsent ? 5 : 1,
        };
      },
      sendEmail: async (email) => {
        calls.sent.push(email);
        return { error: null };
      },
      updateSequence: async (id, values) => {
        calls.updated.push({ id, values });
      },
      createContact: async (values) => {
        calls.contacts.push(values);
        return { error: null };
      },
      unsubscribeSecret: 'test-secret',
      now: () => new Date('2026-06-19T10:00:00Z'),
    });
    const response = createResponse();

    await handler(
      {
        method: 'POST',
        body: { ...intake, emailSequenceConsent: consent },
      },
      response,
    );

    assert.equal(response.statusCode, 200);
    assert.equal(response.payload.sequenceCount, consent ? 5 : 1);
    assert.equal(calls.sent.length, 1);
    assert.equal(calls.updated[0].values.status, 'sent');
    assert.equal(calls.contacts.length, consent ? 1 : 0);
  }
});

test('complete-intake defaults consent false and records welcome failure', async () => {
  const { createCompleteIntakeHandler } = await importTypescriptModule(
    repoRoot,
    'api/complete-intake.ts',
    'complete-default',
  );
  let completedInput;
  let update;
  const handler = createCompleteIntakeHandler({
    completeIntake: async (input) => {
      completedInput = input;
      return { leadId: 'lead', sequenceId: 'sequence', sequenceCount: 1 };
    },
    sendEmail: async () => ({ error: new Error('provider failed') }),
    updateSequence: async (_id, values) => {
      update = values;
    },
    createContact: async () => ({ error: null }),
    unsubscribeSecret: 'test-secret',
    now: () => new Date('2026-06-19T10:00:00Z'),
  });
  const response = createResponse();

  await handler({ method: 'POST', body: intake }, response);

  assert.equal(completedInput.emailSequenceConsent, false);
  assert.equal(update.status, 'failed');
  assert.match(update.error_message, /provider failed/);
  assert.equal(response.statusCode, 200);
  assert.equal(response.payload.warning, 'Welcome email delivery failed');
});

test('cron authorizes, guards Bratislava hour, atomically claims, and updates rows', async () => {
  const { createSendSequenceHandler } = await importTypescriptModule(
    repoRoot,
    'api/cron/send-sequence.ts',
    'sequence-cron',
  );
  const sent = [];
  const updates = [];
  let dueCalls = 0;
  const handler = createSendSequenceHandler({
    cronSecret: 'cron-secret',
    unsubscribeSecret: 'unsubscribe-secret',
    now: () => new Date('2026-07-01T07:15:00Z'),
    fetchDue: async (limit) => {
      dueCalls += 1;
      assert.equal(limit, 50);
      return [
        { id: 'claimed', lead_id: 'lead-1', email: 'a@example.com', step: 2, template_key: 'education-day2' },
        { id: 'lost-race', lead_id: 'lead-2', email: 'b@example.com', step: 3, template_key: 'checklist-reminder-day5' },
        { id: 'revoked', lead_id: 'lead-3', email: 'c@example.com', step: 4, template_key: 'case-study-day8' },
      ];
    },
    claim: async (id) => (id === 'lost-race' ? null : { id }),
    getLead: async (id) => ({
      name: null,
      nationality: 'India',
      purpose: 'employment',
      email_sequence_consent: id !== 'lead-3',
    }),
    sendEmail: async (email) => {
      sent.push(email);
      return { error: null };
    },
    updateSequence: async (id, values) => {
      updates.push({ id, values });
    },
  });

  const unauthorized = createResponse();
  await handler({ method: 'GET', headers: {} }, unauthorized);
  assert.equal(unauthorized.statusCode, 401);
  assert.equal(dueCalls, 0);

  const response = createResponse();
  await handler(
    { method: 'GET', headers: { authorization: 'Bearer cron-secret' } },
    response,
  );

  assert.equal(response.statusCode, 200);
  assert.equal(dueCalls, 1);
  assert.equal(sent.length, 1);
  assert.ok(updates.some((item) => item.id === 'claimed' && item.values.status === 'sent'));
  assert.ok(updates.some((item) => item.id === 'revoked' && item.values.status === 'unsubscribed'));
  assert.deepEqual(response.payload, { processed: 2, sent: 1, failed: 0, unsubscribed: 1 });
});

test('cron skips work outside Bratislava 09:00 and records provider failure', async () => {
  const { createSendSequenceHandler } = await importTypescriptModule(
    repoRoot,
    'api/cron/send-sequence.ts',
    'sequence-cron-guard',
  );
  let queried = false;
  const skippedHandler = createSendSequenceHandler({
    cronSecret: 'secret',
    unsubscribeSecret: 'unsubscribe',
    now: () => new Date('2026-07-01T08:15:00Z'),
    fetchDue: async () => {
      queried = true;
      return [];
    },
    claim: async () => null,
    getLead: async () => null,
    sendEmail: async () => ({ error: null }),
    updateSequence: async () => {},
  });
  const skipped = createResponse();
  await skippedHandler(
    { method: 'GET', headers: { authorization: 'Bearer secret' } },
    skipped,
  );
  assert.deepEqual(skipped.payload, { skipped: true });
  assert.equal(queried, false);

  let failureUpdate;
  const failureHandler = createSendSequenceHandler({
    cronSecret: 'secret',
    unsubscribeSecret: 'unsubscribe',
    now: () => new Date('2026-01-10T08:15:00Z'),
    fetchDue: async () => [
      { id: 'one', lead_id: 'lead', email: 'x@example.com', step: 2, template_key: 'education-day2' },
    ],
    claim: async () => ({ id: 'one' }),
    getLead: async () => ({ name: null, nationality: 'Serbia', purpose: 'study', email_sequence_consent: true }),
    sendEmail: async () => ({ error: new Error('send failed') }),
    updateSequence: async (_id, values) => {
      failureUpdate = values;
    },
  });
  const failed = createResponse();
  await failureHandler(
    { method: 'GET', headers: { authorization: 'Bearer secret' } },
    failed,
  );
  assert.equal(failureUpdate.status, 'failed');
  assert.match(failureUpdate.error_message, /send failed/);
});

test('unsubscribe endpoint validates token, calls RPC, redirects GET, and supports POST', async () => {
  const { createUnsubscribeHandler } = await importTypescriptModule(
    repoRoot,
    'api/unsubscribe.ts',
    'unsubscribe-handler',
  );
  const { createUnsubscribeToken } = await importTypescriptModule(
    repoRoot,
    'api/emails/unsubscribe-token.ts',
    'unsubscribe-handler-token',
  );
  const now = new Date('2026-06-19T10:00:00Z');
  const secret = 'unsubscribe-secret';
  const token = createUnsubscribeToken('ada@example.com', secret, now, 30);
  const calls = [];
  const handler = createUnsubscribeHandler({
    unsubscribeSecret: secret,
    now: () => now,
    unsubscribe: async (email) => calls.push(email),
  });

  const invalid = createResponse();
  await handler(
    { method: 'GET', query: { email: 'ada@example.com', token: 'bad' } },
    invalid,
  );
  assert.equal(invalid.statusCode, 400);

  const getResponse = createResponse();
  await handler(
    { method: 'GET', query: { email: 'ada@example.com', token } },
    getResponse,
  );
  assert.deepEqual(calls, ['ada@example.com']);
  assert.equal(getResponse.redirectedTo, '/unsubscribed');

  const postResponse = createResponse();
  await handler(
    { method: 'POST', query: { email: 'ada@example.com', token } },
    postResponse,
  );
  assert.equal(postResponse.statusCode, 200);
  assert.equal(postResponse.sent, '');
});
