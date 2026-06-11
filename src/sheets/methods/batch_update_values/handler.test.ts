import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdate };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchUpdateValuesResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdate) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('batch_update_values', () => {
  it('writes multiple ranges in one call', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        totalUpdatedRows: 2,
        totalUpdatedColumns: 2,
        totalUpdatedCells: 3,
        totalUpdatedSheets: 1,
        responses: [
          { spreadsheetId: 'S1', updatedRange: 'Sheet1!A1:B1', updatedCells: 2 },
          { spreadsheetId: 'S1', updatedRange: 'Sheet1!A2', updatedCells: 1 },
        ],
      }),
      {
        spreadsheetId: 'S1',
        data: [
          { range: 'A1:B1', values: [['a', 'b']] },
          { range: 'A2', majorDimension: 'COLUMNS', values: [[1]] },
        ],
        valueInputOption: 'RAW',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      requestBody: {
        valueInputOption: 'RAW',
        data: [
          { range: 'A1:B1', values: [['a', 'b']] },
          { range: 'A2', majorDimension: 'COLUMNS', values: [[1]] },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      totalUpdatedRows: 2,
      totalUpdatedColumns: 2,
      totalUpdatedCells: 3,
      totalUpdatedSheets: 1,
      responses: [
        { spreadsheetId: 'S1', updatedRange: 'Sheet1!A1:B1', updatedCells: 2 },
        { spreadsheetId: 'S1', updatedRange: 'Sheet1!A2', updatedCells: 1 },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the response options through', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S9',
      data: [{ range: 'A1', values: [['x']] }],
      valueInputOption: 'USER_ENTERED',
      includeValuesInResponse: true,
      responseValueRenderOption: 'UNFORMATTED_VALUE',
      responseDateTimeRenderOption: 'FORMATTED_STRING',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'S9',
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [{ range: 'A1', values: [['x']] }],
        includeValuesInResponse: true,
        responseValueRenderOption: 'UNFORMATTED_VALUE',
        responseDateTimeRenderOption: 'FORMATTED_STRING',
      },
    });
    expect(result).toEqual({ spreadsheetId: 'S9', responses: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
