import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Developermetadata$Get };

function fakeSheets(
  captured: Captured,
  data: sheets_v4.Schema$DeveloperMetadata,
): sheets_v4.Sheets {
  return {
    spreadsheets: {
      developerMetadata: {
        get: async (params: sheets_v4.Params$Resource$Spreadsheets$Developermetadata$Get) => {
          captured.params = params;
          return { data };
        },
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('get_developer_metadata', () => {
  it('gets a metadata entry by id and projects it', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        metadataId: 42,
        metadataKey: 'region',
        metadataValue: 'us-east',
        location: { locationType: 'SPREADSHEET', spreadsheet: true },
        visibility: 'DOCUMENT',
      }),
      { spreadsheetId: 'S1', metadataId: 42 },
    );
    expect(captured.params).toEqual({ spreadsheetId: 'S1', metadataId: 42 });
    expect(result).toEqual({
      metadataId: 42,
      metadataKey: 'region',
      metadataValue: 'us-east',
      location: { locationType: 'SPREADSHEET', spreadsheet: true },
      visibility: 'DOCUMENT',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured, {}), { spreadsheetId: 'S2', metadataId: 1 });
    expect(result).toEqual({ metadataId: 0 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
