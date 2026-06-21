import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keyPath = resolve(repoRoot, 'public/indexnow-key.txt');

if (!existsSync(keyPath)) {
  mkdirSync(dirname(keyPath), { recursive: true });
  writeFileSync(keyPath, randomBytes(16).toString('hex'), 'utf8');
}
