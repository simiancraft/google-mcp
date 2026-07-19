import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Get };

function fakeSheets(captured: Captured, data: sheets_v4.Schema$Spreadsheet): sheets_v4.Sheets {
  return {
    spreadsheets: {
      get: async (params: sheets_v4.Params$Resource$Spreadsheets$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('get_spreadsheet', () => {
  it('gets the spreadsheet and projects it to metadata', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/S1/edit',
        properties: { title: 'Budget', locale: 'en_US', timeZone: 'America/Chicago' },
        sheets: [
          {
            properties: {
              sheetId: 0,
              title: 'Sheet1',
              index: 0,
              sheetType: 'GRID',
              gridProperties: { rowCount: 1000, columnCount: 26 },
            },
            data: [{ rowData: [{ values: [{ formattedValue: 'never projected' }] }] }],
            basicFilter: { range: { sheetId: 0 }, filterSpecs: [] },
            filterViews: [{ filterViewId: 6, title: 'Mine', range: { sheetId: 0 } }],
          },
        ],
      }),
      { spreadsheetId: 'S1' },
    );
    expect(captured.params).toEqual({ spreadsheetId: 'S1' });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/S1/edit',
      properties: { title: 'Budget', locale: 'en_US', timeZone: 'America/Chicago' },
      sheets: [
        {
          sheetId: 0,
          title: 'Sheet1',
          index: 0,
          sheetType: 'GRID',
          gridProperties: { rowCount: 1000, columnCount: 26 },
          basicFilter: { range: { sheetId: 0 }, filterSpecs: [] },
          filterViews: [{ filterViewId: 6, title: 'Mine', range: { sheetId: 0 } }],
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a bare spreadsheet', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), { spreadsheetId: 'S2' });
    expect(result).toEqual({ spreadsheetId: '' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
