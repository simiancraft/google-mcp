import { z } from 'zod';
import { CellData } from '../../entities/CellData.js';
import { GridCoordinate } from '../../entities/GridCoordinate.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to write cells in.'),
    start: GridCoordinate.optional().describe(
      'The coordinate to start writing at; rows may be ragged. Provide exactly one of start or range.',
    ),
    range: GridRange.optional().describe(
      'The range to write to; in the masked fields, cells of the range the rows do not cover are CLEARED. Provide exactly one of start or range.',
    ),
    rows: z
      .array(
        z.strictObject({
          values: z.array(CellData).describe('The cells of the row, one per column.'),
        }),
      )
      .min(1)
      .describe('The rows of cells to write.'),
  }),
  /** The write reply is empty; we confirm the id and the mask applied. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    updatedFields: z
      .string()
      .describe(
        'The CellData field mask that was applied: the union of the fields the provided cells carry.',
      ),
  }),
};
