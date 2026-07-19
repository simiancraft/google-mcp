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

describe('text_to_columns', () => {
  it('splits with a custom delimiter', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 },
      delimiter: '|',
      delimiterType: 'CUSTOM',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            textToColumns: {
              source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 },
              delimiter: '|',
              delimiterType: 'CUSTOM',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('supports a standard delimiter and rejects mismatched custom fields', async () => {
    const captured: Captured = {};
    await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 },
      delimiterType: 'COMMA',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            textToColumns: {
              source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 },
              delimiterType: 'COMMA',
            },
          },
        ],
      },
    });
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 },
        delimiterType: 'CUSTOM',
      }),
    ).rejects.toThrow('delimiter exactly when');
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 },
        delimiter: ',',
        delimiterType: 'COMMA',
      }),
    ).rejects.toThrow('delimiter exactly when');
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        source: { sheetId: 1, startColumnIndex: 0, endColumnIndex: 2 },
        delimiterType: 'COMMA',
      }),
    ).rejects.toThrow('exactly one column');
  });
});
