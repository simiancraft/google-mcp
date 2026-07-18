import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';

/**
 * The run format of a cell's text. A projection of the REST `TextFormat`
 * (the link field is not carried).
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
});

export type TextFormat = z.infer<typeof TextFormat>;
