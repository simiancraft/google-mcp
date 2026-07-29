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

describe('add_sheet', () => {
  it('adds a sheet with the provided properties', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            addSheet: {
              properties: {
                sheetId: 42,
                title: 'INPUTS',
                index: 1,
                sheetType: 'GRID',
                gridProperties: { rowCount: 100, columnCount: 12 },
              },
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        title: 'INPUTS',
        index: 1,
        hidden: false,
        tabColorStyle: { rgbColor: { red: 1 } },
        gridProperties: { rowCount: 100, columnCount: 12 },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: 'INPUTS',
                index: 1,
                hidden: false,
                tabColorStyle: { rgbColor: { red: 1 } },
                gridProperties: { rowCount: 100, columnCount: 12 },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      sheetId: 42,
      title: 'INPUTS',
      index: 1,
      sheetType: 'GRID',
      gridProperties: { rowCount: 100, columnCount: 12 },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('adds a bare sheet and survives a bare reply', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), { spreadsheetId: 'SS' });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ addSheet: { properties: {} } }] },
    });
    expect(result).toEqual({ sheetId: 0 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
