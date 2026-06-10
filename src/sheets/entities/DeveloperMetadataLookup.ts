import { z } from 'zod';
import { DeveloperMetadataLocation } from './DeveloperMetadataLocation.js';

/**
 * Criteria for selecting developer metadata: by id, key, value, visibility,
 * and/or location. Fields combine conjunctively; an empty lookup matches all
 * metadata the caller can see.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata#DeveloperMetadataLookup
 */
export const DeveloperMetadataLookup = z.object({
  locationType: z
    .enum(['ROW', 'COLUMN', 'SHEET', 'SPREADSHEET'])
    .optional()
    .describe('Limits the selection to metadata associated with locations of the specified type.'),
  metadataLocation: DeveloperMetadataLocation.optional().describe(
    'Limits the selection to metadata associated with the specified location, matched exactly or by intersection per locationMatchingStrategy.',
  ),
  locationMatchingStrategy: z
    .enum(['EXACT_LOCATION', 'INTERSECTING_LOCATION'])
    .optional()
    .describe(
      'How the lookup matches the location: only the exact location, or every intersecting location. Defaults to intersecting.',
    ),
  metadataId: z
    .number()
    .int()
    .optional()
    .describe('Limits the selection to metadata with a matching metadataId.'),
  metadataKey: z
    .string()
    .optional()
    .describe('Limits the selection to metadata with a matching metadataKey.'),
  metadataValue: z
    .string()
    .optional()
    .describe('Limits the selection to metadata with a matching metadataValue.'),
  visibility: z
    .enum(['DOCUMENT', 'PROJECT'])
    .optional()
    .describe(
      'Limits the selection to metadata with a matching visibility; unspecified, all metadata visible to the calling project matches.',
    ),
});

export type DeveloperMetadataLookup = z.infer<typeof DeveloperMetadataLookup>;
