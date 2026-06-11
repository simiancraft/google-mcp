import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Values$Batchget };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$BatchGetValuesResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      values: {
        batchGet: async (params: sheets_v4.Params$Resource$Spreadsheets$Values$Batchget) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('batch_get_values', () => {
  it('reads multiple ranges in request order', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'S1',
        valueRanges: [
          { range: 'Sheet1!A1:A2', values: [['a'], ['b']] },
          { range: 'Sheet2!B1', values: [[42]] },
        ],
      }),
      { spreadsheetId: 'S1', ranges: ['A1:A2', 'Sheet2!B1'] },
    );
    expect(captured.params).toEqual({ spreadsheetId: 'S1', ranges: ['A1:A2', 'Sheet2!B1'] });
    expect(result).toEqual({
      spreadsheetId: 'S1',
      valueRanges: [
        { range: 'Sheet1!A1:A2', values: [['a'], ['b']] },
        { range: 'Sheet2!B1', values: [[42]] },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes options through and falls back to the requested id on a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S9',
      ranges: ['A1'],
      majorDimension: 'COLUMNS',
      valueRenderOption: 'FORMULA',
      dateTimeRenderOption: 'SERIAL_NUMBER',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'S9',
      ranges: ['A1'],
      majorDimension: 'COLUMNS',
      valueRenderOption: 'FORMULA',
      dateTimeRenderOption: 'SERIAL_NUMBER',
    });
    expect(result).toEqual({ spreadsheetId: 'S9', valueRanges: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
