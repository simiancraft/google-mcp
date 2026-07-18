import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Batchupdate };

function fakeSheets(captured: Captured): sheets_v4.Sheets {
  return {
    spreadsheets: {
      batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
        captured.params = params;
        return { data: {} };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('insert_dimension', () => {
  it('inserts rows with inheritance', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 3, dimension: 'ROWS', startIndex: 5, endIndex: 8 },
      inheritFromBefore: true,
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: { sheetId: 3, dimension: 'ROWS', startIndex: 5, endIndex: 8 },
              inheritFromBefore: true,
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('inserts columns bare', async () => {
    const captured: Captured = {};
    await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
            },
          },
        ],
      },
    });
  });
});
