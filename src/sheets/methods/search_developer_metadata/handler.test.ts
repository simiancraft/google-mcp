import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Developermetadata$Search };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$SearchDeveloperMetadataResponse,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      developerMetadata: {
        search: async (params: sheets_v4.Params$Resource$Spreadsheets$Developermetadata$Search) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('search_developer_metadata', () => {
  it('searches by lookup and projects the matches', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        matchedDeveloperMetadata: [
          {
            developerMetadata: { metadataId: 7, metadataKey: 'region', visibility: 'DOCUMENT' },
            dataFilters: [{ developerMetadataLookup: { metadataKey: 'region' } }],
          },
        ],
      }),
      {
        spreadsheetId: 'S1',
        dataFilters: [{ developerMetadataLookup: { metadataKey: 'region' } }],
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'S1',
      requestBody: { dataFilters: [{ developerMetadataLookup: { metadataKey: 'region' } }] },
    });
    expect(result).toEqual({
      matchedDeveloperMetadata: [
        {
          developerMetadata: { metadataId: 7, metadataKey: 'region', visibility: 'DOCUMENT' },
          dataFilters: [{ developerMetadataLookup: { metadataKey: 'region' } }],
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('returns an empty match list for a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), {
      spreadsheetId: 'S2',
      dataFilters: [{ a1Range: 'Sheet1!A:A' }],
    });
    expect(result).toEqual({ matchedDeveloperMetadata: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
