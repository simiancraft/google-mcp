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

describe('update_embedded_object_border', () => {
  it('updates the object border color with a derived mask', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      objectId: 9,
      border: { colorStyle: { themeColor: 'ACCENT4' } },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateEmbeddedObjectBorder: {
              objectId: 9,
              border: { colorStyle: { themeColor: 'ACCENT4' } },
              fields: 'colorStyle',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      objectId: 9,
      updatedFields: 'colorStyle',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty border update', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', objectId: 9, border: {} }),
    ).rejects.toThrow('Provide at least one embedded object border field');
    expect(captured.params).toBeUndefined();
  });
});
