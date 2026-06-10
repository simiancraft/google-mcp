import { describe, expect, it } from 'bun:test';
import { SCOPES } from '../auth/config.js';
import { requiredApis, requiredScopes, scopeRegistryDrift } from './services.js';

describe('scopeRegistryDrift', () => {
  it('is clean: the registry matches the canonical SCOPES', () => {
    const drift = scopeRegistryDrift([...SCOPES]);
    expect(drift.missing).toEqual([]);
    expect(drift.extra).toEqual([]);
  });

  it('reports scopes declared but not canonical (extra)', () => {
    const drift = scopeRegistryDrift(['https://mail.google.com/'], [...SCOPES]);
    expect(drift.missing).toEqual([]);
    expect(drift.extra.length).toBeGreaterThan(0);
  });

  it('reports canonical scopes not declared (missing)', () => {
    const drift = scopeRegistryDrift([...SCOPES, 'https://extra.example/'], []);
    expect(drift.missing).toContain('https://extra.example/');
  });
});

describe('requiredScopes / requiredApis', () => {
  it('requiredScopes equals the SCOPES union', () => {
    expect([...requiredScopes()].sort()).toEqual([...SCOPES].sort());
  });

  it('requiredApis are googleapis identifiers', () => {
    for (const api of requiredApis()) expect(api).toMatch(/\.googleapis\.com$/);
  });
});
