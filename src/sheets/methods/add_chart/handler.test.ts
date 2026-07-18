import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
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

const columnSpec: z.infer<typeof schema.input>['spec'] = {
  title: 'Revenue',
  basicChart: {
    chartType: 'COLUMN',
    series: [
      {
        series: {
          sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }] },
        },
      },
    ],
  },
};

describe('add_chart', () => {
  it('adds an overlay chart and returns its id', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { replies: [{ addChart: { chart: { chartId: 9 } } }] }),
      {
        spreadsheetId: 'SS',
        spec: columnSpec,
        position: { overlayPosition: { anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 } } },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addChart: {
              chart: {
                spec: {
                  title: 'Revenue',
                  basicChart: {
                    chartType: 'COLUMN',
                    series: [
                      {
                        series: {
                          sourceRange: {
                            sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
                          },
                        },
                      },
                    ],
                  },
                },
                position: {
                  overlayPosition: { anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 } },
                },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ chartId: 9 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('adds a new-sheet chart and returns the sheet it landed on', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [{ addChart: { chart: { chartId: 4, position: { sheetId: 77 } } } }],
      }),
      { spreadsheetId: 'SS', spec: columnSpec, position: { newSheet: true } },
    );
    expect(result).toEqual({ chartId: 4, sheetId: 77 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a bare reply', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'SS',
      spec: columnSpec,
      position: { newSheet: true },
    });
    expect(result).toEqual({ chartId: 0 });
  });

  it('refuses a spec with no chart or both charts', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        spec: { title: 'Empty' },
        position: { newSheet: true },
      }),
    ).rejects.toThrow('exactly one of spec.basicChart or spec.pieChart');
    await expect(
      handler(fakeSheets(captured, {}), {
        spreadsheetId: 'SS',
        spec: { ...columnSpec, pieChart: {} },
        position: { newSheet: true },
      }),
    ).rejects.toThrow('exactly one of spec.basicChart or spec.pieChart');
    expect(captured.params).toBeUndefined();
  });

  it('refuses an empty position', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured, {}), { spreadsheetId: 'SS', spec: columnSpec, position: {} }),
    ).rejects.toThrow('Provide a position');
    expect(captured.params).toBeUndefined();
  });
});
