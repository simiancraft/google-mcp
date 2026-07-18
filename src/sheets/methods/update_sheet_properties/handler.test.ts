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

describe('update_sheet_properties', () => {
  it('renames, moves, and colors with a mask of exactly the provided properties', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      sheetId: 3,
      title: 'DASHBOARD',
      index: 0,
      tabColorStyle: { rgbColor: { red: 0.2, green: 0.6, blue: 0.2 } },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: 3,
                title: 'DASHBOARD',
                index: 0,
                tabColorStyle: { rgbColor: { red: 0.2, green: 0.6, blue: 0.2 } },
              },
              fields: 'title,index,tabColorStyle',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      sheetId: 3,
      updatedFields: 'title,index,tabColorStyle',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('masks gridProperties per subkey so untouched counts survive', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      sheetId: 3,
      hidden: true,
      gridProperties: { frozenRowCount: 2 },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId: 3, hidden: true, gridProperties: { frozenRowCount: 2 } },
              fields: 'hidden,gridProperties.frozenRowCount',
            },
          },
        ],
      },
    });
    expect(result.updatedFields).toBe('hidden,gridProperties.frozenRowCount');
  });

  it('refuses an empty update instead of sending an empty mask', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', sheetId: 3 }),
    ).rejects.toThrow('Provide at least one property to update');
    expect(captured.params).toBeUndefined();
  });
});
