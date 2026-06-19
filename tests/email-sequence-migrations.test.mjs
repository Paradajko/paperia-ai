import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(path) {
  try {
    return readFileSync(resolve(repoRoot, path), 'utf8');
  } catch {
    return '';
  }
}

test('email sequence migration defines the protected queue and atomic claim RPC', () => {
  const sql = read('supabase/migrations/20260619000001_email_sequence.sql');

  assert.match(sql, /create table (?:if not exists )?public\.email_sequence/i);
  assert.match(sql, /lead_id uuid references public\.leads\(id\) on delete cascade/i);
  assert.match(sql, /step int not null check \(step between 1 and 10\)/i);
  for (const status of ['pending', 'processing', 'sent', 'failed', 'unsubscribed']) {
    assert.match(sql, new RegExp(`'${status}'`));
  }
  assert.match(sql, /create index idx_email_sequence_pending/i);
  assert.match(sql, /where status = 'pending'/i);
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /service_role_full_access/i);
  assert.match(sql, /create or replace function public\.claim_email_sequence/i);
  assert.match(sql, /set status = 'processing'/i);
  assert.match(sql, /where id = sequence_id\s+and status = 'pending'/i);
  assert.match(sql, /returning \*/i);
});

test('lead consent migration adds fields and transactional completion and unsubscribe RPCs', () => {
  const sql = read('supabase/migrations/20260619000002_add_email_consent.sql');

  assert.match(sql, /add column if not exists name text/i);
  assert.match(
    sql,
    /add column if not exists email_sequence_consent boolean not null default false/i,
  );
  assert.match(sql, /create or replace function public\.complete_intake/i);
  assert.match(sql, /create or replace function public\.unsubscribe_email_sequence/i);
  assert.match(sql, /case when input_email_sequence_consent then/i);
  for (const day of [0, 2, 5, 8, 14]) {
    assert.match(sql, new RegExp(`make_interval\\(days => ${day}\\)`));
  }
  assert.match(sql, /set status = 'unsubscribed'/i);
  assert.match(sql, /set email_sequence_consent = false/i);
});

test('Vercel schedules both UTC slots for Bratislava 09:00 delivery', () => {
  const config = JSON.parse(read('vercel.json'));
  assert.deepEqual(config.crons, [
    { path: '/api/cron/send-sequence', schedule: '0 7 * * *' },
    { path: '/api/cron/send-sequence', schedule: '0 8 * * *' },
  ]);
});
