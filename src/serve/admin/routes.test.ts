import { afterAll, afterEach, beforeAll, beforeEach, expect, it, spyOn } from 'bun:test';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { buildApp } from '../http.js';

const ENV = ['GOOGLE_MCP_DIR', 'GOOGLE_MCP_CLIENT_SECRET', 'GOOGLE_MCP_TOKEN'] as const;
const ADMIN = ['ADMIN_PASSWORD', 'ADMIN_USER', 'AUTH_TOKEN', 'OAUTH_REDIRECT_BASE'] as const;
const saved: Record<string, string | undefined> = {};

const PASSWORD = 'letmein';
const BASIC = `Basic ${Buffer.from(`admin:${PASSWORD}`).toString('base64')}`;

let server: Server;
let base: string;
let dir: string;

beforeAll(async () => {
  for (const k of [...ENV, ...ADMIN]) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  server = buildApp().listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  for (const k of [...ENV, ...ADMIN]) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'serve-routes-'));
  process.env['GOOGLE_MCP_DIR'] = dir;
  process.env['ADMIN_PASSWORD'] = PASSWORD;
  delete process.env['ADMIN_USER'];
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

/** Fetch with the admin Basic-auth header attached. */
function admin(pathname: string, init: RequestInit = {}) {
  return fetch(`${base}${pathname}`, {
    ...init,
    headers: { authorization: BASIC, ...(init.headers ?? {}) },
  });
}

function postJson(pathname: string, body: unknown, init: RequestInit = {}) {
  return admin(pathname, {
    method: 'POST',
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
    body: JSON.stringify(body),
  });
}

const CLIENT_SECRET = { installed: { client_id: 'id', client_secret: 'secret' } };
const writeClientSecret = () =>
  writeFileSync(path.join(dir, 'client_secret.json'), JSON.stringify(CLIENT_SECRET));

it('returns 503 for every /admin route when ADMIN_PASSWORD is unset', async () => {
  delete process.env['ADMIN_PASSWORD'];
  const res = await fetch(`${base}/admin`);
  expect(res.status).toBe(503);
  expect(await res.text()).toMatch(/disabled/);
});

it('challenges with 401 when the Basic credentials are missing or wrong', async () => {
  const noHeader = await fetch(`${base}/admin`);
  expect(noHeader.status).toBe(401);
  expect(noHeader.headers.get('www-authenticate')).toMatch(/Basic/);

  const wrong = await fetch(`${base}/admin`, {
    headers: { authorization: `Basic ${Buffer.from('admin:nope').toString('base64')}` },
  });
  expect(wrong.status).toBe(401);
});

it('honors a custom ADMIN_USER', async () => {
  process.env['ADMIN_USER'] = 'ops';
  const header = `Basic ${Buffer.from(`ops:${PASSWORD}`).toString('base64')}`;
  const ok = await fetch(`${base}/admin`, { headers: { authorization: header } });
  expect(ok.status).toBe(200);
  // The default 'admin' user is no longer accepted.
  const denied = await admin('/admin');
  expect(denied.status).toBe(401);
});

it('serves the credential UI HTML', async () => {
  const res = await admin('/admin');
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toMatch(/html/);
  expect(await res.text()).toContain('google-mcp-suite — credentials');
});

it('reports state: no client secret and no accounts before setup', async () => {
  const res = await admin('/admin/api/state');
  const state = (await res.json()) as {
    clientSecret: boolean;
    accounts: unknown[];
    scopes: string[];
    dir: string;
    redirectUri: string;
  };
  expect(state.clientSecret).toBe(false);
  expect(state.accounts).toEqual([]);
  expect(state.scopes.length).toBeGreaterThan(0);
  expect(state.dir).toBe(dir);
  expect(state.redirectUri).toMatch(/\/admin\/oauth\/callback$/);
});

it('saves an uploaded client secret and reflects it in state', async () => {
  const save = await postJson('/admin/api/client-secret', { content: CLIENT_SECRET });
  expect(save.status).toBe(200);
  expect(await save.json()).toEqual({ ok: true });

  const state = (await (await admin('/admin/api/state')).json()) as { clientSecret: boolean };
  expect(state.clientSecret).toBe(true);
});

it('rejects a malformed client secret with 400', async () => {
  const res = await postJson('/admin/api/client-secret', { content: { nonsense: true } });
  expect(res.status).toBe(400);
  expect(((await res.json()) as { error: string }).error).toMatch(/Invalid client secret/);
});

