import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const header = readFileSync(
  resolve(repoRoot, 'src/components/Header.tsx'),
  'utf8',
);
const switcher = readFileSync(
  resolve(repoRoot, 'src/components/LocaleSwitcher.tsx'),
  'utf8',
);

test('mobile header exposes a compact LocaleSwitcher before the CTA', () => {
  assert.match(header, /<LocaleSwitcher compact \/>/);
  assert.ok(
    header.indexOf('<LocaleSwitcher compact />') < header.indexOf('onClick={onStart}'),
  );
  assert.match(header, /sm:hidden/);
});

test('compact LocaleSwitcher navigates from a 44px language control', () => {
  assert.match(switcher, /compact\?: boolean/);
  assert.match(switcher, /onChange=\{\(event\) => \{[\s\S]*navigate\(selected\.path\)/);
  assert.match(switcher, /min-h-11/);
  assert.match(switcher, /aria-label="Language"/);
});
