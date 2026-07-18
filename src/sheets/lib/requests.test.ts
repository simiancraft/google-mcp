import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import {
  applyRequest,
  fieldPaths,
  toBorder,
  toCellFormat,
  toColorStyle,
  toTextFormat,
} from './requests.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Batchupdate };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchUpdateSpreadsheetResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('applyRequest', () => {
  it('sends the single request and returns its reply', async () => {
    const captured: Captured = {};
    const reply = await applyRequest(
      fakeSheets(captured, { replies: [{ addSheet: { properties: { sheetId: 5 } } }] }),
      'SS',
      {
        addSheet: {},
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ addSheet: {} }] },
    });
    expect(reply).toEqual({ addSheet: { properties: { sheetId: 5 } } });
  });

  it('returns an empty reply when the response carries none', async () => {
    const captured: Captured = {};
    const reply = await applyRequest(fakeSheets(captured, {}), 'SS', {
      deleteSheet: { sheetId: 1 },
    });
    expect(reply).toEqual({});
  });
});

describe('fieldPaths', () => {
  it('emits one path per defined key, skipping undefined', () => {
    expect(fieldPaths({ title: 'A', index: undefined, hidden: false })).toBe('title,hidden');
  });

  it('expands named keys into per-subkey paths, skipping undefined subkeys', () => {
    expect(
      fieldPaths({ title: 'A', gridProperties: { frozenRowCount: 1, rowCount: undefined } }, [
        'gridProperties',
      ]),
    ).toBe('title,gridProperties.frozenRowCount');
  });

  it('returns the empty mask when nothing is provided', () => {
    expect(fieldPaths({ title: undefined })).toBe('');
  });
});

describe('toColorStyle', () => {
  it('carries an RGB color', () => {
    expect(toColorStyle({ rgbColor: { red: 1, green: 0.5 } })).toEqual({
      rgbColor: { red: 1, green: 0.5 },
    });
  });

  it('carries a theme color', () => {
    expect(toColorStyle({ themeColor: 'ACCENT1' })).toEqual({ themeColor: 'ACCENT1' });
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
