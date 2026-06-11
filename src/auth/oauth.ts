import { randomBytes } from 'node:crypto';
import { chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { CodeChallengeMethod, type Credentials, OAuth2Client } from 'google-auth-library';
import open from 'open';
import { loadConfig, resolveAccount, SCOPES, tokenPath } from './config.js';

// The loopback IP literal, not `localhost` (RFC 8252 section 8.3, and Google's
// loopback guidance): name resolution is host-file-manipulable and can point
// `localhost` at ::1 where nothing listens.
const redirectUri = (port: number) => `http://127.0.0.1:${port}/oauth2callback`;

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
  const token: Credentials = JSON.parse(
    readFileSync(tokenPath(resolveAccount(account, config), config), 'utf8'),
  );
  client.setCredentials(token);
  return client;
}

/**
 * Run the browser consent flow for `account` and persist its token. The token
 * file is written 0600 inside a 0700 tokens dir; the consent requests offline
 * access and forces the screen so a refresh token is always returned. The flow
 * carries a random `state` (verified at the callback: any browser tab can fire
 * requests at the loopback port, since CORS blocks reads, not sends, so only
 * the redirect Google issued for this flow is accepted) and PKCE (RFC 8252
 * section 8.1: a local process that wins a race for the port cannot exchange
 * an intercepted code without the verifier). `port`, `openBrowser`, and
 * `timeoutMs` are injectable for testing; the callback server is closed on
 * every exit path, including an abandoned consent. `loginHint` prefills the
 * Google account chooser when the account label is not itself an email
 * (e.g. a short alias like `personal`).
 */
export async function runAuthFlow(
  account?: string,
  options: {
    port?: number;
    openBrowser?: (url: string) => unknown;
    loginHint?: string;
    timeoutMs?: number;
  } = {},
): Promise<void> {
  const port = options.port ?? 3000;
  const openBrowser = options.openBrowser ?? open;
  const timeoutMs = options.timeoutMs ?? 5 * 60 * 1000;
  const config = loadConfig();
  const acct = resolveAccount(account, config);
  const client = newClient(port);
  const loginHint = options.loginHint ?? (acct.includes('@') ? acct : undefined);
  const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
  if (!codeChallenge) {
    throw new Error('PKCE challenge generation failed; cannot start the consent flow.');
  }
  const state = randomBytes(16).toString('hex');
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
    code_challenge_method: CodeChallengeMethod.S256,
    code_challenge: codeChallenge,
    ...(loginHint ? { login_hint: loginHint } : {}),
  });

  await new Promise<void>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      // Absolute-form request targets reach req.url verbatim, and an
      // unparseable one (proxy-style "GET http:// HTTP/1.1") would throw in
      // the URL constructor; answer 400 rather than crash the flow on an
      // unhandled rejection.
      let requested: URL;
      try {
        requested = new URL(req.url ?? '/', redirectUri(port));
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      if (requested.pathname !== '/oauth2callback') {
        // Browsers probe for favicons; answer rather than leave sockets hanging.
        res.writeHead(404);
        res.end();
        return;
      }
      const finish = (status: number, body: string, err?: unknown) => {
        res.writeHead(status);
        res.end(body);
        clearTimeout(timer);
        server.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };
      const params = requested.searchParams;
      if (params.get('state') !== state) {
        finish(403, 'State mismatch.', new Error('OAuth state mismatch; possible CSRF.'));
        return;
      }
      const code = params.get('code');
      if (!code) {
        finish(
          400,
          'No authorization code provided.',
          new Error('No authorization code provided.'),
        );
        return;
      }
      try {
        const { tokens } = await client.getToken({ code, codeVerifier });
        mkdirSync(config.tokensDir, { recursive: true, mode: 0o700 });
        // mkdir's mode applies only on create; tighten a pre-existing dir so
        // token filenames (account labels) stay unreadable to other users.
        chmodSync(config.tokensDir, 0o700);
        const file = tokenPath(acct, config);
        // Recreate rather than overwrite: writeFileSync applies mode only on
        // create, and tightening afterwards would leave fresh token bytes
        // briefly readable through a pre-existing looser mode.
        rmSync(file, { force: true });
        writeFileSync(file, JSON.stringify(tokens), { mode: 0o600 });
        finish(200, `Authorized ${acct}. You can close this window.`);
      } catch (error) {
        finish(500, 'Authentication failed.', error);
      }
    });
    const timer = setTimeout(() => {
      server.close();
      reject(new Error(`Authorization timed out after ${timeoutMs}ms; rerun doctor auth.`));
    }, timeoutMs);
    server.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    // Loopback only (RFC 8252 section 8.3): with no host, Node binds every
    // interface and the consent port is briefly LAN-reachable.
    server.listen(port, '127.0.0.1');
    console.error(`Visit this URL to authorize ${acct}:\n${authUrl}`);
    void openBrowser(authUrl);
  });
}
