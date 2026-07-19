import { z } from 'zod';
import { GridRange } from './GridRange.js';

/**
 * The read-side shape of a conditional format rule, kept deliberately open:
 * `type` and color-vocabulary fields are open strings here (the write path
 * is the closed enum in `BooleanCondition`, `InterpolationPoint`, and
 * `ColorStyle`) because rules are addressed by array index, so this readout
 * must be total; dropping a rule with an unrecognized upstream value would
 * silently renumber every rule after it.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#ConditionalFormatRule
 */
const ConditionValueReadout = z.object({
  userEnteredValue: z
    .string()
    .optional()
    .describe(
      'The value the condition is based on, as entered; may be a live formula beginning with = or +.',
    ),
  relativeDate: z
    .string()
    .optional()
    .describe(
      'A date relative to the current date; the write vocabulary is PAST_YEAR, PAST_MONTH, PAST_WEEK, YESTERDAY, TODAY, or TOMORROW.',
    ),
});

const BooleanConditionReadout = z.object({
  type: z
    .string()
    .optional()
    .describe(
      "The type of condition, from the write path's ConditionType vocabulary (NUMBER_GREATER, TEXT_CONTAINS, DATE_BEFORE, CUSTOM_FORMULA, ...).",
    ),
  values: z.array(ConditionValueReadout).optional().describe('The values of the condition.'),
});

const ColorStyleReadout = z.object({
  rgbColor: z
    .object({
      red: z.number().optional().describe('The red channel, 0 to 1.'),
      green: z.number().optional().describe('The green channel, 0 to 1.'),
      blue: z.number().optional().describe('The blue channel, 0 to 1.'),
    })
    .optional()
    .describe('A concrete RGB color.'),
  themeColor: z
    .string()
    .optional()
    .describe(
      "A color from the spreadsheet's theme; the write vocabulary is TEXT, BACKGROUND, ACCENT1 through ACCENT6, or LINK.",
    ),
});

const BooleanRuleReadout = z.object({
  condition: BooleanConditionReadout.optional().describe('The condition of the rule.'),
  format: z
    .object({
      backgroundColorStyle: ColorStyleReadout.optional().describe('The background color.'),
      textFormat: z
        .object({
          foregroundColorStyle: ColorStyleReadout.optional().describe('The text color.'),
          bold: z.boolean().optional().describe('True if the text is bold.'),
          italic: z.boolean().optional().describe('True if the text is italicized.'),
          strikethrough: z.boolean().optional().describe('True if the text is struck through.'),
        })
        .optional()
        .describe('The text format the rule applies.'),
    })
    .optional()
    .describe('The format the rule applies.'),
});

const InterpolationPointReadout = z.object({
  colorStyle: ColorStyleReadout.optional().describe('The color of this interpolation point.'),
  type: z
    .string()
    .optional()
    .describe(
      'How the value should be interpreted; the write vocabulary is MIN, MAX, NUMBER, PERCENT, or PERCENTILE.',
    ),
  value: z.string().optional().describe('The value this interpolation point uses.'),
});

const GradientRuleReadout = z.object({
  minpoint: InterpolationPointReadout.optional().describe('The starting interpolation point.'),
  midpoint: InterpolationPointReadout.optional().describe('The midway interpolation point.'),
  maxpoint: InterpolationPointReadout.optional().describe('The final interpolation point.'),
});

/** One conditional format rule as read back from a sheet. */
export const ConditionalFormatRuleReadout = z.object({
  ranges: z.array(GridRange).optional().describe('The ranges the rule formats.'),
  booleanRule: BooleanRuleReadout.optional().describe('An on/off rule, if this rule is one.'),
  gradientRule: GradientRuleReadout.optional().describe('A gradient rule, if this rule is one.'),
});

export type ConditionalFormatRuleReadout = z.infer<typeof ConditionalFormatRuleReadout>;
