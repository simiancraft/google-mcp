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

describe('delete_developer_metadata', () => {
  it('uses the REST dataFilter name and projects every deleted entry', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        deleteDeveloperMetadata: {
          deletedDeveloperMetadata: [
            {
              metadataId: 7,
              metadataKey: 'temporary',
              location: { locationType: 'SHEET', sheetId: 3 },
              visibility: 'PROJECT',
            },
            {
              metadataId: 8,
              metadataKey: 'temporary',
              location: { locationType: 'SPREADSHEET', spreadsheet: true },
              visibility: 'PROJECT',
            },
          ],
        },
      }),
      {
        spreadsheetId: 'SS',
        dataFilter: { developerMetadataLookup: { metadataKey: 'temporary' } },
      },
    );
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            deleteDeveloperMetadata: {
              dataFilter: { developerMetadataLookup: { metadataKey: 'temporary' } },
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      deletedDeveloperMetadata: [
        {
          metadataId: 7,
          metadataKey: 'temporary',
          location: { locationType: 'SHEET', sheetId: 3 },
          visibility: 'PROJECT',
        },
        {
          metadataId: 8,
          metadataKey: 'temporary',
          location: { locationType: 'SPREADSHEET', spreadsheet: true },
          visibility: 'PROJECT',
        },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('returns an empty list when no metadata matches', async () => {
    const captured: Captured = {};
    expect(
      await handler(fakeSheets(captured), {
        spreadsheetId: 'SS',
        dataFilter: { developerMetadataLookup: { metadataId: 99 } },
      }),
    ).toEqual({ deletedDeveloperMetadata: [] });
  });
});
