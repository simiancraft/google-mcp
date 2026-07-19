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

describe('move_conditional_format_rule', () => {
  it('moves a rule and reports the reply indexes', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { updateConditionalFormatRule: { oldIndex: 3, newIndex: 0 } }),
      { spreadsheetId: 'SS', sheetId: 7, index: 3, newIndex: 0 },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [{ updateConditionalFormatRule: { sheetId: 7, index: 3, newIndex: 0 } }],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', oldIndex: 3, newIndex: 0 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the input indexes when the reply is empty', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      sheetId: 0,
      index: 1,
      newIndex: 2,
    });
    expect(result).toEqual({ spreadsheetId: 'SS', oldIndex: 1, newIndex: 2 });
  });
});
