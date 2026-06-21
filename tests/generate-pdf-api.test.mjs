import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importTypescriptModule } from './helpers/import-typescript.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const validPayload = {
  name: 'Mira Example',
  nationality: 'Serbia',
  currentLocation: 'Outside Slovakia',
  purpose: 'employment',
  statusReason: 'I have an employer or job offer',
  documents: ['Passport', 'Accommodation proof'],
  concern: 'Do I need an apostille?',
  email: 'mira@example.com',
};

async function loadEndpoint() {
  return importTypescriptModule(
    repoRoot,
    'api/generate-pdf.ts',
    `generate-pdf-api-${Date.now()}-${Math.random()}`,
  );
}

const endpointModule = loadEndpoint();

function request(body, headers = {}) {
  return {
    method: 'POST',
    body,
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.10',
      ...headers,
    },
    socket: { remoteAddress: '127.0.0.1' },
  };
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    send(body) {
      this.body = body;
    },
  };
}

function handlerFrom(module, options = {}) {
  return module.createGeneratePdfHandler({
    renderPdf: async () => Buffer.from('%PDF-mocked'),
    limits: new Map(),
    now: () => 1_800_000_000_000,
    ...options,
  });
}

test('valid payload returns PDF bytes and attachment headers', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request(validPayload), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/pdf');
  assert.equal(
    res.headers['content-disposition'],
    'attachment; filename="riadence-slovakia-checklist.pdf"',
  );
  assert.deepEqual(res.body, Buffer.from('%PDF-mocked'));
});

test('missing name returns a field-specific 400 error', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();
  const { name: _name, ...payload } = validPayload;

  await handler(request(payload), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Missing field: name' });
});

test('invalid email returns 400', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request({ ...validPayload, email: 'not-an-email' }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Invalid email' });
});

test('documents rejects more than 20 items', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request({
    ...validPayload,
    documents: Array.from({ length: 21 }, (_, index) => `Document ${index}`),
  }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'documents: max 20 items' });
});

test('documents rejects an item over 100 characters', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request({
    ...validPayload,
    documents: ['x'.repeat(150)],
  }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'documents[0]: max 100 chars' });
});

test('name rejects values over 200 characters', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request({ ...validPayload, name: 'x'.repeat(250) }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'name: max 200 chars' });
});

test('unknown fields are rejected', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request({ ...validPayload, extraField: true }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Unknown field: extraField' });
});

test('non-JSON content type returns 400', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request(validPayload, { 'content-type': 'text/plain' }), res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    error: 'Content-Type must be application/json',
  });
});

test('request bodies over 20 KB return 413 before validation', async () => {
  const module = await endpointModule;
  const handler = handlerFrom(module);
  const res = response();

  await handler(request({ ...validPayload, name: 'x'.repeat(25 * 1024) }), res);

  assert.equal(res.statusCode, 413);
  assert.deepEqual(res.body, { error: 'Payload Too Large' });
});

test('the twenty-first request from one IP is rate limited for one hour', async () => {
  const module = await endpointModule;
  const limits = new Map();
  const handler = handlerFrom(module, { limits });

  for (let index = 0; index < 20; index += 1) {
    const res = response();
    await handler(request(validPayload), res);
    assert.equal(res.statusCode, 200);
  }

  const limitedResponse = response();
  await handler(request(validPayload), limitedResponse);

  assert.equal(limitedResponse.statusCode, 429);
  assert.equal(limitedResponse.headers['retry-after'], '3600');
  assert.deepEqual(limitedResponse.body, { error: 'Rate limit exceeded' });
});

test('the production renderer returns a real PDF document', async () => {
  const module = await endpointModule;
  const res = response();

  await module.default(
    request(validPayload, { 'x-forwarded-for': '203.0.113.99' }),
    res,
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/pdf');
  assert.ok(Buffer.isBuffer(res.body));
  assert.equal(res.body.subarray(0, 4).toString(), '%PDF');
  assert.ok(res.body.length > 10_000);
  assert.equal(
    (res.body.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length,
    5,
  );
});
