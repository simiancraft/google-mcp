import { describe, expect, it } from 'bun:test';
import {
  projectBasicFilter,
  projectFilterCriteria,
  projectFilterSpec,
  projectFilterView,
  projectSortSpec,
  toBasicFilter,
  toFilterCriteria,
  toFilterView,
} from './filters-write.js';

describe('filter write carriers', () => {
  it('carries every basic-filter field and condition level', () => {
    expect(
      toBasicFilter({
        range: { sheetId: 1, startRowIndex: 0, endRowIndex: 20 },
        sortSpecs: [{ dimensionIndex: 2, sortOrder: 'DESCENDING' }],
        filterSpecs: [
          {
            columnIndex: 2,
            filterCriteria: {
              hiddenValues: ['n/a'],
              condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '10' }] },
              visibleBackgroundColorStyle: { rgbColor: { red: 1 } },
            },
          },
        ],
      }),
    ).toEqual({
      range: { sheetId: 1, startRowIndex: 0, endRowIndex: 20 },
      sortSpecs: [{ dimensionIndex: 2, sortOrder: 'DESCENDING' }],
      filterSpecs: [
        {
          columnIndex: 2,
          filterCriteria: {
            hiddenValues: ['n/a'],
            condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '10' }] },
            visibleBackgroundColorStyle: { rgbColor: { red: 1 } },
          },
        },
      ],
    });
  });

  it('carries a named-range view and foreground criteria, including absent optionals', () => {
    expect(
      toFilterView({
        filterViewId: 4,
        title: 'Open',
        namedRangeId: 'NR',
        filterSpecs: [
          {
            columnIndex: 0,
            filterCriteria: { visibleForegroundColorStyle: { rgbColor: { blue: 1 } } },
          },
        ],
      }),
    ).toEqual({
      filterViewId: 4,
      title: 'Open',
      namedRangeId: 'NR',
      filterSpecs: [
        {
          columnIndex: 0,
          filterCriteria: { visibleForegroundColorStyle: { rgbColor: { blue: 1 } } },
        },
      ],
    });
    expect(toFilterView({})).toEqual({});
    expect(toBasicFilter({})).toEqual({});
    expect(toFilterCriteria({})).toEqual({});
  });

  it('enforces filter view and color restrictions at the carrier', () => {
    expect(() => toFilterView({ range: { sheetId: 0 }, namedRangeId: 'NR' })).toThrow(
      'at most one of range or namedRangeId',
    );
    expect(() =>
      toFilterCriteria({
        visibleBackgroundColorStyle: { rgbColor: { red: 1 } },
        visibleForegroundColorStyle: { rgbColor: { blue: 1 } },
      }),
    ).toThrow('at most one of visibleBackgroundColorStyle');
    expect(() => toFilterCriteria({ visibleForegroundColorStyle: { themeColor: 'TEXT' } })).toThrow(
      'rgbColor, not a themeColor',
    );
  });
});

describe('filter read projections', () => {
  it('projects a complete view and narrows known values', () => {
    expect(
      projectFilterView({
        filterViewId: 5,
        title: 'Priority',
        range: { sheetId: 2, startColumnIndex: 1, endColumnIndex: 3 },
        sortSpecs: [{ dimensionIndex: 1, sortOrder: 'ASCENDING' }],
        filterSpecs: [
          {
            columnIndex: 1,
            filterCriteria: {
              hiddenValues: ['done'],
              condition: {
                type: 'DATE_AFTER',
                values: [{ relativeDate: 'TODAY' }, { userEnteredValue: '2026-07-19' }],
              },
              visibleBackgroundColorStyle: { rgbColor: { red: 1, green: null } },
              visibleForegroundColorStyle: { themeColor: 'TEXT' },
            },
          },
        ],
      }),
    ).toEqual({
      filterViewId: 5,
      title: 'Priority',
      range: { sheetId: 2, startColumnIndex: 1, endColumnIndex: 3 },
      sortSpecs: [{ dimensionIndex: 1, sortOrder: 'ASCENDING' }],
      filterSpecs: [
        {
          columnIndex: 1,
          filterCriteria: {
            hiddenValues: ['done'],
            condition: {
              type: 'DATE_AFTER',
              values: [{ relativeDate: 'TODAY' }, { userEnteredValue: '2026-07-19' }],
            },
            visibleBackgroundColorStyle: { rgbColor: { red: 1 } },
            visibleForegroundColorStyle: { themeColor: 'TEXT' },
          },
        },
      ],
    });
  });

  it('falls back from deprecated criteria and color fields without dropping the view', () => {
    expect(
      projectFilterView({
        filterViewId: null,
        namedRangeId: 'NR',
        criteria: {
          '3': {
            condition: { type: 'FUTURE_CONDITION', values: [] },
            visibleBackgroundColor: { green: 1 },
            visibleForegroundColor: { blue: 1 },
          },
        },
        sortSpecs: [{ dimensionIndex: null, sortOrder: 'FUTURE_ORDER' }],
      }),
    ).toEqual({
      filterViewId: 0,
      namedRangeId: 'NR',
      sortSpecs: [],
      filterSpecs: [
        {
          columnIndex: 3,
          filterCriteria: {
            visibleBackgroundColorStyle: { rgbColor: { green: 1 } },
            visibleForegroundColorStyle: { rgbColor: { blue: 1 } },
          },
        },
      ],
    });
  });

  it('projects bare filter pieces and missing criteria', () => {
    expect(projectBasicFilter({})).toEqual({});
    expect(projectFilterSpec({})).toEqual({ columnIndex: 0, filterCriteria: {} });
    expect(projectFilterCriteria({ condition: { type: 'BLANK' } })).toEqual({
      condition: { type: 'BLANK' },
    });
    expect(projectSortSpec({ dimensionIndex: 0, sortOrder: 'DESCENDING' })).toEqual({
      dimensionIndex: 0,
      sortOrder: 'DESCENDING',
    });
    expect(projectSortSpec({ sortOrder: 'FUTURE_ORDER' })).toBeUndefined();
    expect(
      projectSortSpec({
        sortOrder: 'ASCENDING',
        dataSourceColumnReference: { name: 'connected' },
      }),
    ).toBeUndefined();
    expect(projectFilterSpec({ dataSourceColumnReference: { name: 'connected' } })).toBeUndefined();
  });
});
