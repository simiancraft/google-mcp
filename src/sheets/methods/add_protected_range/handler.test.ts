import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Batchupdate };

function fakeSheets(captured: Captured, reply: sheets_v4.Schema$Response = {}): sheets_v4.Sheets {
  return {
    spreadsheets: {
      batchUpdate: async (params: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
        captured.params = params;
        return { data: { replies: [reply] } };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('add_protected_range', () => {
  it('protects a range with editors and projects the reply', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        addProtectedRange: {
          protectedRange: {
            protectedRangeId: 41,
            range: { sheetId: 3, startRowIndex: 0, endRowIndex: 10 },
            description: 'model outputs',
            requestingUserCanEdit: true,
            editors: { users: ['a@example.com'] },
          },
        },
      }),
      {
        spreadsheetId: 'SS',
        range: { sheetId: 3, startRowIndex: 0, endRowIndex: 10 },
        description: 'model outputs',
        editors: { users: ['a@example.com'] },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            addProtectedRange: {
              protectedRange: {
                range: { sheetId: 3, startRowIndex: 0, endRowIndex: 10 },
                description: 'model outputs',
                editors: { users: ['a@example.com'] },
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      protectedRangeId: 41,
      range: {
        sheetId: 3,
        startRowIndex: 0,
        endRowIndex: 10,
        startColumnIndex: undefined,
        endColumnIndex: undefined,
      },
      namedRangeId: undefined,
      description: 'model outputs',
      warningOnly: undefined,
      requestingUserCanEdit: true,
      unprotectedRanges: undefined,
      editors: { users: ['a@example.com'], groups: undefined, domainUsersCanEdit: undefined },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('protects a whole sheet with unprotected input ranges', async () => {
    const captured: Captured = {};
    await handler(
      fakeSheets(captured, { addProtectedRange: { protectedRange: { protectedRangeId: 8 } } }),
      {
        spreadsheetId: 'SS',
        range: { sheetId: 0 },
        warningOnly: true,
        unprotectedRanges: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
      },
    );
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      addProtectedRange: {
        protectedRange: {
          range: { sheetId: 0 },
          warningOnly: true,
          unprotectedRanges: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
        },
      },
    });
  });

  it('protects a named range and passes a caller-assigned id through', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        addProtectedRange: { protectedRange: { protectedRangeId: 99, namedRangeId: 'nr1' } },
      }),
      { spreadsheetId: 'SS', protectedRangeId: 99, namedRangeId: 'nr1' },
    );
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      addProtectedRange: {
        protectedRange: { protectedRangeId: 99, namedRangeId: 'nr1' },
      },
    });
    expect(result).toEqual({
      protectedRangeId: 99,
      range: undefined,
      namedRangeId: 'nr1',
      description: undefined,
      warningOnly: undefined,
      requestingUserCanEdit: undefined,
      unprotectedRanges: undefined,
      editors: undefined,
    });
  });

  it('fails loud when the reply carries no protected range', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', range: { sheetId: 0 } }),
    ).rejects.toThrow('Google returned no protected range');
  });

  it('refuses both range and namedRangeId, and neither', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        range: { sheetId: 0 },
        namedRangeId: 'nr1',
      }),
    ).rejects.toThrow('exactly one of range or namedRangeId');
    await expect(handler(fakeSheets(captured), { spreadsheetId: 'SS' })).rejects.toThrow(
      'exactly one of range or namedRangeId',
    );
    expect(captured.params).toBeUndefined();
  });
});
