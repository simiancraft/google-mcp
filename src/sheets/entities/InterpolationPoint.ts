import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';

/**
 * A single point on a gradient scale: a color pinned to a value (an exact
 * number, a percent, a percentile, or the range's min or max).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#InterpolationPoint
 */
export const InterpolationPoint = z.strictObject({
  colorStyle: ColorStyle.describe('The color this interpolation point should use.'),
  type: z
    .enum(['MIN', 'MAX', 'NUMBER', 'PERCENT', 'PERCENTILE'])
    .describe(
      'How the value should be interpreted: MIN and MAX read the range itself, NUMBER uses the value exactly, PERCENT and PERCENTILE compute it across the range.',
    ),
  value: z
    .string()
    .optional()
    .describe(
      'The value this interpolation point uses; may be a formula. Unused when the type is MIN or MAX.',
    ),
});

export type InterpolationPoint = z.infer<typeof InterpolationPoint>;
