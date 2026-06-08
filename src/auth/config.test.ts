import { afterEach, describe, expect, it } from 'bun:test';
import { loadConfig, resolveAccount, tokenPath } from './config.js';

const original = process.env['GOOGLE_MCP_ACCOUNT'];
const originalToken = process.env['GOOGLE_MCP_TOKEN'];

afterEach(() => {
  if (original === undefined) delete process.env['GOOGLE_MCP_ACCOUNT'];
  else process.env['GOOGLE_MCP_ACCOUNT'] = original;
  if (originalToken === undefined) delete process.env['GOOGLE_MCP_TOKEN'];
  else process.env['GOOGLE_MCP_TOKEN'] = originalToken;
});

describe('loadConfig', () => {
  it('defaults the dir and derives paths under it', () => {
    const c = loadConfig({} as NodeJS.ProcessEnv);
    expect(c.dir).toMatch(/\.google-mcp$/);
    expect(c.tokensDir).toMatch(/\.google-mcp\/tokens$/);
    expect(c.clientSecretPath).toMatch(/\.google-mcp\/client_secret\.json$/);
    expect(c.tokenOverride).toBeUndefined();
    expect(c.account).toBeUndefined();
  });

  it('honors a dir override and threads it through derived paths', () => {
    const c = loadConfig({ GOOGLE_MCP_DIR: '/srv/cfg' } as NodeJS.ProcessEnv);
    expect(c.dir).toBe('/srv/cfg');
    expect(c.tokensDir).toBe('/srv/cfg/tokens');
    expect(c.clientSecretPath).toBe('/srv/cfg/client_secret.json');
  });

  it('treats empty/whitespace values as unset', () => {
    const c = loadConfig({ GOOGLE_MCP_DIR: '   ', GOOGLE_MCP_TOKEN: '' } as NodeJS.ProcessEnv);
    expect(c.dir).toMatch(/\.google-mcp$/);
    expect(c.tokenOverride).toBeUndefined();
  });

  it('surfaces the token override and account when set', () => {
    const c = loadConfig({
      GOOGLE_MCP_TOKEN: '/tmp/t.json',
      GOOGLE_MCP_ACCOUNT: 'simiancraft',
    } as NodeJS.ProcessEnv);
    expect(c.tokenOverride).toBe('/tmp/t.json');
    expect(c.account).toBe('simiancraft');
  });

  it('ignores unrelated environment keys', () => {
    const c = loadConfig({ PATH: '/usr/bin', HOME: '/home/x' } as NodeJS.ProcessEnv);
    expect(c.account).toBeUndefined();
    expect(c.tokenOverride).toBeUndefined();
  });
});

describe('resolveAccount', () => {
  it('returns the explicit account', () => {
    expect(resolveAccount('alice')).toBe('alice');
  });

  it('falls back to GOOGLE_MCP_ACCOUNT', () => {
    process.env['GOOGLE_MCP_ACCOUNT'] = 'bob';
    expect(resolveAccount()).toBe('bob');
  });

  it('throws when no account is available', () => {
    delete process.env['GOOGLE_MCP_ACCOUNT'];
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
    process.env['GOOGLE_MCP_TOKEN'] = '/tmp/explicit.json';
    expect(tokenPath('anyone')).toBe('/tmp/explicit.json');
  });

  it('derives a per-account path by default', () => {
    delete process.env['GOOGLE_MCP_TOKEN'];
    expect(tokenPath('carol')).toMatch(/tokens\/carol\.json$/);
  });
});
