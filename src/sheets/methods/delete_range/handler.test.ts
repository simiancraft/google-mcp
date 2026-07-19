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

describe('delete_range', () => {
  it('deletes and shifts cells', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 1, startColumnIndex: 2, endColumnIndex: 4 },
      shiftDimension: 'COLUMNS',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            deleteRange: {
              range: { sheetId: 1, startColumnIndex: 2, endColumnIndex: 4 },
              shiftDimension: 'COLUMNS',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
