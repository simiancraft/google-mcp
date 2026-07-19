import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';

/**
 * The run format of a cell's text: color, font, emphasis, and an optional
 * link destination.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#TextFormat
 */
export const TextFormat = z.strictObject({
  foregroundColorStyle: ColorStyle.optional().describe('The foreground color of the text.'),
  fontFamily: z.string().optional().describe('The font family.'),
  fontSize: z.number().int().optional().describe('The size of the font in points.'),
  bold: z.boolean().optional().describe('True if the text is bold.'),
  italic: z.boolean().optional().describe('True if the text is italicized.'),
  strikethrough: z.boolean().optional().describe('True if the text has a strikethrough.'),
  underline: z.boolean().optional().describe('True if the text is underlined.'),
  link: z
    .strictObject({
      uri: z
        .string()
        .describe(
          'The link destination URI; a persisted link is presented to whoever reads the sheet, so do not pass untrusted URIs.',
        ),
    })
    .optional()
    .describe(
      "The link destination of the text; setting it colors and underlines the text like a link unless those fields are set in the same request. At the cell level (userEnteredFormat.textFormat) it sets the cell-level link; in a text format run it clears the cell's previously existing links or a cell-level link set in the same request (runs written together each keep their own link).",
    ),
});

export type TextFormat = z.infer<typeof TextFormat>;
