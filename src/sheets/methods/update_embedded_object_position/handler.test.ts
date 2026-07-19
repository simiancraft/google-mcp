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

describe('update_embedded_object_position', () => {
  it('moves and resizes an object, then projects the returned position', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            updateEmbeddedObjectPosition: {
              position: {
                overlayPosition: {
                  anchorCell: { sheetId: 2, rowIndex: 1, columnIndex: 4 },
                  offsetXPixels: 3,
                  offsetYPixels: 5,
                  widthPixels: 640,
                  heightPixels: 360,
                },
              },
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        objectId: 9,
        newPosition: {
          overlayPosition: {
            anchorCell: { sheetId: 2, rowIndex: 1, columnIndex: 4 },
            offsetXPixels: 3,
            offsetYPixels: 5,
            widthPixels: 640,
            heightPixels: 360,
          },
        },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateEmbeddedObjectPosition: {
              objectId: 9,
              newPosition: {
                overlayPosition: {
                  anchorCell: { sheetId: 2, rowIndex: 1, columnIndex: 4 },
                  offsetXPixels: 3,
                  offsetYPixels: 5,
                  widthPixels: 640,
                  heightPixels: 360,
                },
              },
              fields: 'anchorCell,offsetXPixels,offsetYPixels,widthPixels,heightPixels',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      overlayPosition: {
        anchorCell: { sheetId: 2, rowIndex: 1, columnIndex: 4 },
        offsetXPixels: 3,
        offsetYPixels: 5,
        widthPixels: 640,
        heightPixels: 360,
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty overlay update and a missing reply', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        objectId: 9,
        newPosition: { overlayPosition: {} },
      }),
    ).rejects.toThrow('Provide at least one newPosition.overlayPosition field');
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        objectId: 9,
        newPosition: { overlayPosition: { widthPixels: 500 } },
      }),
    ).rejects.toThrow('no position');
  });
});
