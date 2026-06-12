import { describe, expect, it } from 'bun:test';
import { ownLookup } from './lookup.js';

describe('ownLookup', () => {
  it('resolves own keys', () => {
    expect(ownLookup({ a: 1 }, 'a')).toBe(1);
  });

  it('misses absent and inherited keys', () => {
    for (const key of ['b', '__proto__', 'constructor', 'toString', 'hasOwnProperty']) {
      expect(ownLookup({ a: 1 }, key)).toBeUndefined();
    }
  });
});
