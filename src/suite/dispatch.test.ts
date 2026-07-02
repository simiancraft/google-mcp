import { describe, expect, test } from 'bun:test';
import pkg from '../../package.json' with { type: 'json' };
import { resolve, services, usage } from './dispatch.js';

describe('published bins', () => {
  test('the dispatchable names mirror the published bins', () => {
    // pkg.name, not a literal: npx can only run a bin named after the package.
    const expected = [pkg.name, 'google-mcp-doctor', ...services.map((s) => `google-mcp-${s}`)];
    expect(Object.keys(pkg.bin).sort()).toEqual(expected.sort());
  });

  test('each dispatch target is that bin entry point, relative to dist/suite/', () => {
    const bins: Record<string, string> = pkg.bin;
    for (const name of [...services, 'doctor'] as const) {
      const bin = name === 'doctor' ? 'google-mcp-doctor' : `google-mcp-${name}`;
      expect(bins[bin]).toBe(`./dist/${name}/index.js`);
      expect(resolve(name)).toBe(`../${name}/index.js`);
    }
  });
});

describe('resolve', () => {
  test('maps every service to its entry module', () => {
    for (const service of services) {
      expect(resolve(service)).toBe(`../${service}/index.js`);
    }
  });

  test('maps doctor to the doctor CLI', () => {
    expect(resolve('doctor')).toBe('../doctor/index.js');
  });

  test('misses on unknown names', () => {
    expect(resolve('gcal')).toBeUndefined();
    expect(resolve('')).toBeUndefined();
  });

  test('misses on inherited object keys', () => {
    expect(resolve('constructor')).toBeUndefined();
    expect(resolve('__proto__')).toBeUndefined();
    expect(resolve('toString')).toBeUndefined();
  });
});

describe('usage', () => {
  test('names every dispatchable target and the account variable', () => {
    for (const service of services) {
      expect(usage).toContain(service);
      expect(usage).toContain(`google-mcp-${service}`);
    }
    expect(usage).toContain('doctor');
    expect(usage).toContain('GOOGLE_MCP_ACCOUNT');
  });
});
