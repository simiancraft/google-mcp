import { describe, expect, it } from 'bun:test';
import { projectValueRange } from './values.js';

describe('projectValueRange', () => {
  it('projects range, dimension, and the value grid', () => {
    expect(
      projectValueRange({
        range: 'Sheet1!A1:B2',
        majorDimension: 'COLUMNS',
        values: [
          ['a', 1],
          [true, null],
        ],
      }),
    ).toEqual({
      range: 'Sheet1!A1:B2',
      majorDimension: 'COLUMNS',
      values: [
        ['a', 1],
        [true, null],
      ],
    });
  });

  it('drops an unspecified dimension and omits values for an empty range', () => {
    expect(
      projectValueRange({ range: 'A1', majorDimension: 'DIMENSION_UNSPECIFIED', values: null }),
    ).toEqual({ range: 'A1' });
    expect(projectValueRange({})).toEqual({});
  });
});
