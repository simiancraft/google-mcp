import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
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

describe('add_named_range', () => {
  it('defines the name over the range', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        replies: [
          {
            addNamedRange: {
              namedRange: {
                namedRangeId: 'nr1',
                name: 'REFI_MODE',
                range: {
                  sheetId: 1,
                  startRowIndex: 37,
                  endRowIndex: 38,
                  startColumnIndex: 1,
                  endColumnIndex: 2,
                },
              },
            },
          },
        ],
      }),
      {
        spreadsheetId: 'SS',
        name: 'REFI_MODE',
        range: {
          sheetId: 1,
          startRowIndex: 37,
          endRowIndex: 38,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addNamedRange: {
              namedRange: {
                name: 'REFI_MODE',
                range: {
                  sheetId: 1,
                  startRowIndex: 37,
                  endRowIndex: 38,
                  startColumnIndex: 1,
                  endColumnIndex: 2,
                },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      namedRangeId: 'nr1',
      name: 'REFI_MODE',
      range: {
        sheetId: 1,
        startRowIndex: 37,
        endRowIndex: 38,
        startColumnIndex: 1,
        endColumnIndex: 2,
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a bare reply', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'SS',
      name: 'FG_PRICE',
      range: { sheetId: 0 },
    });
    expect(result).toEqual({});
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
