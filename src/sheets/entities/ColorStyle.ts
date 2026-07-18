import { z } from 'zod';
import { Color } from './Color.js';

/**
 * A color value: either a concrete RGB color or a reference to one of the
 * spreadsheet theme's colors. Provide exactly one of the two fields; if both
 * are set, the RGB color wins.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#ColorStyle
 */
export const ColorStyle = z.strictObject({
  rgbColor: Color.optional().describe('A concrete RGB color.'),
  themeColor: z
    .enum([
      'TEXT',
      'BACKGROUND',
      'ACCENT1',
      'ACCENT2',
      'ACCENT3',
      'ACCENT4',
      'ACCENT5',
      'ACCENT6',
      'LINK',
    ])
    .optional()
    .describe("A color from the spreadsheet's theme."),
});

export type ColorStyle = z.infer<typeof ColorStyle>;
