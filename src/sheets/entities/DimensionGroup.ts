import { z } from 'zod';
import { DimensionRange } from './DimensionRange.js';

/**
 * A group over an interval of rows or columns on a sheet. Groups can contain
 * other groups and can be collapsed or expanded as a unit.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#DimensionGroup
 */
export const DimensionGroup = z.strictObject({
  range: DimensionRange.describe('The range over which this group exists.'),
  depth: z
    .number()
    .int()
    .min(0)
    .describe(
      'The group depth: the number of groups whose ranges wholly contain this group range.',
    ),
  collapsed: z
    .boolean()
    .optional()
    .describe(
      'True if this group is collapsed. Updating this value also hides every dimension in the group when true, or reveals every dimension in the group when false.',
    ),
});

export type DimensionGroup = z.infer<typeof DimensionGroup>;
