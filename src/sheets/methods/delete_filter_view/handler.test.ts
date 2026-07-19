import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Batchupdate };
function fakeSheets(captured: Captured): sheets_v4.Sheets {
  return {
    spreadsheets: {
      batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
        captured.params = params;
        return { data: {} };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('delete_filter_view', () => {
  it('sends the REST filterId verbatim', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), { spreadsheetId: 'SS', filterId: 7 });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ deleteFilterView: { filterId: 7 } }] },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
