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

describe('cut_paste', () => {
  it('cuts every source field and pastes at a coordinate', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 2 },
      destination: { sheetId: 2, rowIndex: 4, columnIndex: 3 },
      pasteType: 'PASTE_VALUES',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            cutPaste: {
              source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 2 },
              destination: { sheetId: 2, rowIndex: 4, columnIndex: 3 },
              pasteType: 'PASTE_VALUES',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
