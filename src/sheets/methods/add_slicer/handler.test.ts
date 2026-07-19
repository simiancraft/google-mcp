import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Batchupdate };

function fakeSheets(captured: Captured, reply: sheets_v4.Schema$Response = {}): sheets_v4.Sheets {
  return {
    spreadsheets: {
      batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
        captured.params = params;
        return { data: { replies: [reply] } };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('add_slicer', () => {
  it('adds a fully specified slicer and projects the reply', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        addSlicer: {
          slicer: {
            slicerId: 12,
            spec: {
              dataRange: { sheetId: 2, startRowIndex: 0, endRowIndex: 20 },
              filterCriteria: { hiddenValues: ['closed'] },
              columnIndex: 1,
              applyToPivotTables: false,
              title: 'Status',
              textFormat: { bold: true, foregroundColorStyle: { themeColor: 'TEXT' } },
              backgroundColorStyle: { rgbColor: { red: 0.8, green: 0.9, blue: 1 } },
              horizontalAlignment: 'CENTER',
            },
            position: {
              overlayPosition: {
                anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 },
                offsetXPixels: 8,
                offsetYPixels: 12,
                widthPixels: 300,
                heightPixels: 180,
              },
            },
          },
        },
      }),
      {
        spreadsheetId: 'SS',
        slicerId: 12,
        spec: {
          dataRange: { sheetId: 2, startRowIndex: 0, endRowIndex: 20 },
          filterCriteria: { hiddenValues: ['closed'] },
          columnIndex: 1,
          applyToPivotTables: false,
          title: 'Status',
          textFormat: { bold: true, foregroundColorStyle: { themeColor: 'TEXT' } },
          backgroundColorStyle: { rgbColor: { red: 0.8, green: 0.9, blue: 1 } },
          horizontalAlignment: 'CENTER',
        },
        position: {
          overlayPosition: {
            anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 },
            offsetXPixels: 8,
            offsetYPixels: 12,
            widthPixels: 300,
            heightPixels: 180,
          },
        },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addSlicer: {
              slicer: {
                slicerId: 12,
                spec: {
                  dataRange: { sheetId: 2, startRowIndex: 0, endRowIndex: 20 },
                  filterCriteria: { hiddenValues: ['closed'] },
                  columnIndex: 1,
                  applyToPivotTables: false,
                  title: 'Status',
                  textFormat: { foregroundColorStyle: { themeColor: 'TEXT' }, bold: true },
                  backgroundColorStyle: { rgbColor: { red: 0.8, green: 0.9, blue: 1 } },
                  horizontalAlignment: 'CENTER',
                },
                position: {
                  overlayPosition: {
                    anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 },
                    offsetXPixels: 8,
                    offsetYPixels: 12,
                    widthPixels: 300,
                    heightPixels: 180,
                  },
                },
              },
            },
          },
        ],
      },
    });
    expect(result.slicerId).toBe(12);
    expect(result.spec).toEqual({
      dataRange: { sheetId: 2, startRowIndex: 0, endRowIndex: 20 },
      filterCriteria: { hiddenValues: ['closed'] },
      columnIndex: 1,
      applyToPivotTables: false,
      title: 'Status',
      textFormat: { foregroundColorStyle: { themeColor: 'TEXT' }, bold: true },
      backgroundColorStyle: { rgbColor: { red: 0.8, green: 0.9, blue: 1 } },
      horizontalAlignment: 'CENTER',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('keeps an omitted zero ID total and fails loud on an empty reply', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, { addSlicer: { slicer: {} } }), {
      spreadsheetId: 'SS',
      spec: {},
      position: {
        overlayPosition: { anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 0 } },
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addSlicer: {
              slicer: {
                spec: {},
                position: {
                  overlayPosition: {
                    anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 0 },
                  },
                },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ slicerId: 0 });
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        spec: {},
        position: {
          overlayPosition: { anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 0 } },
        },
      }),
    ).rejects.toThrow('Google returned no slicer');
  });

  it('refuses an object-sheet position and an overlay without an anchor', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        spec: {},
        position: { newSheet: true },
      }),
    ).rejects.toThrow('Provide only position.overlayPosition');
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        spec: {},
        position: { overlayPosition: {} },
      }),
    ).rejects.toThrow('Provide position.overlayPosition.anchorCell');
    expect(captured.params).toBeUndefined();
  });
});
