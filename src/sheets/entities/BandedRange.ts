import { z } from 'zod';
import { BandingProperties } from './BandingProperties.js';
import { GridRange } from './GridRange.js';

/**
 * A range in a sheet with alternating row or column colors.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#BandedRange
 */
export const BandedRange = z.strictObject({
  bandedRangeId: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'The ID of the banded range, used to update or delete it. If absent, use bandedRangeReference to identify the readout.',
    ),
  bandedRangeReference: z
    .string()
    .optional()
    .describe(
      'An output-only reference for a banded range whose identity is not supported by bandedRangeId.',
    ),
  range: GridRange.optional().describe('The range over which the banding properties apply.'),
  rowProperties: BandingProperties.optional().describe(
    'Banding applied row by row. Header and footer colors take priority over band colors, first-band colors take priority over second-band colors, then row properties take priority over column properties.',
  ),
  columnProperties: BandingProperties.optional().describe(
    'Banding applied column by column. At least one of rowProperties or columnProperties is required when adding a banded range; a column header or first band can override a lower-priority row band.',
  ),
});

export type BandedRange = z.infer<typeof BandedRange>;
