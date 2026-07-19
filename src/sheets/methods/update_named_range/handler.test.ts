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

describe('update_named_range', () => {
  it('renames and retargets with one mask path per provided range coordinate', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      namedRangeId: 'nr1',
      name: 'NET_REVENUE',
      range: { sheetId: 2, startRowIndex: 1, endRowIndex: 20 },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateNamedRange: {
              namedRange: {
                namedRangeId: 'nr1',
                name: 'NET_REVENUE',
                range: { sheetId: 2, startRowIndex: 1, endRowIndex: 20 },
              },
              fields: 'name,range.sheetId,range.startRowIndex,range.endRowIndex',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      namedRangeId: 'nr1',
      updatedFields: 'name,range.sheetId,range.startRowIndex,range.endRowIndex',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty update', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', namedRangeId: 'nr1' }),
    ).rejects.toThrow('Provide at least one named range field');
    expect(captured.params).toBeUndefined();
  });
});
