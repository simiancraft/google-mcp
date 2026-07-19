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
  /** The update reply is empty; echo the affected range, applied values, and exact mask. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    range: DimensionRange.required({ sheetId: true, dimension: true }).describe(
      'The affected dimension range, including its sheet, dimension, and any provided bounds.',
    ),
    properties: DimensionProperties.describe(
      'The property values applied to the range, exactly as provided.',
    ),
    updatedFields: z
      .string()
      .describe('The field mask applied, one path per provided dimension property.'),
  }),
};
