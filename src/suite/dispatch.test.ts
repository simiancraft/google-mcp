import { describe, expect, test } from 'bun:test';
import { resolve, services, usage } from './dispatch.js';

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
