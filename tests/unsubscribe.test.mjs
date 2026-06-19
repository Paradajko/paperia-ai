import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('unsubscribe tokens validate, expire, reject tampering, and cap lifetime', async () => {
  const { createUnsubscribeToken, verifyUnsubscribeToken } =
    await importTypescriptModule(
      repoRoot,
      'api/emails/unsubscribe-token.ts',
      'unsubscribe-token',
    );
  const secret = 'a-secure-test-secret';
  const now = new Date('2026-06-19T10:00:00Z');
  const token = createUnsubscribeToken(
    ' Person@Example.com ',
    secret,
    now,
    30,
  );

  assert.equal(
    verifyUnsubscribeToken('person@example.com', token, secret, now),
    true,
  );
  assert.equal(
    verifyUnsubscribeToken(
      'person@example.com',
      `${token.slice(0, -1)}x`,
      secret,
      now,
    ),
    false,
  );
  assert.equal(
    verifyUnsubscribeToken(
      'person@example.com',
      token,
      secret,
      new Date('2026-08-01T10:00:00Z'),
    ),
    false,
  );
  assert.throws(() =>
    createUnsubscribeToken('person@example.com', secret, now, 91),
  );
});
