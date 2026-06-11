import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  allStatuses,
  grantedScopes,
  humanizeRemaining,
  renderStatus,
  statusFor,
} from './status.js';

const ENV = [
  'GOOGLE_MCP_DIR',
  'GOOGLE_MCP_TOKEN',
  'GOOGLE_MCP_CLIENT_SECRET',
  'GOOGLE_MCP_ACCOUNT',
] as const;
const saved: Record<string, string | undefined> = {};
let dir: string;
const DAY = 24 * 3600 * 1000;

beforeEach(() => {
  for (const k of ENV) saved[k] = process.env[k];
  dir = mkdtempSync(path.join(os.tmpdir(), 'doctor-status-'));
  for (const k of ENV) delete process.env[k];
  process.env['GOOGLE_MCP_DIR'] = dir;
});

afterEach(() => {
  for (const k of ENV) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  rmSync(dir, { recursive: true, force: true });
});

function token(
  label: string,
  opts: { scope?: string; refreshExpiresIn?: number; ageMs?: number; raw?: string } = {},
): void {
  const tokens = path.join(dir, 'tokens');
  mkdirSync(tokens, { recursive: true });
  const file = path.join(tokens, `${label}.json`);
  if (opts.raw !== undefined) {
    writeFileSync(file, opts.raw);
  } else {
    const body: Record<string, unknown> = { access_token: 'a', refresh_token: 'r' };
    if (opts.scope !== undefined) body['scope'] = opts.scope;
    if (opts.refreshExpiresIn !== undefined)
      body['refresh_token_expires_in'] = opts.refreshExpiresIn;
    writeFileSync(file, JSON.stringify(body));
  }
  if (opts.ageMs !== undefined) {
    const t = (Date.now() - opts.ageMs) / 1000;
    utimesSync(file, t, t);
  }
}

describe('statusFor', () => {
  it('is missing without a token file', () => {
    expect(statusFor({ label: 'nope' }, Date.now()).state).toBe('missing');
  });

  it('is fresh well before expiry', () => {
    token('a', { ageMs: DAY });
    const s = statusFor({ label: 'a' }, Date.now());
    expect(s.state).toBe('fresh');
    expect(s.authorizedAt).toBeInstanceOf(Date);
    expect(s.expiresAt).toBeInstanceOf(Date);
  });

  it('is due-soon within 48h of expiry', () => {
    token('b', { ageMs: 6.5 * DAY });
    expect(statusFor({ label: 'b' }, Date.now()).state).toBe('due-soon');
  });

  it('is expired past 7 days', () => {
    token('c', { ageMs: 8 * DAY });
    expect(statusFor({ label: 'c' }, Date.now()).state).toBe('expired');
  });

  it('honors refresh_token_expires_in when present', () => {
    token('d', { refreshExpiresIn: 100, ageMs: 0 });
    expect(statusFor({ label: 'd' }, Date.now()).state).toBe('due-soon');
  });

  it('falls back to 7 days when the token JSON is unreadable', () => {
    token('e', { raw: 'not json', ageMs: DAY });
    expect(statusFor({ label: 'e' }, Date.now()).state).toBe('fresh');
  });
});

describe('grantedScopes', () => {
  it('splits the scope string', () => {
    token('a', { scope: 'x y z' });
    expect(grantedScopes('a')).toEqual(['x', 'y', 'z']);
  });

  it('returns [] when there is no scope', () => {
    token('b', {});
    expect(grantedScopes('b')).toEqual([]);
  });

  it('returns null when there is no token', () => {
    expect(grantedScopes('none')).toBeNull();
  });
});

describe('allStatuses', () => {
  it('maps every roster account', () => {
    writeFileSync(
      path.join(dir, 'accounts.json'),
      JSON.stringify([{ label: 'a' }, { label: 'b' }]),
    );
    token('a', { ageMs: DAY });
    const all = allStatuses(Date.now());
    expect(all.map((s) => s.account.label)).toEqual(['a', 'b']);
    expect(all.find((s) => s.account.label === 'b')?.state).toBe('missing');
  });
});

describe('humanizeRemaining', () => {
  it('formats edges and units', () => {
    expect(humanizeRemaining(undefined)).toBe('-');
    expect(humanizeRemaining(0)).toBe('expired');
    expect(humanizeRemaining(6 * DAY + 23 * 3600 * 1000)).toBe('6d 23h');
    expect(humanizeRemaining(5 * 3600 * 1000)).toBe('5h');
  });
});

describe('renderStatus', () => {
  it('reports when there are no accounts', () => {
    const log = spyOn(console, 'log').mockImplementation(() => {});
    renderStatus();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('No accounts found'));
    log.mockRestore();
  });

  it('prints a table and flags due accounts', () => {
    writeFileSync(
      path.join(dir, 'accounts.json'),
      JSON.stringify([{ label: 'fresh' }, { label: 'gone' }]),
    );
    token('fresh', { ageMs: DAY });
    const table = spyOn(console, 'table').mockImplementation(() => {});
    const log = spyOn(console, 'log').mockImplementation(() => {});
    renderStatus();
    expect(table).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('need re-auth'));
    table.mockRestore();
    log.mockRestore();
  });

  it('prints a table with no due note when all fresh', () => {
    writeFileSync(path.join(dir, 'accounts.json'), JSON.stringify([{ label: 'fresh' }]));
    token('fresh', { ageMs: DAY });
    const table = spyOn(console, 'table').mockImplementation(() => {});
    const log = spyOn(console, 'log').mockImplementation(() => {});
    renderStatus();
    expect(table).toHaveBeenCalled();
    expect(log).not.toHaveBeenCalledWith(expect.stringContaining('need re-auth'));
    table.mockRestore();
    log.mockRestore();
  });
});
