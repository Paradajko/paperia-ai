import { randomBytes } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keyPath = resolve(repoRoot, 'public/indexnow-key.txt');

if (!existsSync(keyPath)) {
  mkdirSync(dirname(keyPath), { recursive: true });
  writeFileSync(keyPath, randomBytes(16).toString('hex'), 'utf8');
}

const key = readFileSync(keyPath, 'utf8').trim();
const protocolKeyPath = resolve(repoRoot, `public/${key}.txt`);
if (
  !existsSync(protocolKeyPath) ||
  readFileSync(protocolKeyPath, 'utf8') !== key
) {
  writeFileSync(protocolKeyPath, key, 'utf8');
}
