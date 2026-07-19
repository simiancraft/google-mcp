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

describe('add_filter_view', () => {
  it('refuses both range and namedRangeId, and neither', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        filter: { title: 'Mine', range: { sheetId: 0 }, namedRangeId: 'nr1' },
      }),
    ).rejects.toThrow('exactly one of range or namedRangeId');
    await expect(
      handler(fakeSheets(captured, {}), { spreadsheetId: 'SS', filter: { title: 'Mine' } }),
    ).rejects.toThrow('exactly one of range or namedRangeId');
    expect(captured.params).toBeUndefined();
  });

  it('adds an omitted-ID view and projects the generated ID', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          { addFilterView: { filter: { filterViewId: 12, title: 'Mine', range: { sheetId: 1 } } } },
        ],
      }),
      {
        spreadsheetId: 'SS',
        filter: { title: 'Mine', range: { sheetId: 1 } },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [{ addFilterView: { filter: { title: 'Mine', range: { sheetId: 1 } } } }],
      },
    });
    expect(result).toEqual({ filterViewId: 12, title: 'Mine', range: { sheetId: 1 } });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses a missing add reply', async () => {
    await expect(
      handler(fakeSheets({}, {}), {
        spreadsheetId: 'SS',
        filter: { title: 'Mine', range: { sheetId: 0 } },
      }),
    ).rejects.toThrow('no filter view');
  });
});
