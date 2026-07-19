import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

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

describe('duplicate_sheet', () => {
  it('duplicates with a name and position', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [{ duplicateSheet: { properties: { sheetId: 7, title: 'Q3 MODEL', index: 2 } } }],
      }),
      { spreadsheetId: 'SS', sourceSheetId: 3, insertSheetIndex: 2, newSheetName: 'Q3 MODEL' },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            duplicateSheet: { sourceSheetId: 3, insertSheetIndex: 2, newSheetName: 'Q3 MODEL' },
          },
        ],
      },
    });
    expect(result).toEqual({ sheetId: 7, title: 'Q3 MODEL', index: 2 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('duplicates bare and survives a bare reply', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'SS',
      sourceSheetId: 0,
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ duplicateSheet: { sourceSheetId: 0 } }] },
    });
    expect(result).toEqual({ sheetId: 0 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
