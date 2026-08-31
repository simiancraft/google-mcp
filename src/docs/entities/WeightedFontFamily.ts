import { z } from 'zod';

/**
 * The font family and rendered weight of a run of text. The rendered weight
 * combines with `bold`: bold text renders at least 700, at least 400
 * otherwise; non-bold text renders at exactly this weight.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#WeightedFontFamily
 */
export const WeightedFontFamily = z.strictObject({
  fontFamily: z
    .string()
    .min(1)
    .describe(
      'The font family of the text: any font from the Font menu in Docs or from Google Fonts. An unrecognized font name renders as Arial.',
    ),
  weight: z
    .number()
    .int()
    .min(100)
    .max(900)
    .multipleOf(100)
    .optional()
    .describe(
      'The weight of the font: a multiple of 100 between 100 and 900 inclusive (the CSS numerical weights). Defaults to 400 (normal).',
    ),
});

export type WeightedFontFamily = z.infer<typeof WeightedFontFamily>;
