import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { applyRequest, fieldPaths, toColorStyle } from './requests.js';

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
