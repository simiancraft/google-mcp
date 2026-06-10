import type { sheets_v4 } from '@googleapis/sheets';
import type { DeveloperMetadata } from '../entities/DeveloperMetadata.js';
import { projectDeveloperMetadataLocation } from './filters.js';

/** Project REST developer metadata onto the DeveloperMetadata shape, cleaning nulls to undefined. */
export function projectDeveloperMetadata(
  data: sheets_v4.Schema$DeveloperMetadata,
): DeveloperMetadata {
  return {
    metadataId: data.metadataId ?? 0,
    metadataKey: data.metadataKey ?? undefined,
    metadataValue: data.metadataValue ?? undefined,
    location: data.location ? projectDeveloperMetadataLocation(data.location) : undefined,
    visibility:
      data.visibility === 'DOCUMENT' || data.visibility === 'PROJECT' ? data.visibility : undefined,
  };
}
