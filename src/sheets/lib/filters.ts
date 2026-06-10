import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/google.js';
import type { DataFilter } from '../entities/DataFilter.js';
import type { DeveloperMetadataLocation } from '../entities/DeveloperMetadataLocation.js';
import type { DeveloperMetadataLookup } from '../entities/DeveloperMetadataLookup.js';
import type { DimensionRange } from '../entities/DimensionRange.js';

/**
 * Data filters cross the boundary in both directions: requests carry them in
 * (where every nesting level needs its `undefined` keys stripped for Google's
 * types), and responses echo them back (where nulls clean to undefined and
 * enums narrow). These converters are that boundary, used by every
 * `*_by_data_filter` operation and the developer metadata search.
 */

/** Narrow a REST location type onto the entity enum; unspecified values drop. */
function locationType(value: string | null | undefined): DeveloperMetadataLocation['locationType'] {
  return value === 'ROW' || value === 'COLUMN' || value === 'SHEET' || value === 'SPREADSHEET'
    ? value
    : undefined;
}

/** Narrow a REST dimension onto the entity enum; unspecified values drop. */
function dimension(value: string | null | undefined): DimensionRange['dimension'] {
  return value === 'ROWS' || value === 'COLUMNS' ? value : undefined;
}

/** Convert an entity data filter into the REST request shape, stripping undefined at every level. */
export function toGoogleDataFilter(filter: DataFilter): sheets_v4.Schema$DataFilter {
  return forGoogle({
    a1Range: filter.a1Range,
    gridRange: filter.gridRange ? forGoogle(filter.gridRange) : undefined,
    developerMetadataLookup: filter.developerMetadataLookup
      ? forGoogle({
          ...filter.developerMetadataLookup,
          metadataLocation: filter.developerMetadataLookup.metadataLocation
            ? forGoogle({
                ...filter.developerMetadataLookup.metadataLocation,
                dimensionRange: filter.developerMetadataLookup.metadataLocation.dimensionRange
                  ? forGoogle(filter.developerMetadataLookup.metadataLocation.dimensionRange)
                  : undefined,
              })
            : undefined,
        })
      : undefined,
  });
}

/** Project a REST developer metadata location, cleaning nulls and narrowing enums. */
export function projectDeveloperMetadataLocation(
  data: sheets_v4.Schema$DeveloperMetadataLocation,
): DeveloperMetadataLocation {
  return {
    locationType: locationType(data.locationType),
    spreadsheet: data.spreadsheet ?? undefined,
    sheetId: data.sheetId ?? undefined,
    dimensionRange: data.dimensionRange
      ? {
          sheetId: data.dimensionRange.sheetId ?? undefined,
          dimension: dimension(data.dimensionRange.dimension),
          startIndex: data.dimensionRange.startIndex ?? undefined,
          endIndex: data.dimensionRange.endIndex ?? undefined,
        }
      : undefined,
  };
}

/** Project a REST developer metadata lookup, cleaning nulls and narrowing enums. */
function projectDeveloperMetadataLookup(
  data: sheets_v4.Schema$DeveloperMetadataLookup,
): DeveloperMetadataLookup {
  const strategy = data.locationMatchingStrategy;
  return {
    locationType: locationType(data.locationType),
    metadataLocation: data.metadataLocation
      ? projectDeveloperMetadataLocation(data.metadataLocation)
      : undefined,
    locationMatchingStrategy:
      strategy === 'EXACT_LOCATION' || strategy === 'INTERSECTING_LOCATION' ? strategy : undefined,
    metadataId: data.metadataId ?? undefined,
    metadataKey: data.metadataKey ?? undefined,
    metadataValue: data.metadataValue ?? undefined,
    visibility:
      data.visibility === 'DOCUMENT' || data.visibility === 'PROJECT' ? data.visibility : undefined,
  };
}

/** Project a REST data filter (as echoed in responses), cleaning nulls to undefined. */
export function projectDataFilter(data: sheets_v4.Schema$DataFilter): DataFilter {
  return {
    a1Range: data.a1Range ?? undefined,
    gridRange: data.gridRange
      ? {
          sheetId: data.gridRange.sheetId ?? undefined,
          startRowIndex: data.gridRange.startRowIndex ?? undefined,
          endRowIndex: data.gridRange.endRowIndex ?? undefined,
          startColumnIndex: data.gridRange.startColumnIndex ?? undefined,
          endColumnIndex: data.gridRange.endColumnIndex ?? undefined,
        }
      : undefined,
    developerMetadataLookup: data.developerMetadataLookup
      ? projectDeveloperMetadataLookup(data.developerMetadataLookup)
      : undefined,
  };
}
