import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import { narrow } from '../../lib/utils/narrow.js';
import type { DataFilter } from '../entities/DataFilter.js';
import { DeveloperMetadataLocation } from '../entities/DeveloperMetadataLocation.js';
import { DeveloperMetadataLookup } from '../entities/DeveloperMetadataLookup.js';
import { DimensionRange } from '../entities/DimensionRange.js';

/**
 * Data filters cross the boundary in both directions: requests carry them in
 * (where every nesting level needs its `undefined` keys stripped for Google's
 * types), and responses echo them back (where nulls clean to undefined and
 * enums narrow). These converters are that boundary, used by every
 * `*_by_data_filter` operation and the developer metadata search.
 */

/** Convert an entity metadata location into the REST request shape (forGoogle is shallow; each level strips its own undefined keys). */
function toGoogleLocation(
  location: DeveloperMetadataLocation,
): sheets_v4.Schema$DeveloperMetadataLocation {
  return forGoogle({
    ...location,
    dimensionRange: location.dimensionRange ? forGoogle(location.dimensionRange) : undefined,
  });
}

/** Convert an entity metadata lookup into the REST request shape. */
function toGoogleLookup(lookup: DeveloperMetadataLookup): sheets_v4.Schema$DeveloperMetadataLookup {
  return forGoogle({
    ...lookup,
    metadataLocation: lookup.metadataLocation
      ? toGoogleLocation(lookup.metadataLocation)
      : undefined,
  });
}

/** Convert an entity data filter into the REST request shape, stripping undefined at every level. */
export function toGoogleDataFilter(filter: DataFilter): sheets_v4.Schema$DataFilter {
  return forGoogle({
    a1Range: filter.a1Range,
    gridRange: filter.gridRange ? forGoogle(filter.gridRange) : undefined,
    developerMetadataLookup: filter.developerMetadataLookup
      ? toGoogleLookup(filter.developerMetadataLookup)
      : undefined,
  });
}

/** Project a REST developer metadata location, cleaning nulls and narrowing enums. */
export function projectDeveloperMetadataLocation(
  data: sheets_v4.Schema$DeveloperMetadataLocation,
): DeveloperMetadataLocation {
  return {
    locationType: narrow(
      data.locationType,
      DeveloperMetadataLocation.shape.locationType.unwrap().options,
    ),
    spreadsheet: data.spreadsheet ?? undefined,
    sheetId: data.sheetId ?? undefined,
    dimensionRange: data.dimensionRange
      ? {
          sheetId: data.dimensionRange.sheetId ?? undefined,
          dimension: narrow(
            data.dimensionRange.dimension,
            DimensionRange.shape.dimension.unwrap().options,
          ),
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
  return {
    locationType: narrow(
      data.locationType,
      DeveloperMetadataLookup.shape.locationType.unwrap().options,
    ),
    metadataLocation: data.metadataLocation
      ? projectDeveloperMetadataLocation(data.metadataLocation)
      : undefined,
    locationMatchingStrategy: narrow(
      data.locationMatchingStrategy,
      DeveloperMetadataLookup.shape.locationMatchingStrategy.unwrap().options,
    ),
    metadataId: data.metadataId ?? undefined,
    metadataKey: data.metadataKey ?? undefined,
    metadataValue: data.metadataValue ?? undefined,
    visibility: narrow(data.visibility, DeveloperMetadataLookup.shape.visibility.unwrap().options),
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
