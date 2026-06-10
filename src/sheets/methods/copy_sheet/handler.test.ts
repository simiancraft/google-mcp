import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Sheets$Copyto };

function fakeSheets(captured: Captured, data: sheets_v4.Schema$SheetProperties): sheets_v4.Sheets {
  return {
    spreadsheets: {
      sheets: {
        copyTo: async (params: sheets_v4.Params$Resource$Spreadsheets$Sheets$Copyto) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('copy_sheet', () => {
  it('copies the sheet to the destination spreadsheet', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        sheetId: 99,
        title: 'Copy of Data',
        index: 2,
        sheetType: 'GRID',
        gridProperties: { rowCount: 50, columnCount: 5 },
      }),
      { spreadsheetId: 'SRC', sheetId: 7, destinationSpreadsheetId: 'DST' },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SRC',
      sheetId: 7,
      requestBody: { destinationSpreadsheetId: 'DST' },
    });
    expect(result).toEqual({
      sheetId: 99,
      title: 'Copy of Data',
      index: 2,
      sheetType: 'GRID',
      gridProperties: { rowCount: 50, columnCount: 5 },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'SRC',
      sheetId: 0,
      destinationSpreadsheetId: 'SRC',
    });
    expect(result).toEqual({ sheetId: 0 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
