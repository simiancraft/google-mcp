import { afterEach, describe, expect, it } from 'bun:test';
import { resolveAccount, tokenPath } from './config.js';

const original = process.env.GOOGLE_MCP_ACCOUNT;
const originalToken = process.env.GOOGLE_MCP_TOKEN;

afterEach(() => {
  if (original === undefined) delete process.env.GOOGLE_MCP_ACCOUNT;
  else process.env.GOOGLE_MCP_ACCOUNT = original;
  if (originalToken === undefined) delete process.env.GOOGLE_MCP_TOKEN;
  else process.env.GOOGLE_MCP_TOKEN = originalToken;
});

describe('resolveAccount', () => {
  it('returns the explicit account', () => {
    expect(resolveAccount('alice')).toBe('alice');
  });

  it('falls back to GOOGLE_MCP_ACCOUNT', () => {
    process.env.GOOGLE_MCP_ACCOUNT = 'bob';
    expect(resolveAccount()).toBe('bob');
  });

  it('throws when no account is available', () => {
    delete process.env.GOOGLE_MCP_ACCOUNT;
    expect(() => resolveAccount()).toThrow(/No account/);
  });

  it('rejects path-traversal and separator characters', () => {
    expect(() => resolveAccount('../../etc/passwd')).toThrow(/Invalid account/);
    expect(() => resolveAccount('a/b')).toThrow(/Invalid account/);
    expect(() => resolveAccount('..')).toThrow(/Invalid account/);
  });

  it('accepts emails and simple slugs', () => {
    expect(resolveAccount('me@example.com')).toBe('me@example.com');
    expect(resolveAccount('simiancraft')).toBe('simiancraft');
  });
});

describe('tokenPath', () => {
  it('honors the GOOGLE_MCP_TOKEN override', () => {
    process.env.GOOGLE_MCP_TOKEN = '/tmp/explicit.json';
    expect(tokenPath('anyone')).toBe('/tmp/explicit.json');
  });

  it('derives a per-account path by default', () => {
    delete process.env.GOOGLE_MCP_TOKEN;
    expect(tokenPath('carol')).toMatch(/tokens\/carol\.json$/);
  });
});
