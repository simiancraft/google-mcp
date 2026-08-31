import { z } from 'zod';
import { OptionalColor } from './OptionalColor.js';
import { WeightedFontFamily } from './WeightedFontFamily.js';

/**
 * The character styling an agent can set on a range of text: a curated
 * projection of the REST TextStyle (tab, bookmark, and heading links ride
 * with issue #36's tab work). Setting a boolean to false turns the style
 * off; omitting a field leaves the existing style untouched, because the
 * update's field mask is derived from the keys provided.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TextStyle
 */
export const TextStyle = z.strictObject({
  bold: z.boolean().optional().describe('Whether the text is rendered as bold.'),
  italic: z.boolean().optional().describe('Whether the text is italicized.'),
  underline: z.boolean().optional().describe('Whether the text is underlined.'),
  strikethrough: z.boolean().optional().describe('Whether the text is struck through.'),
  smallCaps: z.boolean().optional().describe('Whether the text is in small capital letters.'),
  baselineOffset: z
    .enum(['NONE', 'SUPERSCRIPT', 'SUBSCRIPT'])
    .optional()
    .describe(
      "The text's vertical offset from its normal position; NONE resets a previous offset. Superscript and subscript text is automatically rendered smaller.",
    ),
  fontSize: z
    .number()
    .positive()
    .optional()
    .describe("The size of the text's font, in points (PT is the API's only unit)."),
  foregroundColor: OptionalColor.optional().describe(
    'The foreground color of the text: an RGB color when its color field is set, transparent when unset.',
  ),
  backgroundColor: OptionalColor.optional().describe(
    'The background color of the text: an RGB color when its color field is set, transparent when unset.',
  ),
  weightedFontFamily: WeightedFontFamily.optional().describe(
    'The font family and rendered weight of the text. When set alongside bold, the weighted font family is applied first, then bold.',
  ),
  link: z
    .strictObject({ url: z.string().describe('An external URL.') })
    .optional()
    .describe(
      'The hyperlink destination of the text. Setting a link also updates the foreground color to the default link color and underlines the text, unless those fields are set in the same request.',
    ),
});

export type TextStyle = z.infer<typeof TextStyle>;
