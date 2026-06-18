import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = resolve(repoRoot, 'node_modules/.paperia-api-test');

async function importApiModule(fileName) {
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  execFileSync(
    resolve(repoRoot, 'node_modules/.bin/tsc'),
    [
      resolve(repoRoot, `api/${fileName}.ts`),
      '--target',
      'ES2022',
      '--module',
      'ES2022',
      '--moduleResolution',
      'bundler',
      '--outDir',
      tempDir,
      '--skipLibCheck',
      '--strict',
      '--esModuleInterop',
      '--lib',
      'ES2022,DOM',
    ],
    { cwd: repoRoot },
  );

  return import(
    `${pathToFileURL(resolve(tempDir, `${fileName}.js`)).href}?t=${Date.now()}`
  );
}

function createResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
    },
  };
}

test('send-welcome rejects a request without an email address', async () => {
  const { createSendWelcomeHandler } = await importApiModule('send-welcome');
  const handler = createSendWelcomeHandler(async () => ({ error: null }));
  const response = createResponse();

  await handler({ method: 'POST', body: {} }, response);

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.payload, { error: 'Email is required' });
});

test('send-welcome personalizes both email variants and includes the disclaimer', async () => {
  const { createSendWelcomeHandler } = await importApiModule('send-welcome');
  let sentEmail;
  const handler = createSendWelcomeHandler(async (email) => {
    sentEmail = email;
    return { error: null };
  });
  const response = createResponse();

  await handler(
    {
      method: 'POST',
      body: {
        email: 'ada@example.com',
        name: 'Ada',
        nationality: 'Ukrainian',
        destinationCountry: 'Slovakia',
        residenceType: 'employment',
      },
    },
    response,
  );

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { ok: true });
  assert.equal(sentEmail.to, 'ada@example.com');
  assert.equal(sentEmail.replyTo, 'hello@paperia.ai');
  assert.equal(sentEmail.subject, 'Your Slovakia residence checklist is ready inside');
  assert.match(sentEmail.text, /Hi Ada/);
  assert.match(sentEmail.html, /Hi Ada/);
  assert.match(sentEmail.text, /personalized PDF checklist/i);
  assert.match(sentEmail.text, /follow-up/i);
  assert.match(sentEmail.html, /https:\/\/paperia-ai\.vercel\.app\/ria-guide-half\.png/);
  assert.match(sentEmail.html, /personalized PDF checklist/i);
  assert.match(sentEmail.html, /<table/);
  assert.match(sentEmail.text, /I am not a lawyer\./);
  assert.match(sentEmail.html, /I am not a lawyer\./);
});

test('ria-chat sends the required model settings, context, and system prompt', async () => {
  const { createRiaChatHandler } = await importApiModule('ria-chat');
  let completionRequest;
  const handler = createRiaChatHandler(async (request) => {
    completionRequest = request;
    return 'Prepare your passport and proof of accommodation.';
  });
  const response = createResponse();

  await handler(
    {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'What documents do I need?' }],
        applicantContext: {
          nationality: 'Ukrainian',
          destinationCountry: 'Slovakia',
          residenceType: 'employment',
          currentStep: 'documents',
        },
      },
    },
    response,
  );

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    reply: 'Prepare your passport and proof of accommodation.',
  });
  assert.equal(completionRequest.model, 'gpt-4o-mini');
  assert.equal(completionRequest.max_tokens, 600);
  assert.equal(completionRequest.temperature, 0.4);
  assert.match(completionRequest.messages[0].content, /You are Ria/);
  assert.match(completionRequest.messages[0].content, /not a lawyer/);
  assert.match(completionRequest.messages[0].content, /Slovakia/);
});

test('ria-chat returns 500 for an invalid messages payload', async () => {
  const { createRiaChatHandler } = await importApiModule('ria-chat');
  const handler = createRiaChatHandler(async () => 'unused');
  const response = createResponse();

  await handler({ method: 'POST', body: { messages: [] } }, response);

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.payload, { error: 'A non-empty messages array is required' });
});
