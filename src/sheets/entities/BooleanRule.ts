import { z } from 'zod';
import { BooleanCondition } from './BooleanCondition.js';
import { CellFormat } from './CellFormat.js';

/**
 * An on/off conditional format: cells matching the condition get the format,
 * cells that stop matching lose it, with no further calls.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#BooleanRule
 */
export const BooleanRule = z.strictObject({
  condition: BooleanCondition.describe(
    'The condition of the rule; cells matching it get the format.',
  ),
  format: CellFormat.describe(
    'The format to apply. Conditional formatting can apply only a subset of formatting: bold, italic, strikethrough, foreground color, and background color.',
  ),
});

export type BooleanRule = z.infer<typeof BooleanRule>;
