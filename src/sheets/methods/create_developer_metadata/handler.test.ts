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

describe('create_developer_metadata', () => {
  it('creates row metadata and projects its assigned ID', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        createDeveloperMetadata: {
          developerMetadata: {
            metadataId: 42,
            metadataKey: 'record',
            metadataValue: 'A-17',
            location: {
              locationType: 'ROW',
              dimensionRange: { sheetId: 2, dimension: 'ROWS', startIndex: 6, endIndex: 7 },
            },
            visibility: 'DOCUMENT',
          },
        },
      }),
      {
        spreadsheetId: 'SS',
        metadataKey: 'record',
        metadataValue: 'A-17',
        location: {
          dimensionRange: { sheetId: 2, dimension: 'ROWS', startIndex: 6, endIndex: 7 },
        },
        visibility: 'DOCUMENT',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            createDeveloperMetadata: {
              developerMetadata: {
                metadataKey: 'record',
                metadataValue: 'A-17',
                location: {
                  dimensionRange: {
                    sheetId: 2,
                    dimension: 'ROWS',
                    startIndex: 6,
                    endIndex: 7,
                  },
                },
                visibility: 'DOCUMENT',
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      metadataId: 42,
      metadataKey: 'record',
      metadataValue: 'A-17',
      location: {
        locationType: 'ROW',
        dimensionRange: { sheetId: 2, dimension: 'ROWS', startIndex: 6, endIndex: 7 },
      },
      visibility: 'DOCUMENT',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('keeps an omitted zero ID total and fails loud on an empty reply', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        createDeveloperMetadata: {
          developerMetadata: {
            metadataKey: 'whole',
            location: { spreadsheet: true },
            visibility: 'PROJECT',
          },
        },
      }),
      {
        spreadsheetId: 'SS',
        metadataKey: 'whole',
        location: { spreadsheet: true },
        visibility: 'PROJECT',
      },
    );
    expect(result.metadataId).toBe(0);
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        metadataKey: 'sheet',
        location: { sheetId: 2 },
        visibility: 'DOCUMENT',
      }),
    ).rejects.toThrow('Google returned no developer metadata');
  });

  it('refuses a location with more than one association target', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        metadataKey: 'bad',
        location: { spreadsheet: true, sheetId: 2 },
        visibility: 'DOCUMENT',
      }),
    ).rejects.toThrow('exactly one of spreadsheet, sheetId, or dimensionRange');
    expect(captured.params).toBeUndefined();
  });
});
