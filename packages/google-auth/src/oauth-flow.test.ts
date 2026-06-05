import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { runAuthFlow } from './oauth.js';

const ENV = ['GOOGLE_MCP_DIR', 'GOOGLE_MCP_CLIENT_SECRET', 'GOOGLE_MCP_TOKEN'] as const;
let dir: string;
const saved: Record<string, string | undefined> = {};
let errSpy: ReturnType<typeof spyOn>;

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'oauth-flow-'));
  writeFileSync(
    path.join(dir, 'client_secret.json'),
    JSON.stringify({ installed: { client_id: 'id', client_secret: 'secret' } }),
  );
  for (const k of ENV) saved[k] = process.env[k];
  process.env.GOOGLE_MCP_DIR = dir;
  process.env.GOOGLE_MCP_CLIENT_SECRET = path.join(dir, 'client_secret.json');
  process.env.GOOGLE_MCP_TOKEN = path.join(dir, 'token.json');
  errSpy = spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  for (const k of ENV) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  rmSync(dir, { recursive: true, force: true });
  errSpy.mockRestore();
});

async function hitCallback(port: number, query: string): Promise<number> {
  for (let i = 0; i < 40; i++) {
    try {
      return (await fetch(`http://localhost:${port}/oauth2callback${query}`)).status;
    } catch {
      await new Promise((r) => setTimeout(r, 25));
    }
  }
  throw new Error('callback server never came up');
}

describe('runAuthFlow', () => {
  it('exchanges the code and writes a 0600 token', async () => {
    const spy = spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
      tokens: { access_token: 'a', refresh_token: 'r' },
    } as never);
    const flow = runAuthFlow('me@example.com', { port: 31731, openBrowser: () => {} });
    const status = await hitCallback(31731, '?code=fake');
    await flow;
    expect(status).toBe(200);
    const token = JSON.parse(readFileSync(path.join(dir, 'token.json'), 'utf8'));
    expect(token.refresh_token).toBe('r');
    expect(statSync(path.join(dir, 'token.json')).mode & 0o777).toBe(0o600);
    spy.mockRestore();
  });

  it('rejects when the callback has no code', async () => {
    const flow = runAuthFlow('acct', { port: 31732, openBrowser: () => {} });
    const rejection = flow.then<Error | undefined>(
      () => undefined,
      (e) => e,
    );
    const status = await hitCallback(31732, '');
    expect(status).toBe(400);
    expect((await rejection)?.message).toMatch(/No authorization code/);
  });

  it('rejects when the token exchange fails', async () => {
    const spy = spyOn(OAuth2Client.prototype, 'getToken').mockRejectedValue(new Error('bad code'));
    const flow = runAuthFlow('acct', { port: 31733, openBrowser: () => {} });
    const rejection = flow.then<Error | undefined>(
      () => undefined,
      (e) => e,
    );
    const status = await hitCallback(31733, '?code=fake');
    expect(status).toBe(500);
    expect((await rejection)?.message).toContain('bad code');
    spy.mockRestore();
  });
});
