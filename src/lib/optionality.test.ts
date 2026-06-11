import { describe, expect, it } from 'bun:test';
import { forGoogle } from './optionality.js';

describe('forGoogle', () => {
  it('drops undefined-valued keys and keeps everything else, null included', () => {
    expect(forGoogle({ a: 1, b: undefined, c: null, d: '', e: false })).toEqual({
      a: 1,
      c: null,
      d: '',
      e: false,
    });
  });

  it('passes an already-exact object through unchanged', () => {
    expect(forGoogle({ a: 'x' })).toEqual({ a: 'x' });
    expect(forGoogle({})).toEqual({});
  });
});
