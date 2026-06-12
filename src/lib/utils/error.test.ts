import { describe, expect, it } from 'bun:test';
import { errorMessage } from './error.js';

describe('errorMessage', () => {
  it('renders an Error by its message and anything else by String()', () => {
    expect(errorMessage(new Error('kaboom'))).toBe('kaboom');
    expect(errorMessage('plain string')).toBe('plain string');
    expect(errorMessage(42)).toBe('42');
  });
});
