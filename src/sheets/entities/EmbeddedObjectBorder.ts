import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';

/**
 * A border along an embedded object.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#EmbeddedObjectBorder
 */
export const EmbeddedObjectBorder = z.strictObject({
  colorStyle: ColorStyle.optional().describe('The color of the embedded object border.'),
});

export type EmbeddedObjectBorder = z.infer<typeof EmbeddedObjectBorder>;
