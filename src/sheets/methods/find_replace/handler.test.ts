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

describe('find_replace', () => {
  it('finds formulas over a range and projects every count', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            findReplace: {
              valuesChanged: 2,
              formulasChanged: 1,
              rowsChanged: 2,
              sheetsChanged: 1,
              occurrencesChanged: 4,
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        find: 'old',
        replacement: 'new',
        matchCase: true,
        matchEntireCell: false,
        searchByRegex: true,
        includeFormulas: true,
        range: { sheetId: 1, startRowIndex: 0, endRowIndex: 10 },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            findReplace: {
              find: 'old',
              replacement: 'new',
              matchCase: true,
              matchEntireCell: false,
              searchByRegex: true,
              includeFormulas: true,
              range: { sheetId: 1, startRowIndex: 0, endRowIndex: 10 },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      valuesChanged: 2,
      formulasChanged: 1,
      rowsChanged: 2,
      sheetsChanged: 1,
      occurrencesChanged: 4,
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('supports sheet and all-sheet scopes and defaults a bare reply', async () => {
    const captured: Captured = {};
    expect(
      await handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        find: 'x',
        replacement: 'y',
        sheetId: 0,
      }),
    ).toEqual({
      spreadsheetId: 'SS',
      valuesChanged: 0,
      formulasChanged: 0,
      rowsChanged: 0,
      sheetsChanged: 0,
      occurrencesChanged: 0,
    });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      findReplace: { find: 'x', replacement: 'y', sheetId: 0 },
    });
    await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'SS',
      find: 'x',
      replacement: 'y',
      allSheets: true,
    });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      findReplace: { find: 'x', replacement: 'y', allSheets: true },
    });
  });

  it('refuses both a doubled and missing scope', async () => {
    await expect(
      handler(fakeSheets({}, {}), { spreadsheetId: 'SS', find: 'x', replacement: 'y' }),
    ).rejects.toThrow('exactly one of range, sheetId, or allSheets');
    await expect(
      handler(fakeSheets({}, {}), {
        spreadsheetId: 'SS',
        find: 'x',
        replacement: 'y',
        sheetId: 0,
        allSheets: true,
      }),
    ).rejects.toThrow('exactly one of range, sheetId, or allSheets');
  });
});
