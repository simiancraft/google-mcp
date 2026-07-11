import { afterEach, beforeEach, expect, it, spyOn } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { completeAuth, redirectUri, startAuth } from './oauth.js';
import { clientSecretPath } from './paths.js';

const ENV = ['GOOGLE_MCP_DIR', 'GOOGLE_MCP_CLIENT_SECRET', 'GOOGLE_MCP_TOKEN'] as const;
const EXTRA = ['OAUTH_REDIRECT_BASE', 'PORT'] as const;
const saved: Record<string, string | undefined> = {};
let dir: string;

function writeClientSecret() {
  writeFileSync(
    clientSecretPath(),
    JSON.stringify({ installed: { client_id: 'id', client_secret: 'secret' } }),
  );
}

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'serve-oauth-'));
  for (const k of [...ENV, ...EXTRA]) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  process.env['GOOGLE_MCP_DIR'] = dir;
  writeClientSecret();
});

afterEach(() => {
  for (const k of [...ENV, ...EXTRA]) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  rmSync(dir, { recursive: true, force: true });
});

it('redirectUri defaults to loopback on PORT and appends the callback path', () => {
  expect(redirectUri()).toBe('http://localhost:3000/admin/oauth/callback');
  process.env['PORT'] = '8080';
  expect(redirectUri()).toBe('http://localhost:8080/admin/oauth/callback');
});

it('redirectUri honors OAUTH_REDIRECT_BASE and trims trailing slashes', () => {
  process.env['OAUTH_REDIRECT_BASE'] = 'https://mcp.example.com///';
  expect(redirectUri()).toBe('https://mcp.example.com/admin/oauth/callback');
});

it('startAuth refuses when no client secret has been uploaded', async () => {
  rmSync(clientSecretPath(), { force: true });
  await expect(startAuth('you@example.com')).rejects.toThrow(/upload the OAuth client first/);
});

it('startAuth builds an offline consent URL with PKCE, scopes, and a login hint', async () => {
  const { authUrl, state } = await startAuth('you@example.com');
  const u = new URL(authUrl);
  expect(u.searchParams.get('access_type')).toBe('offline');
  expect(u.searchParams.get('prompt')).toBe('consent');
  expect(u.searchParams.get('code_challenge_method')).toBe('S256');
  expect(u.searchParams.get('code_challenge')).toBeTruthy();
  expect(u.searchParams.get('state')).toBe(state);
  expect(u.searchParams.get('login_hint')).toBe('you@example.com');
  expect(u.searchParams.get('scope')).toContain('https://mail.google.com/');
});

it('startAuth omits the login hint for a bare (non-email) label', async () => {
  const { authUrl } = await startAuth('personal');
  expect(new URL(authUrl).searchParams.get('login_hint')).toBeNull();
});

it('startAuth fails when PKCE challenge generation yields nothing', async () => {
  const spy = spyOn(OAuth2Client.prototype, 'generateCodeVerifierAsync').mockResolvedValue({
    codeVerifier: 'v',
    codeChallenge: undefined,
  } as never);
  await expect(startAuth('you@example.com')).rejects.toThrow(/PKCE challenge/);
  spy.mockRestore();
});

it('completeAuth rejects an unknown/expired state', async () => {
  await expect(completeAuth('nope', 'code')).rejects.toThrow(/Unknown or expired/);
});

it('completeAuth exchanges the code and writes a 0600 token identical to the suite', async () => {
  const spy = spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
    tokens: { access_token: 'a', refresh_token: 'r', expiry_date: 4102444800000 },
  } as never);
  const { state } = await startAuth('you@example.com');
  const account = await completeAuth(state, 'auth-code');
  expect(account).toBe('you@example.com');

  const file = path.join(dir, 'tokens', 'you@example.com.json');
  expect(JSON.parse(readFileSync(file, 'utf8')).refresh_token).toBe('r');
  expect(statSync(file).mode & 0o777).toBe(0o600);
  // The pending entry is single-use: a replay fails.
  await expect(completeAuth(state, 'auth-code')).rejects.toThrow(/Unknown or expired/);
  spy.mockRestore();
});

it('completeAuth surfaces a client secret that vanished after start', async () => {
  const { state } = await startAuth('you@example.com');
  rmSync(clientSecretPath(), { force: true });
  await expect(completeAuth(state, 'auth-code')).rejects.toThrow(/client_secret\.json is missing/);
});

it('sweeps pending authorizations older than the TTL', async () => {
  // Register a pending entry stamped ~11 minutes in the past.
  const past = Date.now() - 11 * 60 * 1000;
  const nowSpy = spyOn(Date, 'now').mockReturnValue(past);
  const { state } = await startAuth('stale@example.com');
  nowSpy.mockRestore();

  // A fresh startAuth runs the sweep at the real time, evicting the stale entry.
  await startAuth('fresh@example.com');
  await expect(completeAuth(state, 'auth-code')).rejects.toThrow(/Unknown or expired/);
});
