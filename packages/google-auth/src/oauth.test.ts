import { afterAll, beforeAll, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { authorizedClient } from './oauth.js';

let dir: string;

beforeAll(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'google-auth-'));
  writeFileSync(
    path.join(dir, 'client_secret.json'),
    JSON.stringify({ installed: { client_id: 'test-id', client_secret: 'test-secret' } }),
  );
  writeFileSync(
    path.join(dir, 'token.json'),
    JSON.stringify({ access_token: 'access', refresh_token: 'refresh' }),
  );
  process.env.GOOGLE_MCP_CLIENT_SECRET = path.join(dir, 'client_secret.json');
  process.env.GOOGLE_MCP_TOKEN = path.join(dir, 'token.json');
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

it('resolves an authorized client from a stored token', async () => {
  const client = await authorizedClient('test');
  expect(client.credentials.access_token).toBe('access');
  expect(client.credentials.refresh_token).toBe('refresh');
});
