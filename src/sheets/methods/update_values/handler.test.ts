import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Update };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$UpdateValuesResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        update: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Update) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('update_values', () => {
  it('writes the grid with the required valueInputOption', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        updatedRange: 'Sheet1!A1:B2',
        updatedRows: 2,
        updatedColumns: 2,
        updatedCells: 4,
      }),
      {
        spreadsheetId: 'S1',
        range: 'A1:B2',
        values: [
          ['Name', 'Score'],
          ['Ada', 100],
        ],
        valueInputOption: 'USER_ENTERED',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      range: 'A1:B2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['Name', 'Score'],
          ['Ada', 100],
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      updatedRange: 'Sheet1!A1:B2',
      updatedRows: 2,
      updatedColumns: 2,
      updatedCells: 4,
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the response options and echoes updated data', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        updatedCells: 1,
        updatedData: { range: 'Sheet1!A1', values: [[7]] },
      }),
      {
        spreadsheetId: 'S1',
        range: 'A1',
        values: [[7]],
        majorDimension: 'COLUMNS',
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
        responseValueRenderOption: 'UNFORMATTED_VALUE',
        responseDateTimeRenderOption: 'FORMATTED_STRING',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      range: 'A1',
      valueInputOption: 'RAW',
      includeValuesInResponse: true,
      responseValueRenderOption: 'UNFORMATTED_VALUE',
      responseDateTimeRenderOption: 'FORMATTED_STRING',
      requestBody: { values: [[7]], majorDimension: 'COLUMNS' },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      updatedCells: 1,
      updatedData: { range: 'Sheet1!A1', values: [[7]] },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
