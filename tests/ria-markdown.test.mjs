import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Ria assistant markdown renders headings, bold text, and GFM bullets as HTML', async () => {
  const { RiaMarkdown } = await importTypescriptModule(
    repoRoot,
    'src/components/RiaMarkdown.tsx',
    'ria-markdown',
  );
  const html = renderToStaticMarkup(
    createElement(RiaMarkdown, {
      children: '## Next steps\n\nUse **official documents**.\n\n- Passport\n- Apostille',
    }),
  );

  assert.match(html, /<h2[^>]*>Next steps<\/h2>/);
  assert.match(html, /<strong[^>]*>official documents<\/strong>/);
  assert.match(
    html,
    /<ul[^>]*>\s*<li[^>]*>Passport<\/li>\s*<li[^>]*>Apostille<\/li>\s*<\/ul>/,
  );
  assert.doesNotMatch(html, /## Next steps|\*\*official documents\*\*/);
});
