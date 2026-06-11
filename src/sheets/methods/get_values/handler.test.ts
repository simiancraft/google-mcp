import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Get };

function fakeSheets(captured: Captured, data: sheets_v4.Schema$ValueRange): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        get: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Get) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('get_values', () => {
  it('reads a range and projects the value grid', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        range: 'Sheet1!A1:B2',
        majorDimension: 'ROWS',
        values: [
          ['Name', 'Score'],
          ['Ada', 100],
        ],
      }),
      { spreadsheetId: 'S1', range: 'A1:B2' },
    );
    expect(captured.params).toEqual({ spreadsheetId: 'S1', range: 'A1:B2' });
    expect(result).toEqual({
      range: 'Sheet1!A1:B2',
      majorDimension: 'ROWS',
      values: [
        ['Name', 'Score'],
        ['Ada', 100],
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes render options through and survives an empty range', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, { range: 'Sheet1!C1' }), {
      spreadsheetId: 'S1',
      range: 'C1',
      majorDimension: 'COLUMNS',
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      range: 'C1',
      majorDimension: 'COLUMNS',
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    });
    expect(result).toEqual({ range: 'Sheet1!C1' });
    expect(result.values).toBeUndefined();
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
