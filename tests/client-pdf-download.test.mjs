import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const payload = {
  name: 'Mira Example',
  nationality: 'Bosnia and Herzegovina',
  currentLocation: 'Outside Slovakia',
  purpose: 'employment',
  statusReason: 'I have an employer or job offer',
  documents: ['Passport'],
  concern: 'What should I prepare?',
  email: 'mira@example.com',
};

test('posts the whitelisted payload and downloads the returned PDF blob', async () => {
  const { downloadChecklistPdf } = await importTypescriptModule(
    repoRoot,
    'src/lib/pdf-download.ts',
    'client-pdf-download',
  );
  const pdfBlob = new Blob(['%PDF-client-test'], { type: 'application/pdf' });
  const calls = {
    request: undefined,
    appended: false,
    clicked: false,
    removed: false,
    revoked: undefined,
  };
  const link = {
    href: '',
    download: '',
    click() {
      calls.clicked = true;
    },
    remove() {
      calls.removed = true;
    },
  };

  await downloadChecklistPdf(payload, {
    fetchImpl: async (url, init) => {
      calls.request = { url, init };
      return {
        ok: true,
        blob: async () => pdfBlob,
      };
    },
    createObjectUrl: (blob) => {
      assert.equal(blob, pdfBlob);
      return 'blob:checklist';
    },
    revokeObjectUrl: (url) => {
      calls.revoked = url;
    },
    createLink: () => link,
    appendLink: (value) => {
      assert.equal(value, link);
      calls.appended = true;
    },
    schedule: (callback, delay) => {
      assert.equal(delay, 1_000);
      callback();
    },
  });

  assert.equal(calls.request.url, '/api/generate-pdf');
  assert.equal(calls.request.init.method, 'POST');
  assert.deepEqual(calls.request.init.headers, {
    'Content-Type': 'application/json',
  });
  assert.deepEqual(JSON.parse(calls.request.init.body), payload);
  assert.equal(link.href, 'blob:checklist');
  assert.equal(
    link.download,
    'paperia-slovakia-checklist-bosnia-and-herzegovina.pdf',
  );
  assert.equal(calls.appended, true);
  assert.equal(calls.clicked, true);
  assert.equal(calls.removed, true);
  assert.equal(calls.revoked, 'blob:checklist');
});

test('rejects a failed API response before creating a download link', async () => {
  const { downloadChecklistPdf } = await importTypescriptModule(
    repoRoot,
    'src/lib/pdf-download.ts',
    'client-pdf-download-error',
  );
  let createdLink = false;

  await assert.rejects(
    downloadChecklistPdf(payload, {
      fetchImpl: async () => ({ ok: false }),
      createLink: () => {
        createdLink = true;
        return {
          href: '',
          download: '',
          click() {},
          remove() {},
        };
      },
    }),
    /PDF generation failed/,
  );
  assert.equal(createdLink, false);
});

test('default browser fetch is invoked without binding it to the dependency object', async () => {
  const originalFetch = globalThis.fetch;
  let receivedThis;
  globalThis.fetch = async function receiverSensitiveFetch() {
    'use strict';
    receivedThis = this;
    if (this !== undefined) {
      throw new TypeError('Can only call Window.fetch on instances of Window');
    }
    return {
      ok: true,
      blob: async () => new Blob(['%PDF-webkit'], { type: 'application/pdf' }),
    };
  };

  try {
    const { downloadChecklistPdf } = await importTypescriptModule(
      repoRoot,
      'src/lib/pdf-download.ts',
      'client-pdf-download-webkit-fetch',
    );
    await downloadChecklistPdf(payload, {
      createObjectUrl: () => 'blob:webkit-checklist',
      revokeObjectUrl() {},
      createLink: () => ({
        href: '',
        download: '',
        click() {},
        remove() {},
      }),
      appendLink() {},
      schedule(callback) {
        callback();
      },
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(receivedThis, undefined);
});
