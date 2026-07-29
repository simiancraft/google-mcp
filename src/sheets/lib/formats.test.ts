import { describe, expect, it } from 'bun:test';
import {
  projectTextFormat,
  toBorder,
  toCellFormat,
  toColorStyle,
  toTextFormat,
} from './formats.js';

describe('toColorStyle', () => {
  it('carries an RGB color', () => {
    expect(toColorStyle({ rgbColor: { red: 1, green: 0.5 } })).toEqual({
      rgbColor: { red: 1, green: 0.5 },
    });
  });

  it('carries a theme color', () => {
    expect(toColorStyle({ themeColor: 'ACCENT1' })).toEqual({ themeColor: 'ACCENT1' });
  });

  it('refuses an empty color and a both-set color, the oneof Google rejects', () => {
    expect(() => toColorStyle({})).toThrow('exactly one of rgbColor or themeColor');
    expect(() => toColorStyle({ rgbColor: { red: 1 }, themeColor: 'ACCENT1' })).toThrow(
      'exactly one of rgbColor or themeColor',
    );
  });
});

describe('toTextFormat', () => {
  it('carries the provided run properties', () => {
    expect(
      toTextFormat({ bold: true, fontSize: 12, foregroundColorStyle: { themeColor: 'LINK' } }),
    ).toEqual({ bold: true, fontSize: 12, foregroundColorStyle: { themeColor: 'LINK' } });
  });

  it('carries an empty format', () => {
    expect(toTextFormat({})).toEqual({});
  });

  it('carries a link destination', () => {
    expect(toTextFormat({ underline: true, link: { uri: 'https://example.test/doc' } })).toEqual({
      underline: true,
      link: { uri: 'https://example.test/doc' },
    });
  });
});

describe('projectTextFormat', () => {
  it('cleans nulls, carries links, and falls back to the deprecated foreground color', () => {
    expect(
      projectTextFormat({
        foregroundColor: { red: 1, green: null, blue: 0.5 },
        fontFamily: 'Inter',
        fontSize: 12,
        bold: true,
        italic: false,
        strikethrough: true,
        underline: false,
        link: { uri: 'https://example.test' },
      }),
    ).toEqual({
      foregroundColorStyle: { rgbColor: { red: 1, blue: 0.5 } },
      fontFamily: 'Inter',
      fontSize: 12,
      bold: true,
      italic: false,
      strikethrough: true,
      underline: false,
      link: { uri: 'https://example.test' },
    });
    expect(projectTextFormat({ foregroundColorStyle: { themeColor: 'TEXT' }, link: {} })).toEqual({
      foregroundColorStyle: { themeColor: 'TEXT' },
    });
  });
});

describe('toCellFormat', () => {
  it('carries the provided format fields', () => {
    expect(
      toCellFormat({
        numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' },
        backgroundColorStyle: { rgbColor: { red: 0.9, green: 0.9, blue: 0.9 } },
        textFormat: { bold: true },
        horizontalAlignment: 'RIGHT',
        wrapStrategy: 'WRAP',
      }),
    ).toEqual({
      numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' },
      backgroundColorStyle: { rgbColor: { red: 0.9, green: 0.9, blue: 0.9 } },
      textFormat: { bold: true },
      horizontalAlignment: 'RIGHT',
      wrapStrategy: 'WRAP',
    });
  });

  it('carries an empty format', () => {
    expect(toCellFormat({})).toEqual({});
  });
});

describe('toBorder', () => {
  it('carries the style and color', () => {
    expect(toBorder({ style: 'SOLID', colorStyle: { rgbColor: { red: 0 } } })).toEqual({
      style: 'SOLID',
      colorStyle: { rgbColor: { red: 0 } },
    });
  });

  it('carries a bare style', () => {
    expect(toBorder({ style: 'NONE' })).toEqual({ style: 'NONE' });
  });
});
