import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('IndexNow verification key is a single 32-character lowercase hex value', () => {
  const key = readFileSync(
    resolve(repoRoot, 'public/indexnow-key.txt'),
    'utf8',
  );

  assert.equal(key.length, 32);
  assert.match(key, /^[0-9a-f]{32}$/);
});
