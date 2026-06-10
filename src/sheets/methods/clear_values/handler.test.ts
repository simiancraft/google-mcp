import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Clear };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$ClearValuesResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        clear: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Clear) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('clear_values', () => {
  it('clears the range and reports the cleared extent', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { spreadsheetId: 'S1', clearedRange: 'Sheet1!A1:B2' }),
      { spreadsheetId: 'S1', range: 'A1:B2' },
    );
    expect(captured.params).toEqual({ spreadsheetId: 'S1', range: 'A1:B2', requestBody: {} });
    expect(result).toEqual({ spreadsheetId: 'S1', clearedRange: 'Sheet1!A1:B2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the requested id on a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), { spreadsheetId: 'S2', range: 'A:A' });
    expect(result).toEqual({ spreadsheetId: 'S2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
