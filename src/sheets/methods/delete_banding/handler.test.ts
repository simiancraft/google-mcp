import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

describe('delete_banding', () => {
  it('deletes a banded range by ID', async () => {
    let captured: sheets_v4.Params$Resource$Spreadsheets$Batchupdate | undefined;
    const sheets = {
      spreadsheets: {
        batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
          captured = params;
          return { data: {} };
        },
      },
    } as unknown as sheets_v4.Sheets;
    const result = await handler(sheets, { spreadsheetId: 'SS', bandedRangeId: 17 });
    expect(captured).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ deleteBanding: { bandedRangeId: 17 } }] },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', bandedRangeId: 17 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
