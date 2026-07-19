import { z } from 'zod';
import { ConditionalFormatRuleReadout } from './ConditionalFormatRuleReadout.js';
import { GridRange } from './GridRange.js';
import { NamedRange } from './NamedRange.js';
import { ProtectedRange } from './ProtectedRange.js';
import { SheetProperties } from './SheetProperties.js';
import { SpreadsheetProperties } from './SpreadsheetProperties.js';

/**
 * One sheet (tab) in the Spreadsheet projection: its properties, flattened,
 * plus the sheet-level collections (protected ranges, conditional format
 * rules, merged ranges). Grid data is still never carried.
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
  merges: z
    .array(GridRange)
    .optional()
    .describe(
      'The merged ranges on this sheet; absent when there are none. Each merge renders only its upper-left value.',
    ),
});

/**
 * A spreadsheet: the top-level container, identified by `spreadsheetId`, holding
 * properties and one or more sheets. This projection carries metadata and the
 * sheet-level collections (protected ranges, conditional format rules,
 * merged ranges); grid data (per-cell formatting, validation, notes) is
 * never carried, cell values flow through the values operations as plain 2D
 * arrays, and update_cells writes structured cell content.
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
      'Each sheet (tab) in the spreadsheet, in tab order: its properties plus its protected ranges, conditional format rules, and merged ranges.',
    ),
  namedRanges: z
    .array(NamedRange)
    .optional()
    .describe('The named ranges defined in the spreadsheet; absent when there are none.'),
});

export type Spreadsheet = z.infer<typeof Spreadsheet>;
