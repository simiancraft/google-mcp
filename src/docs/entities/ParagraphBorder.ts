import { z } from 'zod';
import { OptionalColor } from './OptionalColor.js';

/**
 * A border around a paragraph edge: color, width and padding in points, and
 * dash style. Widths and paddings ride the fontSize precedent: plain numbers
 * of points here, built into PT Dimensions at the request boundary (PT is the
 * API's only unit).
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#ParagraphBorder
 */
export const ParagraphBorder = z
  .strictObject({
    color: OptionalColor.optional().describe('The color of the border.'),
    width: z.number().min(0).optional().describe('The width of the border, in points.'),
    padding: z.number().min(0).optional().describe('The padding of the border, in points.'),
    dashStyle: z
      .enum(['SOLID', 'DOT', 'DASH'])
      .optional()
      .describe('The dash style of the border.'),
  })
  // An empty border object would put the key in the derived field mask with no
  // value, which makes Google RESET the border — the exact mask/value desync
  // the one-source-object shape exists to prevent, so it rejects here.
  .refine((border) => Object.keys(border).length > 0, {
    message: 'Provide at least one of color, width, padding, dashStyle.',
  });

export type ParagraphBorder = z.infer<typeof ParagraphBorder>;
