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

describe('delete_duplicates', () => {
  it('deletes duplicates using selected columns and projects the count', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { replies: [{ deleteDuplicates: { duplicatesRemovedCount: 3 } }] }),
      {
        spreadsheetId: 'SS',
        range: { sheetId: 1, startRowIndex: 1, endRowIndex: 20 },
        comparisonColumns: [{ sheetId: 1, dimension: 'COLUMNS', startIndex: 0, endIndex: 2 }],
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            deleteDuplicates: {
              range: { sheetId: 1, startRowIndex: 1, endRowIndex: 20 },
              comparisonColumns: [{ sheetId: 1, dimension: 'COLUMNS', startIndex: 0, endIndex: 2 }],
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', duplicatesRemovedCount: 3 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('omits comparison columns, defaults the reply count, and rejects rows', async () => {
    const captured: Captured = {};
    expect(
      await handler(fakeSheets(captured, {}), { spreadsheetId: 'SS', range: { sheetId: 1 } }),
    ).toEqual({ spreadsheetId: 'SS', duplicatesRemovedCount: 0 });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      deleteDuplicates: { range: { sheetId: 1 } },
    });
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 1 },
        comparisonColumns: [{ sheetId: 1, dimension: 'ROWS' }],
      }),
    ).rejects.toThrow('must use dimension COLUMNS');
  });
});
