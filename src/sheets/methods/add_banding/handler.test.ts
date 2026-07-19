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

describe('add_banding', () => {
  it('adds row and column banding and projects its required ID', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            addBanding: {
              bandedRange: {
                bandedRangeId: 17,
                range: { sheetId: 2, startRowIndex: 0, endRowIndex: 12 },
                rowProperties: {
                  headerColorStyle: { themeColor: 'ACCENT1' },
                  firstBandColorStyle: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } },
                  secondBandColorStyle: { themeColor: 'BACKGROUND' },
                  footerColorStyle: { themeColor: 'ACCENT2' },
                },
                columnProperties: {
                  firstBandColorStyle: { themeColor: 'ACCENT3' },
                  secondBandColorStyle: { themeColor: 'ACCENT4' },
                },
              },
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        bandedRangeId: 17,
        range: { sheetId: 2, startRowIndex: 0, endRowIndex: 12 },
        rowProperties: {
          headerColorStyle: { themeColor: 'ACCENT1' },
          firstBandColorStyle: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } },
          secondBandColorStyle: { themeColor: 'BACKGROUND' },
          footerColorStyle: { themeColor: 'ACCENT2' },
        },
        columnProperties: {
          firstBandColorStyle: { themeColor: 'ACCENT3' },
          secondBandColorStyle: { themeColor: 'ACCENT4' },
        },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addBanding: {
              bandedRange: {
                bandedRangeId: 17,
                range: { sheetId: 2, startRowIndex: 0, endRowIndex: 12 },
                rowProperties: {
                  headerColorStyle: { themeColor: 'ACCENT1' },
                  firstBandColorStyle: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } },
                  secondBandColorStyle: { themeColor: 'BACKGROUND' },
                  footerColorStyle: { themeColor: 'ACCENT2' },
                },
                columnProperties: {
                  firstBandColorStyle: { themeColor: 'ACCENT3' },
                  secondBandColorStyle: { themeColor: 'ACCENT4' },
                },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      bandedRangeId: 17,
      range: { sheetId: 2, startRowIndex: 0, endRowIndex: 12 },
      rowProperties: {
        headerColorStyle: { themeColor: 'ACCENT1' },
        firstBandColorStyle: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } },
        secondBandColorStyle: { themeColor: 'BACKGROUND' },
        footerColorStyle: { themeColor: 'ACCENT2' },
      },
      columnProperties: {
        firstBandColorStyle: { themeColor: 'ACCENT3' },
        secondBandColorStyle: { themeColor: 'ACCENT4' },
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses missing band properties and an empty add reply', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 2 },
      }),
    ).rejects.toThrow('Provide rowProperties');
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        range: { sheetId: 2 },
        rowProperties: {
          firstBandColorStyle: { themeColor: 'ACCENT1' },
          secondBandColorStyle: { themeColor: 'ACCENT2' },
        },
      }),
    ).rejects.toThrow('no banded range with an ID');
  });
});
