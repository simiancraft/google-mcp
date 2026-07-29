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

describe('update_filter_view', () => {
  it('derives a leaf range mask and replaces the lists', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      filterViewId: 8,
      title: 'Open',
      range: { sheetId: 1, endRowIndex: 50 },
      sortSpecs: [],
      filterSpecs: [],
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateFilterView: {
              filter: {
                filterViewId: 8,
                title: 'Open',
                range: { sheetId: 1, endRowIndex: 50 },
                sortSpecs: [],
                filterSpecs: [],
              },
              fields: 'title,range.sheetId,range.endRowIndex,sortSpecs,filterSpecs',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      filterViewId: 8,
      updatedFields: 'title,range.sheetId,range.endRowIndex,sortSpecs,filterSpecs',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses empty and conflicting updates', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', filterViewId: 8 }),
    ).rejects.toThrow('at least one field');
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        filterViewId: 8,
        range: { sheetId: 1 },
        namedRangeId: 'NR',
      }),
    ).rejects.toThrow('at most one of range or namedRangeId');
  });
});
