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
  process.env['GOOGLE_MCP_CLIENT_SECRET'] = path.join(dir, 'client_secret.json');
  process.env['GOOGLE_MCP_TOKEN'] = path.join(dir, 'token.json');
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

it('resolves an authorized client from a stored token', async () => {
  const client = await authorizedClient('test');
  expect(client.credentials.access_token).toBe('access');
  expect(client.credentials.refresh_token).toBe('refresh');
});

it('throws on an invalid client secret file', async () => {
  const badDir = mkdtempSync(path.join(os.tmpdir(), 'google-auth-bad-'));
  const saved = process.env['GOOGLE_MCP_CLIENT_SECRET'];
  process.env['GOOGLE_MCP_CLIENT_SECRET'] = path.join(badDir, 'client_secret.json');
  // Keys absent entirely: passes the file schema, fails the presence check.
  writeFileSync(path.join(badDir, 'client_secret.json'), JSON.stringify({ nonsense: true }));
  await expect(authorizedClient('test')).rejects.toThrow(/Invalid OAuth client secret/);
  // Shape violation: the zod failure carries the same message.
  writeFileSync(path.join(badDir, 'client_secret.json'), JSON.stringify({ installed: 'nope' }));
  await expect(authorizedClient('test')).rejects.toThrow(/Invalid OAuth client secret/);
  // Broken JSON is not a shape problem; it surfaces untranslated.
  writeFileSync(path.join(badDir, 'client_secret.json'), '{not json');
  await expect(authorizedClient('test')).rejects.toThrow(SyntaxError);
  process.env['GOOGLE_MCP_CLIENT_SECRET'] = saved;
  rmSync(badDir, { recursive: true, force: true });
});
