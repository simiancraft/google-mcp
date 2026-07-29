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

describe('move_dimension', () => {
  it('moves rows using before-removal indexes', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      source: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 3 },
      destinationIndex: 4,
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            moveDimension: {
              source: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 3 },
              destinationIndex: 4,
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty source range', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        source: { sheetId: 3, dimension: 'COLUMNS', startIndex: 2, endIndex: 2 },
        destinationIndex: 4,
      }),
    ).rejects.toThrow('source.endIndex must be greater');
    expect(captured.params).toBeUndefined();
  });
});
