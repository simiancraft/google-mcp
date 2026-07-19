import { z } from 'zod';
import { NamedRange } from './NamedRange.js';
import { SheetProperties } from './SheetProperties.js';
import { SpreadsheetProperties } from './SpreadsheetProperties.js';

/**
 * A spreadsheet: the top-level container, identified by `spreadsheetId`, holding
 * properties and one or more sheets. This projection is metadata-only: each REST
 * `Sheet` is flattened to its `SheetProperties`, and grid data (per-cell
 * formatting, validation, notes) is never carried; cell contents flow through
 * the values operations as plain 2D arrays.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets#Spreadsheet
 * @see https://developers.google.com/workspace/sheets/api/guides/concepts
 */
export const Spreadsheet = z.object({
  spreadsheetId: z.string().describe('The ID of the spreadsheet.'),
  spreadsheetUrl: z.string().optional().describe('The url of the spreadsheet.'),
  properties: SpreadsheetProperties.optional().describe('Overall properties of the spreadsheet.'),
  sheets: z
    .array(SheetProperties)
    .optional()
    .describe('The properties of each sheet (tab) in the spreadsheet, in tab order.'),
  namedRanges: z
    .array(NamedRange)
    .optional()
    .describe('The named ranges defined in the spreadsheet; absent when there are none.'),
});

export type Spreadsheet = z.infer<typeof Spreadsheet>;
