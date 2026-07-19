import { z } from 'zod';
import { DeveloperMetadataLocation } from './DeveloperMetadataLocation.js';

const WritableLocation = DeveloperMetadataLocation.omit({ locationType: true }).extend({
  spreadsheet: z
    .literal(true)
    .optional()
    .describe('True to associate the metadata with the entire spreadsheet.'),
});

/**
 * The writable fields used to create developer metadata. The key, location,
 * and visibility are required; the ID and value are optional.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata#DeveloperMetadata
 */
export const DeveloperMetadataInput = z.strictObject({
  metadataId: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('A spreadsheet-scoped ID to assign; omitted, Google generates one.'),
  metadataKey: z.string().describe('The metadata key; developer metadata must have a key.'),
  metadataValue: z.string().optional().describe("Data associated with the metadata's key."),
  location: WritableLocation.describe(
    'The association location. Provide exactly one of spreadsheet: true, sheetId, or dimensionRange. A dimensionRange must specify ROWS or COLUMNS with bounded startIndex and endIndex spanning exactly one row or column.',
  ),
  visibility: z
    .enum(['DOCUMENT', 'PROJECT'])
    .describe(
      'DOCUMENT is accessible from any developer project with document access; PROJECT only from the project that creates it.',
    ),
});

export type DeveloperMetadataInput = z.infer<typeof DeveloperMetadataInput>;
