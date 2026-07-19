import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { applyRequest, cellFieldPaths, fieldPaths } from './requests.js';

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

describe('cellFieldPaths', () => {
  it('unions the fields across every cell, expanding format per subkey', () => {
    expect(
      cellFieldPaths([
        { values: [{ note: 'a' }, { userEnteredValue: { numberValue: 1 } }] },
        { values: [{ userEnteredFormat: { textFormat: { bold: true } } }] },
      ]),
    ).toBe('userEnteredValue,note,userEnteredFormat.textFormat.bold');
  });

  it('unions format paths across cells without widening to the whole format', () => {
    expect(
      cellFieldPaths([
        {
          values: [
            { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
            { userEnteredFormat: { textFormat: { bold: true, italic: true } } },
          ],
        },
      ]),
    ).toBe(
      'userEnteredFormat.numberFormat,userEnteredFormat.textFormat.bold,userEnteredFormat.textFormat.italic',
    );
  });

  it('returns empty when no cell provides anything', () => {
    expect(cellFieldPaths([{ values: [{}] }])).toBe('');
    expect(cellFieldPaths([])).toBe('');
  });
});
