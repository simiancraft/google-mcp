import { z } from 'zod';
import { DeveloperMetadataLookup } from './DeveloperMetadataLookup.js';
import { GridRange } from './GridRange.js';

/**
 * One way of selecting data in a spreadsheet: an A1 range, a structural grid
 * range, or a developer-metadata lookup. Exactly one selector should be set.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/DataFilter
 */
export const DataFilter = z.strictObject({
  a1Range: z.string().optional().describe('Selects data that matches the specified A1 range.'),
  gridRange: GridRange.optional().describe(
    'Selects data that matches the range described by the GridRange.',
  ),
  developerMetadataLookup: DeveloperMetadataLookup.optional().describe(
    'Selects data associated with the developer metadata matching the criteria of this lookup.',
  ),
});

export type DataFilter = z.infer<typeof DataFilter>;
