import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Batchgetbydatafilter };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchGetValuesByDataFilterResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        batchGetByDataFilter: async (
          params: sheets_v4.Params$Resource$Spreadsheets$Values$Batchgetbydatafilter,
        ) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('batch_get_values_by_data_filter', () => {
  it('reads ranges matched by filters and echoes the matching filters', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        valueRanges: [
          {
            valueRange: { range: 'Sheet1!A1:B1', values: [['a', 'b']] },
            dataFilters: [{ a1Range: 'A1:B1' }],
          },
        ],
      }),
      {
        spreadsheetId: 'S1',
        dataFilters: [{ a1Range: 'A1:B1' }, { developerMetadataLookup: { metadataKey: 'region' } }],
        majorDimension: 'ROWS',
        valueRenderOption: 'UNFORMATTED_VALUE',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      requestBody: {
        dataFilters: [{ a1Range: 'A1:B1' }, { developerMetadataLookup: { metadataKey: 'region' } }],
        majorDimension: 'ROWS',
        valueRenderOption: 'UNFORMATTED_VALUE',
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      valueRanges: [
        {
          valueRange: { range: 'Sheet1!A1:B1', values: [['a', 'b']] },
          dataFilters: [{ a1Range: 'A1:B1' }],
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives an empty match set', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S2',
      dataFilters: [{ gridRange: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 } }],
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'S2',
      requestBody: {
        dataFilters: [{ gridRange: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 } }],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'S2', valueRanges: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
