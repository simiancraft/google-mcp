import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Batchupdate };
function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchUpdateSpreadsheetResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('duplicate_filter_view', () => {
  it('duplicates and projects the new view', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [{ duplicateFilterView: { filter: { filterViewId: 9, title: 'Copy' } } }],
      }),
      { spreadsheetId: 'SS', filterViewId: 4 },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: { requests: [{ duplicateFilterView: { filterId: 4 } }] },
    });
    expect(result).toEqual({ filterViewId: 9, title: 'Copy' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses a missing duplicate reply', async () => {
    await expect(
      handler(fakeSheets({}, {}), { spreadsheetId: 'SS', filterViewId: 4 }),
    ).rejects.toThrow('no filter view');
  });
});
