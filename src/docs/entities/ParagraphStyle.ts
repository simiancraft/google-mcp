import { z } from 'zod';

/**
 * The paragraph styling an agent can set on a range: a curated projection of
 * the REST ParagraphStyle (indents, borders, shading, spacing modes, and
 * direction stay in issue #35). Omitting a field leaves the existing style
 * untouched, because the update's field mask is derived from the keys
 * provided. Setting namedStyleType also resets other paragraph properties to
 * match the named style, mirroring the Docs editor.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#ParagraphStyle
 */
export const ParagraphStyle = z.object({
  namedStyleType: z
    .enum([
      'NORMAL_TEXT',
      'TITLE',
      'SUBTITLE',
      'HEADING_1',
      'HEADING_2',
      'HEADING_3',
      'HEADING_4',
      'HEADING_5',
      'HEADING_6',
    ])
    .optional()
    .describe('The named style type of the paragraph (headings, title, subtitle, normal text).'),
  alignment: z
    .enum(['START', 'CENTER', 'END', 'JUSTIFIED'])
    .optional()
    .describe('The text alignment for the paragraph.'),
  lineSpacing: z
    .number()
    .positive()
    .optional()
    .describe(
      'The amount of space between lines, as a percentage of normal (100 is single-spaced).',
    ),
});

export type ParagraphStyle = z.infer<typeof ParagraphStyle>;
