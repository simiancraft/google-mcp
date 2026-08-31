import { z } from 'zod';
import { RgbColor } from './RgbColor.js';

/**
 * A color value; the Docs API expresses every solid color as an RGB triple.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Color
 */
export const Color = z.strictObject({
  rgbColor: RgbColor.describe('The RGB color value.'),
});

export type Color = z.infer<typeof Color>;
