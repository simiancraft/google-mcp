import { z } from 'zod';
import { DimensionProperties } from '../../entities/DimensionProperties.js';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    range: DimensionRange.required({ sheetId: true, dimension: true }).describe(
      'The rows or columns whose properties should change. sheetId and dimension are required; omitted indexes leave that side unbounded.',
    ),
    properties: DimensionProperties.describe(
      'The dimension properties to update; only the fields provided change.',
    ),
  }),
  /** The update reply is empty; confirm the spreadsheet and exact mask applied. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    updatedFields: z
      .string()
      .describe('The field mask applied, one path per provided dimension property.'),
  }),
};
