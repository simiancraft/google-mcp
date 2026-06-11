import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Mock the Google clients so each probe exercises its code path without a
// network call. The response holders are read at call time, so each test can
// vary the response. Note: mock.module patches the module registry
// process-wide for the test run, so a future test file that value-imports
// @googleapis/{gmail,calendar,sheets} may receive these mocks depending on
// file order; keep value-level imports of those modules out of other tests.
let profile: { emailAddress?: string } = {};
mock.module('@googleapis/gmail', () => ({
  gmail: () => ({ users: { getProfile: async () => ({ data: profile }) } }),
}));

let primaryCalendar: { summary?: string; timeZone?: string } = {};
mock.module('@googleapis/calendar', () => ({
  calendar: () => ({ calendars: { get: async () => ({ data: primaryCalendar }) } }),
}));

let sampleSpreadsheet: { properties?: { title?: string } } = {};
let spreadsheetIdAsked: string | undefined;
mock.module('@googleapis/sheets', () => ({
  sheets: () => ({
    spreadsheets: {
      get: async (params: { spreadsheetId: string }) => {
        spreadsheetIdAsked = params.spreadsheetId;
        return { data: sampleSpreadsheet };
      },
    },
  }),
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

async function runProbe(service: string, account: string): Promise<string | undefined> {
  const { SERVICES } = await import('./services.js');
  const found = SERVICES.find((s) => s.name === service);
  return found?.probe?.(account);
}

describe('gmail probe', () => {
  it('returns the profile email address', async () => {
    profile = { emailAddress: 'info@example.com' };
    expect(await runProbe('gmail', 'acct')).toBe('info@example.com');
  });

  it('falls back to a reachable marker when no email is returned', async () => {
    profile = {};
    expect(await runProbe('gmail', 'acct')).toBe('(reachable)');
  });
});

describe('sheets probe', () => {
  it('returns the public sample spreadsheet title', async () => {
    sampleSpreadsheet = { properties: { title: 'Example Spreadsheet' } };
    expect(await runProbe('sheets', 'acct')).toBe('Example Spreadsheet');
    expect(spreadsheetIdAsked).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  });

  it('falls back to a reachable marker when the title is absent', async () => {
    sampleSpreadsheet = {};
    expect(await runProbe('sheets', 'acct')).toBe('(reachable)');
  });
});

describe('calendar probe', () => {
  it('returns the primary calendar summary', async () => {
    primaryCalendar = { summary: 'info@example.com', timeZone: 'America/Chicago' };
    expect(await runProbe('calendar', 'acct')).toBe('info@example.com');
  });

  it('falls back to the time zone when there is no summary', async () => {
    primaryCalendar = { timeZone: 'America/Chicago' };
    expect(await runProbe('calendar', 'acct')).toBe('America/Chicago');
  });

  it('falls back to a reachable marker when the calendar is bare', async () => {
    primaryCalendar = {};
    expect(await runProbe('calendar', 'acct')).toBe('(reachable)');
  });
});
