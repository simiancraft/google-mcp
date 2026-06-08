import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { OAuth2Client } from 'google-auth-library';
import open from 'open';
import { loadConfig, resolveAccount, SCOPES, tokenPath } from './config.js';

const redirectUri = (port: number) => `http://localhost:${port}/oauth2callback`;

type ClientSecret = { client_id: string; client_secret: string };

function loadClientSecret(): ClientSecret {
  const secretPath = loadConfig().clientSecretPath;
  const raw = JSON.parse(readFileSync(secretPath, 'utf8')) as {
    installed?: ClientSecret;
    web?: ClientSecret;
  };
  const keys = raw.installed ?? raw.web;
  if (!keys?.client_id || !keys.client_secret) {
    throw new Error(
      `Invalid OAuth client secret at ${secretPath} (expected "installed" or "web").`,
    );
  }
  return { client_id: keys.client_id, client_secret: keys.client_secret };
}

function newClient(port = 3000): OAuth2Client {
  const { client_id, client_secret } = loadClientSecret();
  return new OAuth2Client(client_id, client_secret, redirectUri(port));
}

/**
 * Build an authenticated client for `account` (default: GOOGLE_MCP_ACCOUNT) from
 * its stored token. The library auto-refreshes the access token from the refresh
 * token as needed.
 */
export async function authorizedClient(account?: string): Promise<OAuth2Client> {
  const client = newClient();
  const config = loadConfig();
  const token = JSON.parse(
    readFileSync(tokenPath(resolveAccount(account, config), config), 'utf8'),
  );
  client.setCredentials(token);
  return client;
}

/**
 * Run the browser consent flow for `account` and persist its token. The token
 * file is written 0600 inside a 0700 tokens dir; the consent requests offline
 * access and forces the screen so a refresh token is always returned. `port` and
 * `openBrowser` are injectable for testing; the callback server is closed on
 * every exit path. `loginHint` prefills the Google account chooser when the
 * account label is not itself an email (e.g. a short alias like `personal`).
 */
export async function runAuthFlow(
  account?: string,
  options: {
    port?: number;
    openBrowser?: (url: string) => unknown;
    loginHint?: string;
  } = {},
): Promise<void> {
  const port = options.port ?? 3000;
  const openBrowser = options.openBrowser ?? open;
  const config = loadConfig();
  const acct = resolveAccount(account, config);
  const client = newClient(port);
  const loginHint = options.loginHint ?? (acct.includes('@') ? acct : undefined);
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    ...(loginHint ? { login_hint: loginHint } : {}),
  });

  await new Promise<void>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith('/oauth2callback')) return;
      const finish = (status: number, body: string, err?: unknown) => {
        res.writeHead(status);
        res.end(body);
        server.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };
      const code = new URL(req.url, redirectUri(port)).searchParams.get('code');
      if (!code) {
        finish(
          400,
          'No authorization code provided.',
          new Error('No authorization code provided.'),
        );
        return;
      }
      try {
        const { tokens } = await client.getToken(code);
        mkdirSync(config.tokensDir, { recursive: true, mode: 0o700 });
        const file = tokenPath(acct, config);
        writeFileSync(file, JSON.stringify(tokens), { mode: 0o600 });
        // mode on writeFileSync only applies when creating the file; tighten an
        // existing (possibly looser) token file explicitly.
        chmodSync(file, 0o600);
        finish(200, `Authorized ${acct}. You can close this window.`);
      } catch (error) {
        finish(500, 'Authentication failed.', error);
      }
    });
    server.listen(port);
    console.error(`Visit this URL to authorize ${acct}:\n${authUrl}`);
    void openBrowser(authUrl);
  });
}
