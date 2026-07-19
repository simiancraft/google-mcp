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

describe('update_chart_spec', () => {
  it('replaces the spec and confirms the ids', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      chartId: 9,
      spec: {
        title: 'Revenue, trailing 12',
        pieChart: {
          domain: {
            sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 0, endColumnIndex: 1 }] },
          },
          series: {
            sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }] },
          },
        },
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateChartSpec: {
              chartId: 9,
              spec: {
                title: 'Revenue, trailing 12',
                pieChart: {
                  domain: {
                    sourceRange: {
                      sources: [{ sheetId: 0, startColumnIndex: 0, endColumnIndex: 1 }],
                    },
                  },
                  series: {
                    sourceRange: {
                      sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', chartId: 9 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses a spec with no chart or both charts', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', chartId: 9, spec: {} }),
    ).rejects.toThrow('exactly one of spec.basicChart, spec.pieChart');
    expect(captured.params).toBeUndefined();
  });
});
