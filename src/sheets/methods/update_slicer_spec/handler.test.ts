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

describe('update_slicer_spec', () => {
  it('masks structured spec fields per provided subkey', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      slicerId: 12,
      spec: {
        dataRange: { sheetId: 2, startRowIndex: 1, endRowIndex: 30 },
        filterCriteria: { hiddenValues: ['closed'] },
        columnIndex: 2,
        applyToPivotTables: true,
        title: 'Open status',
        textFormat: { bold: true },
        backgroundColorStyle: { themeColor: 'ACCENT1' },
        horizontalAlignment: 'RIGHT',
      },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateSlicerSpec: {
              slicerId: 12,
              spec: {
                dataRange: { sheetId: 2, startRowIndex: 1, endRowIndex: 30 },
                filterCriteria: { hiddenValues: ['closed'] },
                columnIndex: 2,
                applyToPivotTables: true,
                title: 'Open status',
                textFormat: { bold: true },
                backgroundColorStyle: { themeColor: 'ACCENT1' },
                horizontalAlignment: 'RIGHT',
              },
              fields:
                'dataRange.sheetId,dataRange.startRowIndex,dataRange.endRowIndex,filterCriteria.hiddenValues,columnIndex,applyToPivotTables,title,textFormat.bold,backgroundColorStyle,horizontalAlignment',
            },
          },
        ],
      },
    });
    expect(result).toEqual({
      spreadsheetId: 'SS',
      slicerId: 12,
      updatedFields:
        'dataRange.sheetId,dataRange.startRowIndex,dataRange.endRowIndex,filterCriteria.hiddenValues,columnIndex,applyToPivotTables,title,textFormat.bold,backgroundColorStyle,horizontalAlignment',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('refuses an empty spec', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeSheets(captured), { spreadsheetId: 'SS', slicerId: 12, spec: {} }),
    ).rejects.toThrow('Provide at least one slicer spec field');
    expect(captured.params).toBeUndefined();
  });

  it('clears the filter with an explicitly empty filterCriteria', async () => {
    const captured: Captured = {};
    const result = await handler(fakeSheets(captured), {
      spreadsheetId: 'SS',
      slicerId: 12,
      spec: { filterCriteria: {} },
    });
    expect(captured.params).toEqual({
      spreadsheetId: 'SS',
      requestBody: {
        requests: [
          {
            updateSlicerSpec: {
              slicerId: 12,
              spec: { filterCriteria: {} },
              fields: 'filterCriteria',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ spreadsheetId: 'SS', slicerId: 12, updatedFields: 'filterCriteria' });
  });
});
