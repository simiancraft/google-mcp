import { describe, expect, it } from 'bun:test';
import { projectNamedRange, projectSheetProperties, projectSpreadsheet } from './spreadsheet.js';

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

  it('carries the tab color and drops unknown theme colors', () => {
    expect(
      projectSheetProperties({
        sheetId: 3,
        tabColorStyle: { rgbColor: { red: 0.2, green: null, blue: 0.8 } },
      }),
    ).toEqual({ sheetId: 3, tabColorStyle: { rgbColor: { red: 0.2, blue: 0.8 } } });
    expect(
      projectSheetProperties({ sheetId: 3, tabColorStyle: { themeColor: 'ACCENT2' } }),
    ).toEqual({ sheetId: 3, tabColorStyle: { themeColor: 'ACCENT2' } });
    expect(
      projectSheetProperties({ sheetId: 3, tabColorStyle: { themeColor: 'BRAND_NEW_KIND' } }),
    ).toEqual({ sheetId: 3, tabColorStyle: {} });
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

  it('carries named ranges', () => {
    expect(
      projectSpreadsheet({
        spreadsheetId: 'S1',
        namedRanges: [{ namedRangeId: 'nr1', name: 'REVENUE', range: { sheetId: 2 } }],
      }),
    ).toEqual({
      spreadsheetId: 'S1',
      namedRanges: [{ namedRangeId: 'nr1', name: 'REVENUE', range: { sheetId: 2 } }],
    });
  });
});

describe('projectNamedRange', () => {
  it('projects the fields and cleans nulls', () => {
    expect(
      projectNamedRange({
        namedRangeId: 'nr1',
        name: 'FG_PRICE',
        range: {
          sheetId: 1,
          startRowIndex: 3,
          endRowIndex: null,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
      }),
    ).toEqual({
      namedRangeId: 'nr1',
      name: 'FG_PRICE',
      range: { sheetId: 1, startRowIndex: 3, startColumnIndex: 0, endColumnIndex: 1 },
    });
  });

  it('survives a bare resource', () => {
    expect(projectNamedRange({})).toEqual({});
    expect(projectNamedRange({ namedRangeId: null, name: null })).toEqual({});
  });
});
