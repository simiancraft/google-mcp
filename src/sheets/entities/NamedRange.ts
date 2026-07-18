import { z } from 'zod';
import { GridRange } from './GridRange.js';

/**
 * A named range: a name that formulas and reads can use in place of a grid
 * range, so `=REFI_MODE` works where `=INPUTS!B38` would. Renaming or moving
 * the range updates every formula that references it.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#NamedRange
 */
export const NamedRange = z.object({
  namedRangeId: z.string().optional().describe('The ID of the named range.'),
  name: z.string().optional().describe('The name of the range.'),
  range: GridRange.optional().describe('The range this name refers to.'),
});

export type NamedRange = z.infer<typeof NamedRange>;
