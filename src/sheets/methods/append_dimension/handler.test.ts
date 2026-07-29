import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

describe('append_dimension', () => {
  it('appends columns to the end of a sheet', async () => {
    let captured: sheets_v4.Params$Resource$Spreadsheets$Batchupdate | undefined;
    const sheets = {
      spreadsheets: {
        batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
          captured = params;
          return { data: {} };
        },
      },
    } as unknown as sheets_v4.Sheets;
    const result = await handler(sheets, {
      spreadsheetId: 'SS',
      sheetId: 8,
      dimension: 'COLUMNS',
      length: 4,
    });
    expect(captured).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [{ appendDimension: { sheetId: 8, dimension: 'COLUMNS', length: 4 } }],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
