import { afterEach, beforeEach, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { accountAuthorized, authorizedAccounts, listAccounts } from './accounts.js';
import { loadClientKeys, saveClientSecret } from './clientSecret.js';

let dir: string;
// Isolate from any credential-path overrides another test file may have set in
// this shared process: the admin resolves paths under GOOGLE_MCP_DIR only when
// the single-file overrides are absent.
const OVERRIDES = ['GOOGLE_MCP_DIR', 'GOOGLE_MCP_CLIENT_SECRET', 'GOOGLE_MCP_TOKEN'] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'google-mcp-serve-'));
  for (const key of OVERRIDES) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  process.env['GOOGLE_MCP_DIR'] = dir;
});

afterEach(() => {
  for (const key of OVERRIDES) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  rmSync(dir, { recursive: true, force: true });
});

function writeToken(account: string, token: object) {
  const tokens = path.join(dir, 'tokens');
  mkdirSync(tokens, { recursive: true });
  writeFileSync(path.join(tokens, `${account}.json`), JSON.stringify(token));
}

it('lists no accounts when the tokens dir is absent', () => {
  expect(listAccounts()).toEqual([]);
  expect(authorizedAccounts()).toEqual([]);
});

it('summarizes each authorized account from its token file', () => {
  writeToken('you@example.com', {
    scope: 'https://mail.google.com/ https://www.googleapis.com/auth/drive',
    expiry_date: 4102444800000, // year 2100
    refresh_token: 'refresh',
  });
  writeToken('alias', { access_token: 'a' }); // no scope/refresh

  const accounts = listAccounts();
  expect(accounts.map((a) => a.account)).toEqual(['alias', 'you@example.com']); // sorted
  const primary = accounts.find((a) => a.account === 'you@example.com');
  expect(primary).toMatchObject({ scopes: 2, expiry: 4102444800000, hasRefresh: true });
  const alias = accounts.find((a) => a.account === 'alias');
  expect(alias).toMatchObject({ scopes: 0, expiry: null, hasRefresh: false });
});

it('authorizedAccounts lists the labels of every stored token', () => {
  writeToken('you@example.com', { refresh_token: 'r' });
  writeToken('work', { refresh_token: 'r' });
  expect(authorizedAccounts()).toEqual(['work', 'you@example.com']); // sorted
});

it('lists an unparseable token file without throwing', () => {
  const tokens = path.join(dir, 'tokens');
  mkdirSync(tokens, { recursive: true });
  writeFileSync(path.join(tokens, 'broken.json'), '{not json');
  const accounts = listAccounts();
  expect(accounts).toEqual([{ account: 'broken', scopes: 0, expiry: null, hasRefresh: false }]);
});

it('accountAuthorized reflects a stored token and rejects unsafe labels', () => {
  writeToken('you@example.com', { refresh_token: 'r' });
  expect(accountAuthorized('you@example.com')).toBe(true);
  expect(accountAuthorized('nobody@example.com')).toBe(false);
  expect(accountAuthorized('../escape')).toBe(false);
});

it('saveClientSecret persists an installed/web client and loadClientKeys reads it back', () => {
  expect(loadClientKeys()).toBeUndefined();
  saveClientSecret({ installed: { client_id: 'id', client_secret: 'secret' } });
  expect(loadClientKeys()).toEqual({ client_id: 'id', client_secret: 'secret' });

  // Accepts the JSON-string form too (the upload arrives as text).
  saveClientSecret(JSON.stringify({ web: { client_id: 'wid', client_secret: 'wsecret' } }));
  expect(loadClientKeys()).toEqual({ client_id: 'wid', client_secret: 'wsecret' });
});

it('saveClientSecret rejects a malformed client secret', () => {
  expect(() => saveClientSecret({ nonsense: true })).toThrow(/Invalid client secret/);
  expect(() => saveClientSecret({ installed: { client_id: 'id' } })).toThrow(
    /Invalid client secret/,
  );
});

it('loadClientKeys returns undefined for an unparseable or shapeless secret file', () => {
  const p = path.join(dir, 'client_secret.json');
  writeFileSync(p, '{not json'); // JSON.parse throws -> caught -> undefined
  expect(loadClientKeys()).toBeUndefined();
  writeFileSync(p, JSON.stringify({ installed: { client_id: 'id' } })); // valid JSON, missing secret
  expect(loadClientKeys()).toBeUndefined();
});
