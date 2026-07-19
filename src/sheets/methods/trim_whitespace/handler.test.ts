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

describe('trim_whitespace', () => {
  it('trims and projects the changed count', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { replies: [{ trimWhitespace: { cellsChangedCount: 5 } }] }),
      { spreadsheetId: 'SS', range: { sheetId: 2, startColumnIndex: 0, endColumnIndex: 1 } },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          { trimWhitespace: { range: { sheetId: 2, startColumnIndex: 0, endColumnIndex: 1 } } },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', cellsChangedCount: 5 });
    expect(() => schema.output.parse(result)).not.toThrow();
    const missingReplyCaptured: Captured = {};
    expect(
      await handler(fakeSheets(missingReplyCaptured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 2 },
      }),
    ).toEqual({ spreadsheetId: 'SS', cellsChangedCount: 0 });
    expect(missingReplyCaptured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ trimWhitespace: { range: { sheetId: 2 } } }] },
    });
  });
});
