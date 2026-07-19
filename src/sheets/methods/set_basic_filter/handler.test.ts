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

describe('set_basic_filter', () => {
  it('sets the filter with every collection', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      filter: {
        range: { sheetId: 1, startRowIndex: 0, endRowIndex: 10 },
        sortSpecs: [{ dimensionIndex: 1, sortOrder: 'ASCENDING' }],
        filterSpecs: [{ columnIndex: 1, filterCriteria: { hiddenValues: ['x'] } }],
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            setBasicFilter: {
              filter: {
                range: { sheetId: 1, startRowIndex: 0, endRowIndex: 10 },
                sortSpecs: [{ dimensionIndex: 1, sortOrder: 'ASCENDING' }],
                filterSpecs: [{ columnIndex: 1, filterCriteria: { hiddenValues: ['x'] } }],
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
