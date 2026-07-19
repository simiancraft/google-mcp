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

describe('update_banding', () => {
  it('updates selected range and color fields with an expanded mask', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      bandedRangeId: 17,
      range: { sheetId: 2, startRowIndex: 1, endRowIndex: 20 },
      rowProperties: { headerColorStyle: { themeColor: 'ACCENT1' } },
      columnProperties: { footerColorStyle: { rgbColor: { blue: 1 } } },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateBanding: {
              bandedRange: {
                bandedRangeId: 17,
                range: { sheetId: 2, startRowIndex: 1, endRowIndex: 20 },
                rowProperties: { headerColorStyle: { themeColor: 'ACCENT1' } },
                columnProperties: { footerColorStyle: { rgbColor: { blue: 1 } } },
              },
              fields:
                'range.sheetId,range.startRowIndex,range.endRowIndex,rowProperties.headerColorStyle,columnProperties.footerColorStyle',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      bandedRangeId: 17,
      updatedFields:
        'range.sheetId,range.startRowIndex,range.endRowIndex,rowProperties.headerColorStyle,columnProperties.footerColorStyle',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty update', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', bandedRangeId: 17 }),
    ).rejects.toThrow('Provide at least one banded range field');
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        bandedRangeId: 17,
        rowProperties: {},
      }),
    ).rejects.toThrow('Provide at least one banded range field');
    expect(captured.params).toBeUndefined();
  });
});