it('rejects an invalid account label on auth start (400)', async () => {
  const res = await postJson('/admin/api/auth/start', { account: 'a b,c' });
  expect(res.status).toBe(400);
  expect(((await res.json()) as { error: string }).error).toMatch(/Invalid account label/);
});

it('surfaces the "upload the client first" error from auth start (400)', async () => {
  const res = await postJson('/admin/api/auth/start', { account: 'you@example.com' });
  expect(res.status).toBe(400);
  expect(((await res.json()) as { error: string }).error).toMatch(/upload the OAuth client/);
});

it('returns a consent URL from auth start once the client secret exists', async () => {
  writeClientSecret();
  const res = await postJson('/admin/api/auth/start', { account: 'you@example.com' });
  expect(res.status).toBe(200);
  const { authUrl } = (await res.json()) as { authUrl: string };
  expect(authUrl).toContain('accounts.google.com');
  expect(new URL(authUrl).searchParams.get('state')).toBeTruthy();
});

it('completes authorization from a pasted redirect URL', async () => {
  writeClientSecret();
  const spy = spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
    tokens: { access_token: 'a', refresh_token: 'r' },
  } as never);

  const start = await postJson('/admin/api/auth/start', { account: 'you@example.com' });
  const { authUrl } = (await start.json()) as { authUrl: string };
  const state = new URL(authUrl).searchParams.get('state');
  const pasted = `http://localhost:3000/admin/oauth/callback?state=${state}&code=the-code`;

  const done = await postJson('/admin/api/auth/complete', { url: pasted });
  expect(done.status).toBe(200);
  expect(await done.json()).toEqual({ ok: true, account: 'you@example.com' });
  expect(existsSync(path.join(dir, 'tokens', 'you@example.com.json'))).toBe(true);
  spy.mockRestore();
});

it('rejects a complete request with neither url nor state/code (400)', async () => {
  const res = await postJson('/admin/api/auth/complete', {});
  expect(res.status).toBe(400);
  expect(((await res.json()) as { error: string }).error).toMatch(/Could not find state\/code/);
});

it('auto-completes via the browser callback redirect', async () => {
  writeClientSecret();
  const spy = spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
    tokens: { access_token: 'a', refresh_token: 'r' },
  } as never);

  const start = await postJson('/admin/api/auth/start', { account: 'her@example.com' });
  const { authUrl } = (await start.json()) as { authUrl: string };
  const state = new URL(authUrl).searchParams.get('state');

  const cb = await admin(`/admin/oauth/callback?state=${state}&code=xyz`);
  expect(cb.status).toBe(200);
  const html = await cb.text();
  expect(html).toContain('Authorized');
  expect(html).toContain('her@example.com');
  expect(existsSync(path.join(dir, 'tokens', 'her@example.com.json'))).toBe(true);
  spy.mockRestore();
});

it('renders the denied page when the callback carries an OAuth error', async () => {
  const cb = await admin('/admin/oauth/callback?error=access_denied');
  expect(cb.status).toBe(400);
  expect(await cb.text()).toContain('Authorization denied: access_denied');
});

it('renders a failure page when the callback state is unknown', async () => {
  const cb = await admin('/admin/oauth/callback?state=bogus&code=xyz');
  expect(cb.status).toBe(400);
  expect(await cb.text()).toContain('Unknown or expired');
});

it('deletes an account token and validates the label', async () => {
  writeClientSecret();
  const tokens = path.join(dir, 'tokens');
  rmSync(tokens, { recursive: true, force: true });
  writeFileSync(path.join(dir, 'client_secret.json'), JSON.stringify(CLIENT_SECRET));
  // Create a token to delete.
  const spy = spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
    tokens: { access_token: 'a', refresh_token: 'r' },
  } as never);
  const start = await postJson('/admin/api/auth/start', { account: 'gone@example.com' });
  const { authUrl } = (await start.json()) as { authUrl: string };
  const state = new URL(authUrl).searchParams.get('state');
  await admin(`/admin/oauth/callback?state=${state}&code=xyz`);
  spy.mockRestore();
  expect(existsSync(path.join(dir, 'tokens', 'gone@example.com.json'))).toBe(true);

  const bad = await admin('/admin/api/accounts/..%2Fescape', { method: 'DELETE' });
  expect(bad.status).toBe(400);

  const ok = await admin('/admin/api/accounts/gone@example.com', { method: 'DELETE' });
  expect(ok.status).toBe(200);
  expect(existsSync(path.join(dir, 'tokens', 'gone@example.com.json'))).toBe(false);
});
