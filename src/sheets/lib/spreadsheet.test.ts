import { describe, expect, it } from 'bun:test';
import {
  projectConditionalFormatRule,
  projectNamedRange,
  projectSheetProperties,
  projectSpreadsheet,
} from './spreadsheet.js';

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

  it("carries each sheet's filters, protected ranges, rules, banding, groups, and merges", () => {
    expect(
      projectSpreadsheet({
        spreadsheetId: 'S1',
        sheets: [
          {
            properties: { sheetId: 0, title: 'A' },
            basicFilter: {
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 20 },
              sortSpecs: [{ dimensionIndex: 1, sortOrder: 'ASCENDING' }],
              filterSpecs: [{ columnIndex: 1, filterCriteria: { hiddenValues: ['archived'] } }],
            },
            filterViews: [
              {
                filterViewId: 11,
                title: 'Open items',
                range: { sheetId: 0, startRowIndex: 0, endRowIndex: 20 },
                filterSpecs: [
                  {
                    columnIndex: 2,
                    filterCriteria: {
                      condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'open' }] },
                    },
                  },
                ],
              },
            ],
            merges: [
              {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 2,
                startColumnIndex: 0,
                endColumnIndex: 3,
              },
            ],
            protectedRanges: [
              {
                protectedRangeId: 7,
                range: { sheetId: 0, startRowIndex: 0, endRowIndex: 3 },
                warningOnly: true,
              },
            ],
            conditionalFormats: [
              {
                ranges: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
                booleanRule: {
                  condition: {
                    type: 'NUMBER_GREATER',
                    values: [{ userEnteredValue: '100', relativeDate: null }],
                  },
                  format: {
                    backgroundColorStyle: { rgbColor: { red: 1 } },
                    textFormat: { bold: true, foregroundColorStyle: { themeColor: 'TEXT' } },
                  },
                },
              },
            ],
            bandedRanges: [
              {
                bandedRangeId: 17,
                range: { sheetId: 0, startRowIndex: 0, endRowIndex: 20 },
                rowProperties: {
                  firstBandColorStyle: { themeColor: 'ACCENT1' },
                  secondBandColorStyle: { rgbColor: { blue: 1 } },
                },
              },
              {
                bandedRangeReference: 'table/4/banding/1',
                columnProperties: {
                  headerColor: { red: 1 },
                  firstBandColor: { green: 1 },
                  secondBandColor: { blue: 1 },
                  footerColor: { red: 0.5, blue: 0.5 },
                },
              },
            ],
            rowGroups: [
              {
                range: { sheetId: 0, dimension: 'ROWS', startIndex: 1, endIndex: 9 },
                depth: 1,
                collapsed: true,
              },
              { range: { sheetId: 0, dimension: 'FUTURE_DIMENSION' }, depth: null },
            ],
            columnGroups: [
              {
                range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 5 },
                depth: 1,
                collapsed: false,
              },
            ],
          },
        ],
      }),
    ).toEqual({
      spreadsheetId: 'S1',
      sheets: [
        {
          sheetId: 0,
          title: 'A',
          basicFilter: {
            range: { sheetId: 0, startRowIndex: 0, endRowIndex: 20 },
            sortSpecs: [{ dimensionIndex: 1, sortOrder: 'ASCENDING' }],
            filterSpecs: [{ columnIndex: 1, filterCriteria: { hiddenValues: ['archived'] } }],
          },
          filterViews: [
            {
              filterViewId: 11,
              title: 'Open items',
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 20 },
              filterSpecs: [
                {
                  columnIndex: 2,
                  filterCriteria: {
                    condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'open' }] },
                  },
                },
              ],
            },
          ],
          merges: [
            {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 2,
              startColumnIndex: 0,
              endColumnIndex: 3,
            },
          ],
          protectedRanges: [
            {
              protectedRangeId: 7,
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 3 },
              warningOnly: true,
            },
          ],
          conditionalFormats: [
            {
              ranges: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
              booleanRule: {
                condition: {
                  type: 'NUMBER_GREATER',
                  values: [{ userEnteredValue: '100' }],
                },
                format: {
                  backgroundColorStyle: { rgbColor: { red: 1 } },
                  textFormat: { bold: true, foregroundColorStyle: { themeColor: 'TEXT' } },
                },
              },
            },
          ],
          bandedRanges: [
            {
              bandedRangeId: 17,
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 20 },
              rowProperties: {
                firstBandColorStyle: { themeColor: 'ACCENT1' },
                secondBandColorStyle: { rgbColor: { blue: 1 } },
              },
            },
            {
              bandedRangeReference: 'table/4/banding/1',
              columnProperties: {
                headerColorStyle: { rgbColor: { red: 1 } },
                firstBandColorStyle: { rgbColor: { green: 1 } },
                secondBandColorStyle: { rgbColor: { blue: 1 } },
                footerColorStyle: { rgbColor: { red: 0.5, blue: 0.5 } },
              },
            },
          ],
          rowGroups: [
            {
              range: { sheetId: 0, dimension: 'ROWS', startIndex: 1, endIndex: 9 },
              depth: 1,
              collapsed: true,
            },
            { range: { sheetId: 0 }, depth: 0 },
          ],
          columnGroups: [
            {
              range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 5 },
              depth: 1,
              collapsed: false,
            },
          ],
        },
      ],
    });
  });
});

describe('projectConditionalFormatRule', () => {
  it('keeps an unrecognized condition type instead of dropping the rule', () => {
    expect(
      projectConditionalFormatRule({
        ranges: [{ sheetId: 0 }],
        booleanRule: { condition: { type: 'SOME_FUTURE_TYPE' } },
      }),
    ).toEqual({
      ranges: [{ sheetId: 0 }],
      booleanRule: { condition: { type: 'SOME_FUTURE_TYPE' } },
    });
  });

  it('projects a gradient rule, reading the deprecated color field for old sheets', () => {
    expect(
      projectConditionalFormatRule({
        ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 121 }],
        gradientRule: {
          minpoint: { color: { red: 1 }, type: 'MIN' },
          midpoint: {
            colorStyle: { rgbColor: { red: 1, green: 1 } },
            type: 'PERCENT',
            value: '50',
          },
          maxpoint: { colorStyle: { themeColor: 'ACCENT1' }, type: 'MAX' },
        },
      }),
    ).toEqual({
      ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 121 }],
      gradientRule: {
        minpoint: { colorStyle: { rgbColor: { red: 1 } }, type: 'MIN' },
        midpoint: { colorStyle: { rgbColor: { red: 1, green: 1 } }, type: 'PERCENT', value: '50' },
        maxpoint: { colorStyle: { themeColor: 'ACCENT1' }, type: 'MAX' },
      },
    });
  });

  it('survives a bare rule', () => {
    expect(projectConditionalFormatRule({})).toEqual({});
  });

  it('falls back to the deprecated boolean-rule color fields for old sheets', () => {
    expect(
      projectConditionalFormatRule({
        ranges: [{ sheetId: 0 }],
        booleanRule: {
          condition: { type: 'NOT_BLANK' },
          format: {
            backgroundColor: { red: 1 },
            textFormat: { foregroundColor: { blue: 1 }, bold: true },
          },
        },
      }),
    ).toEqual({
      ranges: [{ sheetId: 0 }],
      booleanRule: {
        condition: { type: 'NOT_BLANK' },
        format: {
          backgroundColorStyle: { rgbColor: { red: 1 } },
          textFormat: { foregroundColorStyle: { rgbColor: { blue: 1 } }, bold: true },
        },
      },
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
