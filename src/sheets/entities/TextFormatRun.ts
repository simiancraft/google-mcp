import { z } from 'zod';
import { TextFormat } from './TextFormat.js';

/**
 * A run of rich text: a format that starts at a character index and
 * continues until the next run. Runs are only valid on user-entered
 * strings, not formulas, booleans, or numbers, and writing a new
 * userEnteredValue erases the cell's previous runs.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#TextFormatRun
 */
export const TextFormatRun = z.strictObject({
  startIndex: z
    .number()
    .int()
    .min(0)
    .describe(
      'The zero-based index this run starts at, measured in UTF-16 code units; text before the first run keeps the cell format.',
    ),
  format: TextFormat.describe(
    "The format of this run; fields not provided inherit the cell's format. A link field spanning the whole cell sets a cell-level hyperlink.",
  ),
});

export type TextFormatRun = z.infer<typeof TextFormatRun>;
