import { describe, expect, it } from 'bun:test';
import { narrow } from './narrow.js';

describe('narrow', () => {
  it('keeps allowed values', () => {
    expect(narrow('ROWS', ['ROWS', 'COLUMNS'])).toBe('ROWS');
  });

  it('drops unknown, unspecified, null, and undefined values', () => {
    expect(narrow('DIMENSION_UNSPECIFIED', ['ROWS', 'COLUMNS'])).toBeUndefined();
    expect(narrow('SOMETHING_NEW', ['ROWS', 'COLUMNS'])).toBeUndefined();
    expect(narrow(null, ['ROWS', 'COLUMNS'])).toBeUndefined();
    expect(narrow(undefined, ['ROWS', 'COLUMNS'])).toBeUndefined();
  });
});
