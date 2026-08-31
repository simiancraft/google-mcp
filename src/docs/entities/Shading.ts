import { z } from 'zod';
import { OptionalColor } from './OptionalColor.js';

/**
 * The shading of a paragraph: its background fill.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Shading
 */
export const Shading = z.strictObject({
  backgroundColor: OptionalColor.optional().describe(
    'The background color of the paragraph shading.',
  ),
});

export type Shading = z.infer<typeof Shading>;
