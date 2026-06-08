import { describe, expect, it } from 'bun:test';
import { SCOPES } from '../auth/config.js';
import { toAccount } from './accounts.js';
import { requiredApis, scopeRegistryDrift } from './services.js';
import { humanizeRemaining, statusFor } from './status.js';

describe('service registry', () => {
  it('attributes exactly the canonical SCOPES union (no drift)', () => {
    const drift = scopeRegistryDrift([...SCOPES]);
    expect(drift.missing).toEqual([]);
    expect(drift.extra).toEqual([]);
  });

  it('exposes a Cloud API id per service', () => {
    for (const api of requiredApis()) expect(api).toMatch(/\.googleapis\.com$/);
  });
});

describe('toAccount', () => {
  it('treats a bare email as its own label and login hint (zero-config)', () => {
    expect(toAccount('me@gmail.com', [])).toEqual({ label: 'me@gmail.com', email: 'me@gmail.com' });
  });

  it('treats a non-email as a label with no hint', () => {
    expect(toAccount('personal', [])).toEqual({ label: 'personal' });
  });

  it('resolves a known roster label to its entry', () => {
    const roster = [{ label: 'work', email: 'me@corp.com' }];
    expect(toAccount('work', roster)).toEqual({ label: 'work', email: 'me@corp.com' });
  });
});

describe('statusFor', () => {
  it('reports missing when no token file exists', () => {
    expect(statusFor({ label: 'nope-no-token' }, Date.now()).state).toBe('missing');
  });
});

describe('humanizeRemaining', () => {
  it('formats days and hours, and the edges', () => {
    expect(humanizeRemaining(undefined)).toBe('—');
    expect(humanizeRemaining(0)).toBe('expired');
    expect(humanizeRemaining(6 * 24 * 3_600_000 + 23 * 3_600_000)).toBe('6d 23h');
    expect(humanizeRemaining(5 * 3_600_000)).toBe('5h');
  });
});
