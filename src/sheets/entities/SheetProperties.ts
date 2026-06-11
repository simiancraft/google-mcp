import { z } from 'zod';
import { GridProperties } from './GridProperties.js';

/**
 * One sheet (tab) of a spreadsheet, by its properties: identity, title,
 * position, type, and grid dimensions. A projection of the REST
 * `SheetProperties` (tab colors, right-to-left, and data-source properties are
 * not carried).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.sheets#SheetProperties
 */
export const SheetProperties = z.object({
  sheetId: z
    .number()
    .int()
    .describe('The ID of the sheet. Non-negative; cannot be changed once set.'),
  title: z.string().optional().describe('The name of the sheet.'),
  index: z
    .number()
    .int()
    .optional()
    .describe('The index of the sheet within the spreadsheet, zero-based.'),
  sheetType: z
    .enum(['GRID', 'OBJECT', 'DATA_SOURCE'])
    .optional()
    .describe(
      'The type of sheet. GRID holds cells; OBJECT holds a chart or image; DATA_SOURCE mirrors an external data source. Defaults to GRID; cannot be changed once set.',
    ),
  gridProperties: GridProperties.optional().describe(
    'Additional properties of the sheet if this sheet is a grid; absent for object sheets.',
  ),
  hidden: z
    .boolean()
    .optional()
    .describe("True if the sheet is hidden in the UI, false if it's visible."),
});

export type SheetProperties = z.infer<typeof SheetProperties>;
