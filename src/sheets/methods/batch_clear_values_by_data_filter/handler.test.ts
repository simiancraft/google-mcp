import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Batchclearbydatafilter };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchClearValuesByDataFilterResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        batchClearByDataFilter: async (
          params: sheets_v4.Params$Resource$Spreadsheets$Values$Batchclearbydatafilter,
        ) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('batch_clear_values_by_data_filter', () => {
  it('clears every filter-matched range', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { spreadsheetId: 'S1', clearedRanges: ['Sheet1!A1:B2'] }),
      {
        spreadsheetId: 'S1',
        dataFilters: [{ developerMetadataLookup: { metadataKey: 'scratch' } }],
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      requestBody: { dataFilters: [{ developerMetadataLookup: { metadataKey: 'scratch' } }] },
    });
    expect(result).toEqual({ spreadsheetId: 'S1', clearedRanges: ['Sheet1!A1:B2'] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the requested id on a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S2',
      dataFilters: [{ a1Range: 'A1' }],
    });
    expect(result).toEqual({ spreadsheetId: 'S2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
