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

describe('add_conditional_format_rule', () => {
  it('adds a gradient rule at the given index', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      rule: {
        ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 121 }],
        gradientRule: {
          minpoint: { colorStyle: { rgbColor: { red: 1 } }, type: 'MIN' },
          midpoint: {
            colorStyle: { rgbColor: { red: 1, green: 1 } },
            type: 'PERCENT',
            value: '50',
          },
          maxpoint: { colorStyle: { rgbColor: { green: 1 } }, type: 'MAX' },
        },
      },
      index: 2,
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addConditionalFormatRule: {
              rule: {
                ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 121 }],
                gradientRule: {
                  minpoint: { colorStyle: { rgbColor: { red: 1 } }, type: 'MIN' },
                  midpoint: {
                    colorStyle: { rgbColor: { red: 1, green: 1 } },
                    type: 'PERCENT',
                    value: '50',
                  },
                  maxpoint: { colorStyle: { rgbColor: { green: 1 } }, type: 'MAX' },
                },
              },
              index: 2,
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', index: 2 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('omits an absent index and reports insertion at 0', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      rule: {
        ranges: [{ sheetId: 0 }],
        booleanRule: {
          condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '100' }] },
          format: { backgroundColorStyle: { rgbColor: { red: 1 } } },
        },
      },
    });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId: 0 }],
          booleanRule: {
            condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '100' }] },
            format: { backgroundColorStyle: { rgbColor: { red: 1 } } },
          },
        },
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', index: 0 });
  });

  it('refuses a rule that is both boolean and gradient before calling Google', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        rule: {
          ranges: [{ sheetId: 0 }],
          booleanRule: { condition: { type: 'NOT_BLANK' }, format: {} },
          gradientRule: {
            minpoint: { colorStyle: { rgbColor: {} }, type: 'MIN' },
            maxpoint: { colorStyle: { rgbColor: {} }, type: 'MAX' },
          },
        },
      }),
    ).rejects.toThrow('exactly one of booleanRule or gradientRule');
    expect(captured.params).toBeUndefined();
  });
});
