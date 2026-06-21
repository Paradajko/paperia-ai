import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function importTypescriptModule(repoRoot, relativePath, label) {
  const tempDir = resolve('/private/tmp', `riadence-${label}-test`);
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });
  symlinkSync(resolve(repoRoot, 'node_modules'), resolve(tempDir, 'node_modules'));

  execFileSync(
    resolve(repoRoot, 'node_modules/.bin/tsc'),
    [
      resolve(repoRoot, relativePath),
      '--target',
      'ES2022',
      '--module',
      'ES2022',
      '--moduleResolution',
      'bundler',
      '--jsx',
      'react-jsx',
      '--rootDir',
      repoRoot,
      '--outDir',
      tempDir,
      '--skipLibCheck',
      '--strict',
      '--esModuleInterop',
      '--lib',
      'ES2022,DOM',
      '--types',
      'node',
    ],
    { cwd: repoRoot },
  );

  const riaAvatar = resolve(repoRoot, 'src/assets/ria-guide-half.png');
  if (existsSync(riaAvatar)) {
    const outputAssetDir = resolve(tempDir, 'src/assets');
    mkdirSync(outputAssetDir, { recursive: true });
    copyFileSync(riaAvatar, resolve(outputAssetDir, 'ria-guide-half.png'));
  }

  const generatedPath = relativePath.replace(/\.tsx?$/, '.js');
  return import(
    `${pathToFileURL(resolve(tempDir, generatedPath)).href}?t=${Date.now()}`
  );
}
