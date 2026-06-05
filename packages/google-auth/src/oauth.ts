import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { OAuth2Client } from 'google-auth-library';
import open from 'open';
import { clientSecretPath, resolveAccount, SCOPES, tokenPath, tokensDir } from './config.js';

const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

type ClientSecret = { client_id: string; client_secret: string };

function loadClientSecret(): ClientSecret {
  const path = clientSecretPath();
  const raw = JSON.parse(readFileSync(path, 'utf8')) as {
    installed?: ClientSecret;
    web?: ClientSecret;
  };
  const keys = raw.installed ?? raw.web;
  if (!keys?.client_id || !keys.client_secret) {
    throw new Error(`Invalid OAuth client secret at ${path} (expected "installed" or "web").`);
  }
  return { client_id: keys.client_id, client_secret: keys.client_secret };
}

function newClient(): OAuth2Client {
  const { client_id, client_secret } = loadClientSecret();
  return new OAuth2Client(client_id, client_secret, REDIRECT_URI);
}

/**
 * Build an authenticated client for `account` (default: GOOGLE_MCP_ACCOUNT) from
 * its stored token. The library auto-refreshes the access token from the refresh
 * token as needed.
 */
export async function authorizedClient(account?: string): Promise<OAuth2Client> {
  const client = newClient();
  const token = JSON.parse(readFileSync(tokenPath(resolveAccount(account)), 'utf8'));
  client.setCredentials(token);
  return client;
}

/**
 * Run the browser consent flow for `account` and persist its token. The token
 * file is written 0600 inside a 0700 tokens dir; the consent requests offline
 * access and forces the screen so a refresh token is always returned.
 *
 * Not unit-tested: it opens a browser and runs a local OAuth callback server.
 * Covered by live verification; its sibling `authorizedClient` is unit-tested.
 */
export async function runAuthFlow(account?: string): Promise<void> {
  const acct = resolveAccount(account);
  const client = newClient();
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    login_hint: acct.includes('@') ? acct : undefined,
  });

  await new Promise<void>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith('/oauth2callback')) return;
      const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
      if (!code) {
        res.writeHead(400);
        res.end('No authorization code provided.');
        reject(new Error('No authorization code provided.'));
        return;
      }
      try {
        const { tokens } = await client.getToken(code);
        mkdirSync(tokensDir(), { recursive: true, mode: 0o700 });
        writeFileSync(tokenPath(acct), JSON.stringify(tokens), { mode: 0o600 });
        res.writeHead(200);
        res.end(`Authorized ${acct}. You can close this window.`);
        server.close();
        resolve();
      } catch (error) {
        res.writeHead(500);
        res.end('Authentication failed.');
        reject(error);
      }
    });
    server.listen(3000);
    console.error(`Visit this URL to authorize ${acct}:\n${authUrl}`);
    void open(authUrl);
  });
}
