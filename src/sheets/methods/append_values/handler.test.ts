import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Append };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$AppendValuesResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        append: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Append) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('append_values', () => {
  it('appends after the detected table', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        tableRange: 'Sheet1!A1:B3',
        updates: { spreadsheetId: 'S1', updatedRange: 'Sheet1!A4:B4', updatedCells: 2 },
      }),
      {
        spreadsheetId: 'S1',
        range: 'A1:B1',
        values: [['Grace', 95]],
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      range: 'A1:B1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [['Grace', 95]] },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      tableRange: 'Sheet1!A1:B3',
      updates: { spreadsheetId: 'S1', updatedRange: 'Sheet1!A4:B4', updatedCells: 2 },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a response with no table found', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S2',
      range: 'A1',
      values: [['x']],
      valueInputOption: 'RAW',
    });
    expect(result).toEqual({ spreadsheetId: 'S2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
