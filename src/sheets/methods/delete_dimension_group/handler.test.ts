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

describe('delete_dimension_group', () => {
  it('deletes grouping and returns all resulting groups', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            deleteDimensionGroup: {
              dimensionGroups: [
                {
                  range: { sheetId: 3, dimension: 'COLUMNS', startIndex: 0, endIndex: 2 },
                  depth: 1,
                  collapsed: true,
                },
              ],
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        range: { sheetId: 3, dimension: 'COLUMNS', startIndex: 2, endIndex: 4 },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            deleteDimensionGroup: {
              range: { sheetId: 3, dimension: 'COLUMNS', startIndex: 2, endIndex: 4 },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      dimensionGroups: [
        {
          range: { sheetId: 3, dimension: 'COLUMNS', startIndex: 0, endIndex: 2 },
          depth: 1,
          collapsed: true,
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an invalid range and a missing reply', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 5, endIndex: 2 },
      }),
    ).rejects.toThrow('range.endIndex must be greater');
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 2, endIndex: 5 },
      }),
    ).rejects.toThrow('no dimension groups');
  });
});
