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

describe('update_cells', () => {
  it('writes values, notes, and runs from a start coordinate with the union mask', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      start: { sheetId: 3, rowIndex: 0, columnIndex: 0 },
      rows: [
        {
          values: [
            {
              userEnteredValue: { stringValue: 'Docs' },
              textFormatRuns: [{ format: { link: { uri: 'https://example.test/doc' } } }],
            },
            { userEnteredValue: { numberValue: 5.5 }, note: 'rate at month 18' },
          ],
        },
        { values: [{ userEnteredValue: { formulaValue: '=SUM(B2:B121)' } }] },
      ],
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateCells: {
              start: { sheetId: 3, rowIndex: 0, columnIndex: 0 },
              rows: [
                {
                  values: [
                    {
                      userEnteredValue: { stringValue: 'Docs' },
                      textFormatRuns: [{ format: { link: { uri: 'https://example.test/doc' } } }],
                    },
                    { userEnteredValue: { numberValue: 5.5 }, note: 'rate at month 18' },
                  ],
                },
                { values: [{ userEnteredValue: { formulaValue: '=SUM(B2:B121)' } }] },
              ],
              fields: 'userEnteredValue,note,textFormatRuns',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      updatedFields: 'userEnteredValue,note,textFormatRuns',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('writes formats over a range', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: {
        sheetId: 3,
        startRowIndex: 0,
        endRowIndex: 1,
        startColumnIndex: 0,
        endColumnIndex: 1,
      },
      rows: [{ values: [{ userEnteredFormat: { textFormat: { bold: true } } }] }],
    });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      updateCells: {
        range: {
          sheetId: 3,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
        rows: [{ values: [{ userEnteredFormat: { textFormat: { bold: true } } }] }],
        fields: 'userEnteredFormat',
      },
    });
    expect(result.updatedFields).toBe('userEnteredFormat');
  });

  it('refuses both start and range, and neither', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        start: { sheetId: 0, rowIndex: 0, columnIndex: 0 },
        range: { sheetId: 0 },
        rows: [{ values: [{ note: 'x' }] }],
      }),
    ).rejects.toThrow('exactly one of start or range');
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', rows: [{ values: [{ note: 'x' }] }] }),
    ).rejects.toThrow('exactly one of start or range');
    expect(captured.params).toBeUndefined();
  });

  it('refuses rows whose cells provide nothing instead of sending an empty mask', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        start: { sheetId: 0, rowIndex: 0, columnIndex: 0 },
        rows: [{ values: [{}] }],
      }),
    ).rejects.toThrow('Provide at least one cell field');
    expect(captured.params).toBeUndefined();
  });
});
