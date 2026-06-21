import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { google } from 'googleapis';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_CLIENT_PATH = path.join(PROJECT_ROOT, '.secrets/google-oauth-client.json');
const DEFAULT_TOKEN_PATH = path.join(PROJECT_ROOT, '.secrets/google-search-console-token.json');
const REDIRECT_URI = 'http://localhost:3737/callback';
const SCOPES = ['https://www.googleapis.com/auth/webmasters'];

function getClientCredentials(clientConfig) {
  const credentials = clientConfig.installed ?? clientConfig.web;
  if (!credentials?.client_id || !credentials?.client_secret) {
    throw new Error('OAuth client JSON is missing client_id or client_secret.');
  }
  return credentials;
}

async function defaultPromptForCode() {
  const readline = createInterface({ input, output });
  try {
    return (await readline.question('Authorization code: ')).trim();
  } finally {
    readline.close();
  }
}

export async function runOAuthSetup({
  clientPath = DEFAULT_CLIENT_PATH,
  tokenPath = DEFAULT_TOKEN_PATH,
  promptForCode = defaultPromptForCode,
  log = console.log,
  googleApi = google,
} = {}) {
  const clientConfig = JSON.parse(await readFile(clientPath, 'utf8'));
  const { client_id, client_secret } = getClientCredentials(clientConfig);
  const oauth2Client = new googleApi.auth.OAuth2(client_id, client_secret, REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  log(`[1] Otvor túto URL v browseri:\n${authUrl}`);
  log('[2] Prihlás sa ako fabian.sarkozi@gmail.com');
  log('[3] Klikni Allow');
  log('[4] Google redirectne na http://localhost:3737/callback?code=XXXX');
  log('[5] Skopíruj code z URL a vlož ho sem');

  const code = await promptForCode();
  if (!code) {
    throw new Error('Authorization code is required.');
  }

  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error('OAuth response did not include a refresh token.');
  }

  await writeFile(tokenPath, `${JSON.stringify(tokens, null, 2)}\n`, { mode: 0o600 });

  oauth2Client.setCredentials(tokens);
  await oauth2Client.refreshAccessToken();

  log('OAuth setup complete. Token saved.');
  return { authUrl, tokens };
}

const isCli = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  runOAuthSetup().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
