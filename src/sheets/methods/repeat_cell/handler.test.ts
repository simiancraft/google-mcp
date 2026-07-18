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

describe('repeat_cell', () => {
  it('applies a currency format with a mask of exactly the provided fields', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: {
        sheetId: 3,
        startRowIndex: 1,
        endRowIndex: 20,
        startColumnIndex: 2,
        endColumnIndex: 3,
      },
      format: {
        numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' },
        horizontalAlignment: 'RIGHT',
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 3,
                startRowIndex: 1,
                endRowIndex: 20,
                startColumnIndex: 2,
                endColumnIndex: 3,
              },
              cell: {
                userEnteredFormat: {
                  numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' },
                  horizontalAlignment: 'RIGHT',
                },
              },
              fields: 'userEnteredFormat.numberFormat,userEnteredFormat.horizontalAlignment',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      updatedFields: 'userEnteredFormat.numberFormat,userEnteredFormat.horizontalAlignment',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('masks textFormat per subkey so untouched run properties survive', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 3, startRowIndex: 0, endRowIndex: 1 },
      format: { textFormat: { bold: true } },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId: 3, startRowIndex: 0, endRowIndex: 1 },
              cell: { userEnteredFormat: { textFormat: { bold: true } } },
              fields: 'userEnteredFormat.textFormat.bold',
            },
          },
        ],
      },
    });
    expect(result.updatedFields).toBe('userEnteredFormat.textFormat.bold');
  });

  it('refuses an empty format instead of sending an empty mask', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', range: { sheetId: 3 }, format: {} }),
    ).rejects.toThrow('Provide at least one format field');
    expect(captured.params).toBeUndefined();
  });
});
