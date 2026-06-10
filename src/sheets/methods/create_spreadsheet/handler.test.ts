import { describe, expect, it } from 'bun:test';
import type { sheets_v4 } from '@googleapis/sheets';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: sheets_v4.Params$Resource$Spreadsheets$Create };

function fakeSheets(captured: Captured, data: sheets_v4.Schema$Spreadsheet): sheets_v4.Sheets {
  return {
    spreadsheets: {
      create: async (params: sheets_v4.Params$Resource$Spreadsheets$Create) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as sheets_v4.Sheets;
}

describe('create_spreadsheet', () => {
  it('creates with a title only', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, { spreadsheetId: 'NEW1', properties: { title: 'Ledger' } }),
      { title: 'Ledger' },
    );
    expect(captured.params).toEqual({ requestBody: { properties: { title: 'Ledger' } } });
    expect(result).toEqual({ spreadsheetId: 'NEW1', properties: { title: 'Ledger' } });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('creates with locale, time zone, and named sheets', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeSheets(captured, {
        spreadsheetId: 'NEW2',
        sheets: [{ properties: { sheetId: 0, title: 'Income' } }],
      }),
      {
        title: 'Budget',
        locale: 'en_US',
        timeZone: 'America/Chicago',
        sheets: [{ title: 'Income' }, { title: 'Expenses' }],
      },
    );
    expect(captured.params).toEqual({
      requestBody: {
        properties: { title: 'Budget', locale: 'en_US', timeZone: 'America/Chicago' },
        sheets: [{ properties: { title: 'Income' } }, { properties: { title: 'Expenses' } }],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'NEW2', sheets: [{ sheetId: 0, title: 'Income' }] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
