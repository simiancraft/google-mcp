import { z } from 'zod';

/**
 * An RGB color, each channel a fraction from 0 to 1. A projection of the REST
 * `Color` (alpha is not carried; the Sheets editors cannot express it and the
 * API ignores it for solid fills).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#Color
 */
export const Color = z.strictObject({
  red: z.number().min(0).max(1).optional().describe('The amount of red in the color, from 0 to 1.'),
  green: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The amount of green in the color, from 0 to 1.'),
  blue: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The amount of blue in the color, from 0 to 1.'),
});

export type Color = z.infer<typeof Color>;
