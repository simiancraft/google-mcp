import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdatebydatafilter };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchUpdateValuesByDataFilterResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        batchUpdateByDataFilter: async (
          params: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdatebydatafilter,
        ) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('batch_update_values_by_data_filter', () => {
  it('writes to filter-matched ranges and projects per-range responses', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        totalUpdatedCells: 2,
        responses: [
          {
            updatedRange: 'Sheet1!A1:B1',
            updatedRows: 1,
            updatedColumns: 2,
            updatedCells: 2,
            dataFilter: { a1Range: 'A1:B1' },
          },
        ],
      }),
      {
        spreadsheetId: 'S1',
        data: [
          {
            dataFilter: { developerMetadataLookup: { metadataKey: 'header' } },
            values: [['a', 'b']],
          },
        ],
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      requestBody: {
        valueInputOption: 'RAW',
        data: [
          {
            dataFilter: { developerMetadataLookup: { metadataKey: 'header' } },
            values: [['a', 'b']],
          },
        ],
        includeValuesInResponse: true,
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      totalUpdatedCells: 2,
      responses: [
        {
          updatedRange: 'Sheet1!A1:B1',
          updatedRows: 1,
          updatedColumns: 2,
          updatedCells: 2,
          dataFilter: { a1Range: 'A1:B1' },
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the major dimension and response options through', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S9',
      data: [{ dataFilter: { a1Range: 'A1' }, majorDimension: 'COLUMNS', values: [['x']] }],
      valueInputOption: 'USER_ENTERED',
      responseValueRenderOption: 'FORMULA',
      responseDateTimeRenderOption: 'SERIAL_NUMBER',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'S9',
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [{ dataFilter: { a1Range: 'A1' }, majorDimension: 'COLUMNS', values: [['x']] }],
        responseValueRenderOption: 'FORMULA',
        responseDateTimeRenderOption: 'SERIAL_NUMBER',
      },
    });
    expect(result).toEqual({ spreadsheetId: 'S9', responses: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
