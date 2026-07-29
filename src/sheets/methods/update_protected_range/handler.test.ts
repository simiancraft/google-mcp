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

describe('update_protected_range', () => {
  it('updates the provided fields with a mask of exactly those fields', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      protectedRangeId: 41,
      description: 'inputs tab only',
      editors: { users: ['a@example.com', 'b@example.com'] },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateProtectedRange: {
              protectedRange: {
                protectedRangeId: 41,
                description: 'inputs tab only',
                editors: { users: ['a@example.com', 'b@example.com'] },
              },
              fields: 'description,editors',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      protectedRangeId: 41,
      updatedFields: 'description,editors',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('moves the protection and rewrites the unprotected ranges', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      protectedRangeId: 41,
      range: { sheetId: 2 },
      warningOnly: true,
      unprotectedRanges: [{ sheetId: 2, startRowIndex: 0, endRowIndex: 1 }],
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateProtectedRange: {
              protectedRange: {
                protectedRangeId: 41,
                range: { sheetId: 2 },
                warningOnly: true,
                unprotectedRanges: [{ sheetId: 2, startRowIndex: 0, endRowIndex: 1 }],
              },
              fields: 'range,warningOnly,unprotectedRanges',
            },
          },
        ],
      },
    });
    expect(result.updatedFields).toBe('range,warningOnly,unprotectedRanges');
  });

  it('switches the protection to a named range backing', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      protectedRangeId: 41,
      namedRangeId: 'nr1',
    });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      updateProtectedRange: {
        protectedRange: { protectedRangeId: 41, namedRangeId: 'nr1' },
        fields: 'namedRangeId',
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      protectedRangeId: 41,
      updatedFields: 'namedRangeId',
    });
  });

  it('refuses switching to both a range and a named range at once', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        protectedRangeId: 41,
        range: { sheetId: 0 },
        namedRangeId: 'nr1',
      }),
    ).rejects.toThrow('at most one of range or namedRangeId');
    expect(captured.params).toBeUndefined();
  });

  it('refuses an empty update instead of sending an empty mask', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', protectedRangeId: 41 }),
    ).rejects.toThrow('Provide at least one field to update');
    expect(captured.params).toBeUndefined();
  });
});
