import { describe, expect, it } from 'bun:test';
import { projectDataFilter, toGoogleDataFilter } from './filters.js';

describe('toGoogleDataFilter', () => {
  it('passes an A1 filter through and drops absent selectors', () => {
    expect(toGoogleDataFilter({ a1Range: 'Sheet1!A1:B2' })).toEqual({ a1Range: 'Sheet1!A1:B2' });
  });

  it('strips undefined keys at every nesting level', () => {
    expect(
      toGoogleDataFilter({
        gridRange: { sheetId: 0, startRowIndex: 1, endRowIndex: undefined },
        developerMetadataLookup: {
          metadataKey: 'k',
          visibility: undefined,
          metadataLocation: {
            sheetId: undefined,
            dimensionRange: { sheetId: 0, dimension: 'ROWS', startIndex: 2, endIndex: undefined },
          },
        },
      }),
    ).toEqual({
      gridRange: { sheetId: 0, startRowIndex: 1 },
      developerMetadataLookup: {
        metadataKey: 'k',
        metadataLocation: {
          dimensionRange: { sheetId: 0, dimension: 'ROWS', startIndex: 2 },
        },
      },
    });
  });
});

describe('projectDataFilter', () => {
  it('cleans nulls and narrows enums on the echo path', () => {
    expect(
      projectDataFilter({
        a1Range: null,
        gridRange: { sheetId: 3, startRowIndex: 0, endRowIndex: null },
        developerMetadataLookup: {
          locationType: 'SHEET',
          locationMatchingStrategy: 'EXACT_LOCATION',
          metadataId: 7,
          metadataKey: null,
          visibility: 'DOCUMENT',
          metadataLocation: {
            locationType: 'DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED',
            spreadsheet: true,
            dimensionRange: { dimension: 'DIMENSION_UNSPECIFIED', startIndex: null },
          },
        },
      }),
    ).toEqual({
      gridRange: { sheetId: 3, startRowIndex: 0 },
      developerMetadataLookup: {
        locationType: 'SHEET',
        locationMatchingStrategy: 'EXACT_LOCATION',
        metadataId: 7,
        visibility: 'DOCUMENT',
        metadataLocation: { spreadsheet: true, dimensionRange: {} },
      },
    });
  });

  it('drops unknown strategies and visibilities', () => {
    expect(
      projectDataFilter({
        developerMetadataLookup: { locationMatchingStrategy: 'NEW', visibility: 'NEW' },
      }),
    ).toEqual({ developerMetadataLookup: {} });
    expect(projectDataFilter({})).toEqual({});
  });
});
