import { z } from 'zod';
import { DeveloperMetadataLocation } from './DeveloperMetadataLocation.js';

/**
 * A key/value pair attached to a spreadsheet, sheet, row, or column: invisible
 * to users, addressable by tools. Rows and columns keep their metadata as they
 * move, which is what makes metadata-addressed reads and writes robust against
 * sheet edits.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata#DeveloperMetadata
 * @see https://developers.google.com/workspace/sheets/api/guides/metadata
 */
export const DeveloperMetadata = z.object({
  metadataId: z
    .number()
    .int()
    .describe(
      'The spreadsheet-scoped unique ID of the metadata; may be specified at creation, otherwise randomly generated.',
    ),
  metadataKey: z
    .string()
    .optional()
    .describe(
      'The metadata key; multiple entries in a spreadsheet may share a key. Always specified.',
    ),
  metadataValue: z.string().optional().describe("Data associated with the metadata's key."),
  location: DeveloperMetadataLocation.optional().describe(
    'The location where the metadata is associated.',
  ),
  visibility: z
    .enum(['DOCUMENT', 'PROJECT'])
    .optional()
    .describe(
      'The metadata visibility: DOCUMENT is visible to any project, PROJECT only to the creating developer project. Always specified.',
    ),
});

export type DeveloperMetadata = z.infer<typeof DeveloperMetadata>;
