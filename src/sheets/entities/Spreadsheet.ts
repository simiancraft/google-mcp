import { z } from 'zod';
import { GridRange } from './GridRange.js';
import { NamedRange } from './NamedRange.js';
import { ProtectedRange } from './ProtectedRange.js';
import { SheetProperties } from './SheetProperties.js';
import { SpreadsheetProperties } from './SpreadsheetProperties.js';

/**
 * The read-side shape of a conditional format rule, kept deliberately open:
 * `type` fields are open strings here (the write path is the closed enum in
 * `BooleanCondition` and `InterpolationPoint`) because rules are addressed
 * by array index, so this readout must be total; dropping a rule with an
 * unrecognized upstream value would silently renumber every rule after it.
 */
const ConditionValueReadout = z.object({
  userEnteredValue: z.string().optional().describe('A literal value the condition is based on.'),
  relativeDate: z.string().optional().describe('A date relative to the current date.'),
});

const BooleanConditionReadout = z.object({
  type: z.string().optional().describe('The type of condition.'),
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
  themeColor: z.string().optional().describe("A color from the spreadsheet's theme."),
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
  type: z.string().optional().describe('How the value should be interpreted.'),
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

/**
 * One sheet (tab) in the Spreadsheet projection: its properties, flattened,
 * plus the sheet-level reactive collections (protected ranges and
 * conditional format rules). Grid data is still never carried.
 */
const Sheet = SheetProperties.extend({
  protectedRanges: z
    .array(ProtectedRange)
    .optional()
    .describe(
      'The protected ranges on this sheet; absent when there are none. Each carries the protectedRangeId that update_protected_range and delete_protected_range take.',
    ),
  conditionalFormats: z
    .array(ConditionalFormatRuleReadout)
    .optional()
    .describe(
      'The conditional format rules on this sheet, in rule order; absent when there are none. The array index is the index that update_conditional_format_rule, move_conditional_format_rule, and delete_conditional_format_rule take.',
    ),
});

/**
 * A spreadsheet: the top-level container, identified by `spreadsheetId`, holding
 * properties and one or more sheets. This projection carries metadata and the
 * sheet-level reactive collections (protected ranges, conditional format
 * rules); grid data (per-cell formatting, validation, notes) is never
 * carried, and cell contents flow through the values operations as plain 2D
 * arrays.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets#Spreadsheet
 * @see https://developers.google.com/workspace/sheets/api/guides/concepts
 */
export const Spreadsheet = z.object({
  spreadsheetId: z.string().describe('The ID of the spreadsheet.'),
  spreadsheetUrl: z.string().optional().describe('The url of the spreadsheet.'),
  properties: SpreadsheetProperties.optional().describe('Overall properties of the spreadsheet.'),
  sheets: z
    .array(Sheet)
    .optional()
    .describe(
      'Each sheet (tab) in the spreadsheet, in tab order: its properties plus its protected ranges and conditional format rules.',
    ),
  namedRanges: z
    .array(NamedRange)
    .optional()
    .describe('The named ranges defined in the spreadsheet; absent when there are none.'),
});

export type Spreadsheet = z.infer<typeof Spreadsheet>;
