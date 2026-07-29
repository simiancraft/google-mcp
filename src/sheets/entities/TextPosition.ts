import { z } from 'zod';

/**
 * Horizontal positioning for a piece of chart text.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#TextPosition
 */
export const TextPosition = z.strictObject({
  horizontalAlignment: z
    .enum(['LEFT', 'CENTER', 'RIGHT'])
    .optional()
    .describe('The horizontal alignment of the text.'),
});

export type TextPosition = z.infer<typeof TextPosition>;
