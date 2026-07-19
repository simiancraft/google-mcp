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

describe('update_borders', () => {
  it('sets the provided borders and omits the rest', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: {
        sheetId: 3,
        startRowIndex: 0,
        endRowIndex: 5,
        startColumnIndex: 0,
        endColumnIndex: 4,
      },
      bottom: { style: 'SOLID_MEDIUM', colorStyle: { rgbColor: { red: 0.2 } } },
      innerHorizontal: { style: 'DOTTED' },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateBorders: {
              range: {
                sheetId: 3,
                startRowIndex: 0,
                endRowIndex: 5,
                startColumnIndex: 0,
                endColumnIndex: 4,
              },
              bottom: { style: 'SOLID_MEDIUM', colorStyle: { rgbColor: { red: 0.2 } } },
              innerHorizontal: { style: 'DOTTED' },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('erases a border with style NONE on every side', async () => {
    const captured: Captured = {};
    await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      range: { sheetId: 0 },
      top: { style: 'NONE' },
      bottom: { style: 'NONE' },
      left: { style: 'NONE' },
      right: { style: 'NONE' },
      innerHorizontal: { style: 'NONE' },
      innerVertical: { style: 'NONE' },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateBorders: {
              range: { sheetId: 0 },
              top: { style: 'NONE' },
              bottom: { style: 'NONE' },
              left: { style: 'NONE' },
              right: { style: 'NONE' },
              innerHorizontal: { style: 'NONE' },
              innerVertical: { style: 'NONE' },
            },
          },
        ],
      },
    });
  });

  it('refuses an empty update instead of sending a no-op request', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', range: { sheetId: 0 } }),
    ).rejects.toThrow('Provide at least one border');
    expect(captured.params).toBeUndefined();
  });
});
