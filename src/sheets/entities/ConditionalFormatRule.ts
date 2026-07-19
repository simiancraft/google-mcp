import { z } from 'zod';
import { BooleanRule } from './BooleanRule.js';
import { GradientRule } from './GradientRule.js';
import { GridRange } from './GridRange.js';

/**
 * A rule describing a conditional format: either a boolean rule (an on/off
 * format gated on a condition) or a gradient rule (a continuous color scale).
 * Provide exactly one of the two. Rules live per sheet in an ordered list
 * and are addressed by index; earlier rules take precedence where rules
 * overlap.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#ConditionalFormatRule
 */
export const ConditionalFormatRule = z.strictObject({
  ranges: z
    .array(GridRange)
    .min(1)
    .describe(
      'The ranges that are formatted if the condition is true; all the ranges must be on the same grid.',
    ),
  booleanRule: BooleanRule.optional().describe(
    'The formatting is either on or off according to the rule; provide this or gradientRule, not both.',
  ),
  gradientRule: GradientRule.optional().describe(
    'The formatting varies based on the gradients in the rule; provide this or booleanRule, not both.',
  ),
});

export type ConditionalFormatRule = z.infer<typeof ConditionalFormatRule>;
