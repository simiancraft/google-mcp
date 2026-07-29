import { z } from 'zod';

/**
 * Writable display properties of a row or column.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#DimensionProperties
 */
export const DimensionProperties = z.strictObject({
  hiddenByUser: z.boolean().optional().describe('True if this dimension is explicitly hidden.'),
  pixelSize: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('The height, for a row, or width, for a column, in pixels.'),
});

export type DimensionProperties = z.infer<typeof DimensionProperties>;
