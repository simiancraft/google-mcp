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

describe('add_dimension_group', () => {
  it('adds a group and projects the complete resulting group list', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            addDimensionGroup: {
              dimensionGroups: [
                {
                  range: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 5 },
                  depth: 1,
                  collapsed: false,
                },
                {
                  range: { sheetId: 3, dimension: 'ROWS', startIndex: 2, endIndex: 4 },
                  depth: 2,
                },
              ],
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 5 },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addDimensionGroup: {
              range: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 5 },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      dimensionGroups: [
        {
          range: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 5 },
          depth: 1,
          collapsed: false,
        },
        {
          range: { sheetId: 3, dimension: 'ROWS', startIndex: 2, endIndex: 4 },
          depth: 2,
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
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 4, endIndex: 4 },
      }),
    ).rejects.toThrow('range.endIndex must be greater');
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 3, dimension: 'ROWS', startIndex: 1, endIndex: 4 },
      }),
    ).rejects.toThrow('no dimension groups');
  });
});
