import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import { narrow } from '../../lib/utils/narrow.js';
import { DeveloperMetadata } from '../entities/DeveloperMetadata.js';
import type { DeveloperMetadataLocation } from '../entities/DeveloperMetadataLocation.js';
import { projectDeveloperMetadataLocation, toGoogleDeveloperMetadataLocation } from './filters.js';

export interface DeveloperMetadataWrite {
  metadataId?: number | undefined;
  metadataKey?: string | undefined;
  metadataValue?: string | undefined;
  location?: DeveloperMetadataLocation | undefined;
  visibility?: 'DOCUMENT' | 'PROJECT' | undefined;
}

/** Enforce the REST write constraint on a metadata dimension location. */
export function assertSingleBoundedMetadataDimension(
  location: DeveloperMetadataLocation | undefined,
): void {
  const range = location?.dimensionRange;
  if (
    range !== undefined &&
    ((range.dimension !== 'ROWS' && range.dimension !== 'COLUMNS') ||
      range.startIndex === undefined ||
      range.endIndex === undefined ||
      range.endIndex !== range.startIndex + 1)
  ) {
    throw new Error('Provide a single bounded row or column in location.dimensionRange.');
  }
}

/** Carry writable developer metadata fields across the Google boundary. */
export function toDeveloperMetadata(
  metadata: DeveloperMetadataWrite,
): sheets_v4.Schema$DeveloperMetadata {
  return forGoogle({
    metadataId: metadata.metadataId,
    metadataKey: metadata.metadataKey,
    metadataValue: metadata.metadataValue,
    location: metadata.location ? toGoogleDeveloperMetadataLocation(metadata.location) : undefined,
    visibility: metadata.visibility,
  });
}

/** Project REST developer metadata onto the DeveloperMetadata shape, cleaning nulls to undefined. */
export function projectDeveloperMetadata(
  data: sheets_v4.Schema$DeveloperMetadata,
): DeveloperMetadata {
  return {
    metadataId: data.metadataId ?? 0,
    metadataKey: data.metadataKey ?? undefined,
    metadataValue: data.metadataValue ?? undefined,
    location: data.location ? projectDeveloperMetadataLocation(data.location) : undefined,
    visibility: narrow(data.visibility, DeveloperMetadata.shape.visibility.unwrap().options),
  };
}
