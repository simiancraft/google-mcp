import { describe, expect, it } from 'bun:test';
import { toCellData, toExtendedValue, toTextFormatRun } from './cells.js';

describe('toExtendedValue', () => {
  it('carries each kind alone', () => {
    expect(toExtendedValue({ stringValue: 'never' })).toEqual({ stringValue: 'never' });
    expect(toExtendedValue({ numberValue: 5.5 })).toEqual({ numberValue: 5.5 });
    expect(toExtendedValue({ boolValue: true })).toEqual({ boolValue: true });
    expect(toExtendedValue({ formulaValue: '=SUM(B2:B121)' })).toEqual({
      formulaValue: '=SUM(B2:B121)',
    });
  });

  it('carries an empty value, the documented way to clear a cell', () => {
    expect(toExtendedValue({})).toEqual({});
  });

  it('refuses two kinds', () => {
    expect(() => toExtendedValue({ stringValue: '1', numberValue: 1 })).toThrow('at most one of');
  });
});

describe('toTextFormatRun', () => {
  it('carries the start index and format, including a link', () => {
    expect(
      toTextFormatRun({
        startIndex: 4,
        format: { bold: true, link: { uri: 'https://example.test/doc' } },
      }),
    ).toEqual({
      startIndex: 4,
      format: { bold: true, link: { uri: 'https://example.test/doc' } },
    });
  });
});

describe('toCellData', () => {
  it('carries value, note, format, and runs together', () => {
    expect(
      toCellData({
        userEnteredValue: { stringValue: 'Total' },
        note: 'sum of the payoff column',
        userEnteredFormat: { textFormat: { bold: true } },
        textFormatRuns: [{ startIndex: 0, format: { underline: true } }],
      }),
    ).toEqual({
      userEnteredValue: { stringValue: 'Total' },
      note: 'sum of the payoff column',
      userEnteredFormat: { textFormat: { bold: true } },
      textFormatRuns: [{ startIndex: 0, format: { underline: true } }],
    });
  });

  it('carries an empty cell as an empty object', () => {
    expect(toCellData({})).toEqual({});
  });
});
