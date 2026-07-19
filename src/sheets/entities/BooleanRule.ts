import { z } from 'zod';
import { BooleanCondition } from './BooleanCondition.js';
import { ColorStyle } from './ColorStyle.js';

/**
 * The text format subset a conditional format can apply: bold, italic,
 * strikethrough, and foreground color, per BooleanRule's documented limits.
 */
const BooleanRuleTextFormat = z.strictObject({
  foregroundColorStyle: ColorStyle.optional().describe('The foreground color of the text.'),
  bold: z.boolean().optional().describe('True if the text is bold.'),
  italic: z.boolean().optional().describe('True if the text is italicized.'),
  strikethrough: z.boolean().optional().describe('True if the text has a strikethrough.'),
});

/**
 * The format subset a conditional format can apply, narrowed from CellFormat
 * to the five properties BooleanRule documents: bold, italic, strikethrough,
 * foreground color, and background color.
 */
const BooleanRuleFormat = z.strictObject({
  backgroundColorStyle: ColorStyle.optional().describe('The background color of the cell.'),
  textFormat: BooleanRuleTextFormat.optional().describe(
    'The bold, italic, strikethrough, and foreground color of the text.',
  ),
});

/**
 * An on/off conditional format: cells matching the condition get the format,
 * cells that stop matching lose it, with no further calls. The format is the
 * documented conditional-formatting subset, not the full CellFormat.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#BooleanRule
 */
export const BooleanRule = z.strictObject({
  condition: BooleanCondition.describe(
    'The condition of the rule; cells matching it get the format.',
  ),
  format: BooleanRuleFormat.describe(
    'The format to apply. Conditional formatting can apply only a subset of formatting: bold, italic, strikethrough, foreground color, and background color.',
  ),
});

export type BooleanRule = z.infer<typeof BooleanRule>;
