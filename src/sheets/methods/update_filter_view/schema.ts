import { z } from 'zod';
import { FilterSpec } from '../../entities/FilterSpec.js';
import { GridRange } from '../../entities/GridRange.js';
import { SortSpec } from '../../entities/SortSpec.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the view.'),
    filterViewId: z.number().int().min(0).describe('The ID of the filter view to update.'),
    title: z.string().optional().describe('A new name for the filter view.'),
    range: GridRange.optional().describe(
      'A new range for the filter view. Provide at most one of range or namedRangeId.',
    ),
    namedRangeId: z
      .string()
      .optional()
      .describe(
        'A named range to back the filter view. Provide at most one of range or namedRangeId.',
      ),
    sortSpecs: z
      .array(SortSpec.required({ dimensionIndex: true, sortOrder: true }))
      .optional()
      .describe('The complete replacement sort specification list.'),
    filterSpecs: z
      .array(FilterSpec)
      .optional()
      .describe('The complete replacement per-column filter specification list.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    filterViewId: z.number().int().describe('The ID of the filter view that was updated.'),
    updatedFields: z.string().describe('The field mask derived from the fields provided.'),
  }),
};
