import { describe, expect, it } from 'bun:test';
import { cellFieldPaths, toCellData, toExtendedValue, toTextFormatRun } from './cells.js';

describe('toExtendedValue', () => {
  it('carries each kind alone', () => {
    expect(toExtendedValue({ stringValue: 'never' })).toEqual({ stringValue: 'never' });
    expect(toExtendedValue({ numberValue: 5.5 })).toEqual({ numberValue: 5.5 });
    expect(toExtendedValue({ boolValue: true })).toEqual({ boolValue: true });
    expect(toExtendedValue({ formulaValue: '=SUM(B2:B121)' })).toEqual({
      formulaValue: '=SUM(B2:B121)',
    });
  });

  it('refuses zero kinds and two kinds', () => {
    expect(() => toExtendedValue({})).toThrow('exactly one of');
    expect(() => toExtendedValue({ stringValue: '1', numberValue: 1 })).toThrow('exactly one of');
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

  it('drops an absent start index', () => {
    expect(toTextFormatRun({ format: { italic: true } })).toEqual({
      format: { italic: true },
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
        textFormatRuns: [{ format: { underline: true } }],
      }),
    ).toEqual({
      userEnteredValue: { stringValue: 'Total' },
      note: 'sum of the payoff column',
      userEnteredFormat: { textFormat: { bold: true } },
      textFormatRuns: [{ format: { underline: true } }],
    });
  });

  it('carries an empty cell as an empty object', () => {
    expect(toCellData({})).toEqual({});
  });
});

describe('cellFieldPaths', () => {
  it('unions the fields across every cell in canonical order', () => {
    expect(
      cellFieldPaths([
        { values: [{ note: 'a' }, { userEnteredValue: { numberValue: 1 } }] },
        { values: [{ userEnteredFormat: { textFormat: { bold: true } } }] },
      ]),
    ).toBe('userEnteredValue,note,userEnteredFormat');
  });

  it('returns empty when no cell provides anything', () => {
    expect(cellFieldPaths([{ values: [{}] }])).toBe('');
    expect(cellFieldPaths([])).toBe('');
  });
});
