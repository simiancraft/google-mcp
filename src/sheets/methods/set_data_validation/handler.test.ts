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

describe('set_data_validation', () => {
  it('sets a dropdown rule over a range', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: {
        sheetId: 3,
        startRowIndex: 1,
        endRowIndex: 121,
        startColumnIndex: 4,
        endColumnIndex: 5,
      },
      rule: {
        condition: {
          type: 'ONE_OF_LIST',
          values: [
            { userEnteredValue: 'never' },
            { userEnteredValue: '5.50@18' },
            { userEnteredValue: '5.00@36' },
          ],
        },
        strict: true,
        showCustomUi: true,
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId: 3,
                startRowIndex: 1,
                endRowIndex: 121,
                startColumnIndex: 4,
                endColumnIndex: 5,
              },
              rule: {
                condition: {
                  type: 'ONE_OF_LIST',
                  values: [
                    { userEnteredValue: 'never' },
                    { userEnteredValue: '5.50@18' },
                    { userEnteredValue: '5.00@36' },
                  ],
                },
                strict: true,
                showCustomUi: true,
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('carries filteredRowsIncluded when provided', async () => {
    const captured: Captured = {};
    await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 0 },
      rule: { condition: { type: 'TEXT_IS_EMAIL' } },
      filteredRowsIncluded: true,
    });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      setDataValidation: {
        range: { sheetId: 0 },
        rule: { condition: { type: 'TEXT_IS_EMAIL' } },
        filteredRowsIncluded: true,
      },
    });
  });
});
