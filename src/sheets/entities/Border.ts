import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';

/**
 * One border of a cell or range: a stroke style plus an optional color.
 * Style NONE erases the border.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#Border
 */
export const Border = z.strictObject({
  style: z
    .enum(['DOTTED', 'DASHED', 'SOLID', 'SOLID_MEDIUM', 'SOLID_THICK', 'DOUBLE', 'NONE'])
    .describe('The style of the border; NONE erases it.'),
  colorStyle: ColorStyle.optional().describe('The color of the border; defaults to black.'),
});

export type Border = z.infer<typeof Border>;
