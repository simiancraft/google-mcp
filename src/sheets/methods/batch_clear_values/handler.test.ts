import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Batchclear };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchClearValuesResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        batchClear: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Batchclear) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('batch_clear_values', () => {
  it('clears multiple ranges in one call', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        clearedRanges: ['Sheet1!A1:B2', 'Sheet2!C1:C10'],
      }),
      { spreadsheetId: 'S1', ranges: ['A1:B2', 'Sheet2!C:C'] },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      requestBody: { ranges: ['A1:B2', 'Sheet2!C:C'] },
    });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      clearedRanges: ['Sheet1!A1:B2', 'Sheet2!C1:C10'],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the requested id on a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), { spreadsheetId: 'S2', ranges: ['A1'] });
    expect(result).toEqual({ spreadsheetId: 'S2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
