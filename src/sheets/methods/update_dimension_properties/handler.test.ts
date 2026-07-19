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

describe('update_dimension_properties', () => {
  it('sets exact column width and visibility with a derived mask', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 4, dimension: 'COLUMNS', startIndex: 2, endIndex: 5 },
      properties: { pixelSize: 120, hiddenByUser: false },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateDimensionProperties: {
              range: { sheetId: 4, dimension: 'COLUMNS', startIndex: 2, endIndex: 5 },
              properties: { hiddenByUser: false, pixelSize: 120 },
              fields: 'pixelSize,hiddenByUser',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', updatedFields: 'pixelSize,hiddenByUser' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty property update', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        range: { sheetId: 4, dimension: 'ROWS' },
        properties: {},
      }),
    ).rejects.toThrow('Provide at least one dimension property');
    expect(captured.params).toBeUndefined();
  });
});
