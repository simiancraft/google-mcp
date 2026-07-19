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

describe('update_conditional_format_rule', () => {
  it('replaces the rule at an index and reports the reply index', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { updateConditionalFormatRule: { oldIndex: 1 } }),
      {
        spreadsheetId: 'SS',
        index: 1,
        rule: {
          ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 121 }],
          booleanRule: {
            condition: { type: 'NUMBER_LESS', values: [{ userEnteredValue: '0' }] },
            format: { textFormat: { foregroundColorStyle: { rgbColor: { red: 1 } } } },
          },
        },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateConditionalFormatRule: {
              index: 1,
              rule: {
                ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 121 }],
                booleanRule: {
                  condition: { type: 'NUMBER_LESS', values: [{ userEnteredValue: '0' }] },
                  format: { textFormat: { foregroundColorStyle: { rgbColor: { red: 1 } } } },
                },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', index: 1 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the input index when the reply omits oldIndex', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      index: 4,
      rule: {
        ranges: [{ sheetId: 0 }],
        booleanRule: { condition: { type: 'BLANK' }, format: {} },
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', index: 4 });
  });
});
