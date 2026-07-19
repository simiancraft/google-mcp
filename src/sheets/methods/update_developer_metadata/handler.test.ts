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

describe('update_developer_metadata', () => {
  it('updates every filter match behind a derived field mask and projects the reply', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        updateDeveloperMetadata: {
          developerMetadata: [
            {
              metadataId: 7,
              metadataKey: 'region',
              metadataValue: 'north',
              location: { locationType: 'SHEET', sheetId: 3 },
              visibility: 'DOCUMENT',
            },
          ],
        },
      }),
      {
        spreadsheetId: 'SS',
        dataFilters: [
          { developerMetadataLookup: { metadataKey: 'territory', visibility: 'DOCUMENT' } },
          { developerMetadataLookup: { metadataId: 7 } },
        ],
        metadataKey: 'region',
        metadataValue: 'north',
        location: { sheetId: 3 },
        visibility: 'DOCUMENT',
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateDeveloperMetadata: {
              dataFilters: [
                {
                  developerMetadataLookup: {
                    metadataKey: 'territory',
                    visibility: 'DOCUMENT',
                  },
                },
                { developerMetadataLookup: { metadataId: 7 } },
              ],
              developerMetadata: {
                metadataKey: 'region',
                metadataValue: 'north',
                location: { sheetId: 3 },
                visibility: 'DOCUMENT',
              },
              fields: 'metadataKey,metadataValue,location.sheetId,visibility',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      developerMetadata: [
        {
          metadataId: 7,
          metadataKey: 'region',
          metadataValue: 'north',
          location: { locationType: 'SHEET', sheetId: 3 },
          visibility: 'DOCUMENT',
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('returns an empty list for no matches and refuses an empty update', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      dataFilters: [{ developerMetadataLookup: { metadataId: 9 } }],
      metadataValue: 'new',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateDeveloperMetadata: {
              dataFilters: [{ developerMetadataLookup: { metadataId: 9 } }],
              developerMetadata: { metadataValue: 'new' },
              fields: 'metadataValue',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ developerMetadata: [] });
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        dataFilters: [{ developerMetadataLookup: { metadataId: 9 } }],
      }),
    ).rejects.toThrow('Provide at least one developer metadata field');
  });

  it('refuses an unbounded or multi-dimension metadata location', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        dataFilters: [{ developerMetadataLookup: { metadataId: 9 } }],
        location: {
          dimensionRange: { sheetId: 2, dimension: 'COLUMNS', startIndex: 1 },
        },
      }),
    ).rejects.toThrow('Provide a single bounded row or column');
    expect(captured.params).toBeUndefined();
  });
});
