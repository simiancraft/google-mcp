import { z } from 'zod';
import { DimensionRange } from './DimensionRange.js';

/**
 * Where a piece of developer metadata is attached: the whole spreadsheet, one
 * sheet, or a single row or column (as a one-wide dimension range).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata#DeveloperMetadataLocation
 */
export const DeveloperMetadataLocation = z.object({
  locationType: z
    .enum(['ROW', 'COLUMN', 'SHEET', 'SPREADSHEET'])
    .optional()
    .describe('The type of location this object represents. Read-only.'),
  spreadsheet: z
    .boolean()
    .optional()
    .describe('True when metadata is associated with an entire spreadsheet.'),
  sheetId: z
    .number()
    .int()
    .optional()
    .describe('The ID of the sheet when metadata is associated with an entire sheet.'),
  dimensionRange: DimensionRange.optional().describe(
    'The row or column when metadata is associated with a dimension; must represent a single row or column.',
  ),
});

export type DeveloperMetadataLocation = z.infer<typeof DeveloperMetadataLocation>;
