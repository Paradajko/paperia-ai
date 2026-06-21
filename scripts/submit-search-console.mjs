import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { google } from 'googleapis';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_CLIENT_PATH = path.join(PROJECT_ROOT, '.secrets/google-oauth-client.json');
const DEFAULT_TOKEN_PATH = path.join(PROJECT_ROOT, '.secrets/google-search-console-token.json');
const REDIRECT_URI = 'http://localhost:3737/callback';
const SITE_URL = 'https://riadence.com/';

function getClientCredentials(clientConfig) {
  const credentials = clientConfig.installed ?? clientConfig.web;
  if (!credentials?.client_id || !credentials?.client_secret) {
    throw new Error('OAuth client JSON is missing client_id or client_secret.');
  }
  return credentials;
}

export async function runSearchConsoleSubmit({
  clientPath = DEFAULT_CLIENT_PATH,
  tokenPath = DEFAULT_TOKEN_PATH,
  googleApi = google,
  now = Date.now,
  log = console.log,
} = {}) {
  const [clientConfig, storedTokens] = await Promise.all([
    readFile(clientPath, 'utf8').then(JSON.parse),
    readFile(tokenPath, 'utf8').then(JSON.parse),
  ]);
  const { client_id, client_secret } = getClientCredentials(clientConfig);
  const oauth2Client = new googleApi.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

  let tokens = storedTokens;
  oauth2Client.setCredentials(tokens);

  if (!tokens.expiry_date || now() >= tokens.expiry_date - 60_000) {
    const { credentials: refreshedTokens } = await oauth2Client.refreshAccessToken();
    tokens = {
      ...tokens,
      ...refreshedTokens,
      refresh_token: refreshedTokens.refresh_token ?? tokens.refresh_token,
    };
    oauth2Client.setCredentials(tokens);
    await writeFile(tokenPath, `${JSON.stringify(tokens, null, 2)}\n`, { mode: 0o600 });
  }

  const webmasters = googleApi.webmasters({ version: 'v3', auth: oauth2Client });
  const sites = await webmasters.sites.list();
  const verified = sites.data.siteEntry?.find((site) => site.siteUrl === SITE_URL);

  if (!verified) {
    throw new Error(
      'Site NOT verified. Manual verification required at '
      + 'https://search.google.com/search-console/ '
      + '(Add property → URL prefix → https://riadence.com → HTML tag or DNS)',
    );
  }
  log('Site verified ✓');

  await webmasters.sitemaps.submit({
    siteUrl: SITE_URL,
    feedpath: `${SITE_URL}sitemap.xml`,
  });
  log('Sitemap submitted ✓');
}

const isCli = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  runSearchConsoleSubmit().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
