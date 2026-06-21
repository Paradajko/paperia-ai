import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { runSearchConsoleSubmit } from '../scripts/submit-search-console.mjs';

const SITE_URL = 'https://riadence.com/';

async function createFixture(tokens = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), 'paperia-search-console-'));
  const clientPath = path.join(directory, 'google-oauth-client.json');
  const tokenPath = path.join(directory, 'google-search-console-token.json');

  await writeFile(clientPath, JSON.stringify({
    installed: {
      client_id: 'test-client-id',
      client_secret: 'test-client-secret',
    },
  }));
  await writeFile(tokenPath, JSON.stringify({
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expiry_date: Date.now() + 3_600_000,
    ...tokens,
  }));

  return { clientPath, tokenPath };
}

function createGoogleMock({ sites = [{ siteUrl: SITE_URL }], refreshedTokens } = {}) {
  const calls = {
    credentials: [],
    refresh: 0,
    sitemap: [],
  };

  class OAuth2 {
    setCredentials(tokens) {
      calls.credentials.push(tokens);
    }

    async refreshAccessToken() {
      calls.refresh += 1;
      return {
        credentials: refreshedTokens ?? {
          access_token: 'refreshed-access-token',
          expiry_date: Date.now() + 3_600_000,
        },
      };
    }
  }

  const webmasters = {
    sites: {
      list: async () => ({ data: { siteEntry: sites } }),
    },
    sitemaps: {
      submit: async (params) => {
        calls.sitemap.push(params);
      },
    },
  };

  return {
    calls,
    googleApi: {
      auth: { OAuth2 },
      webmasters: () => webmasters,
    },
  };
}

test('verifies the URL-prefix property and submits sitemap.xml', async () => {
  const { clientPath, tokenPath } = await createFixture();
  const { calls, googleApi } = createGoogleMock();

  await runSearchConsoleSubmit({
    clientPath,
    tokenPath,
    googleApi,
    log: () => {},
  });

  assert.deepEqual(calls.sitemap, [{
    siteUrl: SITE_URL,
    feedpath: 'https://riadence.com/sitemap.xml',
  }]);
});

test('rejects sitemap submission when the site is not verified', async () => {
  const { clientPath, tokenPath } = await createFixture();
  const { calls, googleApi } = createGoogleMock({ sites: [] });

  await assert.rejects(
    runSearchConsoleSubmit({
      clientPath,
      tokenPath,
      googleApi,
      log: () => {},
    }),
    /Site NOT verified/,
  );
  assert.equal(calls.sitemap.length, 0);
});

test('refreshes an expiring token and persists merged credentials', async () => {
  const { clientPath, tokenPath } = await createFixture({
    expiry_date: Date.now() - 1,
  });
  const { calls, googleApi } = createGoogleMock({
    refreshedTokens: {
      access_token: 'new-access-token',
      expiry_date: Date.now() + 3_600_000,
    },
  });

  await runSearchConsoleSubmit({
    clientPath,
    tokenPath,
    googleApi,
    log: () => {},
  });

  const persisted = JSON.parse(await readFile(tokenPath, 'utf8'));
  assert.equal(calls.refresh, 1);
  assert.equal(persisted.access_token, 'new-access-token');
  assert.equal(persisted.refresh_token, 'test-refresh-token');
});
