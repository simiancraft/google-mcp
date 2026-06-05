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
