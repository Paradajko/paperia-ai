import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { google } from 'googleapis';

import { runOAuthSetup } from '../scripts/google-oauth-setup.mjs';

const CLIENT_ID = 'test-client-id';
const CLIENT_SECRET = 'test-client-secret';
const TOKENS = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expiry_date: 1_900_000_000_000,
  scope: 'https://www.googleapis.com/auth/webmasters',
  token_type: 'Bearer',
};

async function createFixture() {
  const directory = await mkdtemp(path.join(tmpdir(), 'paperia-google-oauth-'));
  const clientPath = path.join(directory, 'google-oauth-client.json');
  const tokenPath = path.join(directory, 'google-search-console-token.json');

  await writeFile(clientPath, JSON.stringify({
    installed: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    },
  }));

  return { clientPath, tokenPath };
}

test('generates an offline consent URL with the webmasters scope', async (t) => {
  const { clientPath, tokenPath } = await createFixture();
  let receivedOptions;

  t.mock.method(google.auth.OAuth2.prototype, 'generateAuthUrl', function (options) {
    receivedOptions = options;
    return 'https://accounts.google.com/test-auth';
  });
  t.mock.method(google.auth.OAuth2.prototype, 'getToken', async function () {
    return { tokens: TOKENS };
  });
  t.mock.method(google.auth.OAuth2.prototype, 'refreshAccessToken', async function () {
    return { credentials: TOKENS };
  });

  await runOAuthSetup({
    clientPath,
    tokenPath,
    promptForCode: async () => 'authorization-code',
    log: () => {},
  });

  assert.deepEqual(receivedOptions, {
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/webmasters'],
  });
});

test('exchanges the authorization code and persists tokens', async (t) => {
  const { clientPath, tokenPath } = await createFixture();
  let receivedCode;

  t.mock.method(google.auth.OAuth2.prototype, 'generateAuthUrl', () => 'https://accounts.google.com/test-auth');
  t.mock.method(google.auth.OAuth2.prototype, 'getToken', async function (code) {
    receivedCode = code;
    return { tokens: TOKENS };
  });
  t.mock.method(google.auth.OAuth2.prototype, 'refreshAccessToken', async function () {
    return { credentials: TOKENS };
  });

  await runOAuthSetup({
    clientPath,
    tokenPath,
    promptForCode: async () => 'authorization-code',
    log: () => {},
  });

  assert.equal(receivedCode, 'authorization-code');
  assert.deepEqual(JSON.parse(await readFile(tokenPath, 'utf8')), TOKENS);
});

test('sets credentials and verifies refresh-token operation', async (t) => {
  const { clientPath, tokenPath } = await createFixture();
  let credentials;
  let refreshCalls = 0;

  t.mock.method(google.auth.OAuth2.prototype, 'generateAuthUrl', () => 'https://accounts.google.com/test-auth');
  t.mock.method(google.auth.OAuth2.prototype, 'getToken', async () => ({ tokens: TOKENS }));
  t.mock.method(google.auth.OAuth2.prototype, 'setCredentials', function (tokens) {
    credentials = tokens;
  });
  t.mock.method(google.auth.OAuth2.prototype, 'refreshAccessToken', async function () {
    refreshCalls += 1;
    return { credentials: TOKENS };
  });

  await runOAuthSetup({
    clientPath,
    tokenPath,
    promptForCode: async () => 'authorization-code',
    log: () => {},
  });

  assert.deepEqual(credentials, TOKENS);
  assert.equal(refreshCalls, 1);
});
