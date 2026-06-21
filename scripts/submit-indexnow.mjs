import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(scriptPath), '..');
const keyPath = resolve(repoRoot, 'public/indexnow-key.txt');

const host = 'riadence.com';
const defaultUrlList = [
  'https://riadence.com/',
  'https://riadence.com/sk/',
  'https://riadence.com/rs/',
  'https://riadence.com/ua/',
];

export async function submitIndexNow(argv = process.argv) {
  const key = readFileSync(keyPath, 'utf8').trim();
  const urlList = argv[2]
    ? argv[2].split(',').map((url) => url.trim()).filter(Boolean)
    : defaultUrlList;
  const payload = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList,
  };
  const response = await globalThis.fetch(
    'https://api.indexnow.org/indexnow',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    },
  );

  console.log(`Status: ${response.status}`);
  const accepted = response.status === 200 || response.status === 202;
  const body = accepted ? '' : await response.text();
  if (body) {
    console.error(body);
  }

  return {
    status: response.status,
    body,
    payload,
    exitCode: accepted ? 0 : 1,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  try {
    const result = await submitIndexNow();
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
