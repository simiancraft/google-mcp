import { z } from 'zod';
import { CellFormat } from './CellFormat.js';
import { ExtendedValue } from './ExtendedValue.js';
import { TextFormatRun } from './TextFormatRun.js';

/**
 * One cell's writable content: its value, note, format, and rich text runs.
 * A curated projection of the REST `CellData`: the read-only fields
 * (effective value and format, formatted value, hyperlink), data validation
 * (which travels through `set_data_validation`), and pivot tables, chip
 * runs, and data-source fields are not carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#CellData
 */
export const CellData = z.strictObject({
  userEnteredValue: ExtendedValue.optional().describe(
    'The value of the cell: at most one of stringValue, numberValue, boolValue, or formulaValue, or empty to clear the value. Writing a new value erases any previous text format runs.',
  ),
  note: z.string().optional().describe('A note on the cell.'),
  userEnteredFormat: CellFormat.optional().describe(
    'The format of the cell; only the format fields provided somewhere in the write are changed, and an untouched format field is never reset.',
  ),
  textFormatRuns: z
    .array(TextFormatRun)
    .optional()
    .describe(
      "Runs of rich text over the cell's string value (per-run bold, color, font, or link, so one cell can mix formats or carry a hyperlink); new runs replace all prior runs.",
    ),
});

export type CellData = z.infer<typeof CellData>;
