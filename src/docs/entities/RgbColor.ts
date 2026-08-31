import { z } from 'zod';

/**
 * A solid RGB color. Components are floats from 0.0 to 1.0; a missing
 * component reads as 0.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#RgbColor
 */
export const RgbColor = z.strictObject({
  red: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The red component of the color, from 0.0 to 1.0.'),
  green: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The green component of the color, from 0.0 to 1.0.'),
  blue: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The blue component of the color, from 0.0 to 1.0.'),
});

export type RgbColor = z.infer<typeof RgbColor>;
