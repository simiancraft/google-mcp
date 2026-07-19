import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

describe('update_dimension_group', () => {
  it('collapses the range-and-depth addressed group', async () => {
    let captured: sheets_v4.Params$Resource$Spreadsheets$Batchupdate | undefined;
    const sheets = {
      spreadsheets: {
        batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
          captured = params;
          return { data: {} };
        },
      },
    } as unknown as sheets_v4.Sheets;
    const result = await handler(sheets, {
      spreadsheetId: 'SS',
      dimensionGroup: {
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 2, endIndex: 9 },
        depth: 1,
        collapsed: true,
      },
    });
    expect(captured).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateDimensionGroup: {
              dimensionGroup: {
                range: { sheetId: 3, dimension: 'ROWS', startIndex: 2, endIndex: 9 },
                depth: 1,
                collapsed: true,
              },
              fields: 'collapsed',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      dimensionGroup: {
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 2, endIndex: 9 },
        depth: 1,
        collapsed: true,
      },
      updatedFields: 'collapsed',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
