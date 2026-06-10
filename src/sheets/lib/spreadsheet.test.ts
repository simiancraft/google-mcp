import { describe, expect, it } from 'bun:test';
import { projectSheetProperties, projectSpreadsheet } from './spreadsheet.js';

describe('projectSheetProperties', () => {
  it('projects the curated fields and cleans nulls', () => {
    expect(
      projectSheetProperties({
        sheetId: 7,
        title: 'Data',
        index: 1,
        sheetType: 'GRID',
        gridProperties: {
          rowCount: 100,
          columnCount: 10,
          frozenRowCount: 1,
          frozenColumnCount: null,
        },
        hidden: true,
        rightToLeft: true,
      }),
    ).toEqual({
      sheetId: 7,
      title: 'Data',
      index: 1,
      sheetType: 'GRID',
      gridProperties: { rowCount: 100, columnCount: 10, frozenRowCount: 1 },
      hidden: true,
    });
  });

  it('drops unknown sheet types and defaults a missing id', () => {
    expect(projectSheetProperties({ sheetType: 'SOMETHING_NEW' })).toEqual({ sheetId: 0 });
    expect(projectSheetProperties({ sheetId: null, sheetType: 'DATA_SOURCE' })).toEqual({
      sheetId: 0,
      sheetType: 'DATA_SOURCE',
    });
  });
});

describe('projectSpreadsheet', () => {
  it('flattens sheets to their properties and skips property-less sheets', () => {
    expect(
      projectSpreadsheet({
        spreadsheetId: 'S1',
        spreadsheetUrl: 'https://example.test/S1',
        properties: { title: 'T', locale: null, timeZone: 'UTC', autoRecalc: 'ON_CHANGE' },
        sheets: [{ properties: { sheetId: 0, title: 'A' } }, {}],
      }),
    ).toEqual({
      spreadsheetId: 'S1',
      spreadsheetUrl: 'https://example.test/S1',
      properties: { title: 'T', timeZone: 'UTC', autoRecalc: 'ON_CHANGE' },
      sheets: [{ sheetId: 0, title: 'A' }],
    });
  });

  it('drops unknown recalc intervals and survives a bare resource', () => {
    expect(projectSpreadsheet({ properties: { autoRecalc: 'NEW_INTERVAL' } })).toEqual({
      spreadsheetId: '',
      properties: {},
    });
    expect(projectSpreadsheet({})).toEqual({ spreadsheetId: '' });
  });
});
