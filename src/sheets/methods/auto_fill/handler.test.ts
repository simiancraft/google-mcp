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

describe('auto_fill', () => {
  it('fills an explicit source and destination with every carrier field', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      useAlternateSeries: false,
      sourceAndDestination: {
        source: {
          sheetId: 1,
          startRowIndex: 0,
          endRowIndex: 2,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
        dimension: 'ROWS',
        fillLength: 10,
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            autoFill: {
              useAlternateSeries: false,
              sourceAndDestination: {
                source: {
                  sheetId: 1,
                  startRowIndex: 0,
                  endRowIndex: 2,
                  startColumnIndex: 0,
                  endColumnIndex: 1,
                },
                dimension: 'ROWS',
                fillLength: 10,
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('fills a detected range and rejects both or neither areas', async () => {
    const captured: Captured = {};
    await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 1, startRowIndex: 0, endRowIndex: 10 },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [{ autoFill: { range: { sheetId: 1, startRowIndex: 0, endRowIndex: 10 } } }],
      },
    });
    await expect(handler(fakeSheets(captured), { spreadsheetId: 'SS' })).rejects.toThrow(
      'exactly one of range or sourceAndDestination',
    );
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        range: { sheetId: 1 },
        sourceAndDestination: { source: { sheetId: 1 }, dimension: 'COLUMNS', fillLength: 1 },
      }),
    ).rejects.toThrow('exactly one of range or sourceAndDestination');
  });
});
