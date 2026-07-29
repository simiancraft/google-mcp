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

describe('update_spreadsheet_properties', () => {
  it('updates with a mask of exactly the provided properties', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      title: 'FY26 Model',
      timeZone: 'America/Chicago',
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: { title: 'FY26 Model', timeZone: 'America/Chicago' },
              fields: 'title,timeZone',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', updatedFields: 'title,timeZone' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty update instead of sending an empty mask', async () => {
    const captured: Captured = {};
    await expect(handler(fakeSheets(captured), { spreadsheetId: 'SS' })).rejects.toThrow(
      'Provide at least one property to update',
    );
    expect(captured.params).toBeUndefined();
  });
});
