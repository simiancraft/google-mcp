import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Mock the Gmail client so the probe exercises its code path without a network
// call. `profile` is read at call time, so each test can vary the response.
let profile: { emailAddress?: string } = {};
mock.module('@googleapis/gmail', () => ({
  gmail: () => ({ users: { getProfile: async () => ({ data: profile }) } }),
}));

const ENV = [
  'GOOGLE_MCP_DIR',
  'GOOGLE_MCP_TOKEN',
  'GOOGLE_MCP_CLIENT_SECRET',
  'GOOGLE_MCP_ACCOUNT',
] as const;
const saved: Record<string, string | undefined> = {};
let dir: string;

beforeEach(() => {
  for (const k of ENV) saved[k] = process.env[k];
  dir = mkdtempSync(path.join(os.tmpdir(), 'doctor-probe-'));
  for (const k of ENV) delete process.env[k];
  process.env['GOOGLE_MCP_DIR'] = dir;
  writeFileSync(
    path.join(dir, 'client_secret.json'),
    JSON.stringify({ installed: { client_id: 'id', client_secret: 'secret' } }),
  );
  const tokens = path.join(dir, 'tokens');
  mkdirSync(tokens, { recursive: true });
  writeFileSync(
    path.join(tokens, 'acct.json'),
    JSON.stringify({ access_token: 'a', refresh_token: 'r' }),
  );
});

afterEach(() => {
  for (const k of ENV) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  rmSync(dir, { recursive: true, force: true });
});

async function runGmailProbe(account: string): Promise<string | undefined> {
  const { SERVICES } = await import('./services.js');
  const gmail = SERVICES.find((s) => s.name === 'gmail');
  return gmail?.probe?.(account);
}

describe('gmail probe', () => {
  it('returns the profile email address', async () => {
    profile = { emailAddress: 'info@example.com' };
    expect(await runGmailProbe('acct')).toBe('info@example.com');
  });

  it('falls back to a reachable marker when no email is returned', async () => {
    profile = {};
    expect(await runGmailProbe('acct')).toBe('(reachable)');
  });
});
