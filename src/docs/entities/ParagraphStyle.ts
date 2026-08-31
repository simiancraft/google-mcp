import { z } from 'zod';
import { ParagraphBorder } from './ParagraphBorder.js';
import { Shading } from './Shading.js';

/**
 * The paragraph styling an agent can set on a range: a curated projection of
 * the REST ParagraphStyle (tab stops and the heading id stay with issue #36).
 * Omitting a field leaves the existing style untouched, because the update's
 * field mask is derived from the keys provided. Setting namedStyleType also
 * resets other paragraph properties to match the named style, mirroring the
 * Docs editor. Dimension fields ride the fontSize precedent: plain numbers of
 * points here, built into PT Dimensions at the request boundary.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#ParagraphStyle
 */
export const ParagraphStyle = z.strictObject({
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
  direction: z
    .enum(['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT'])
    .optional()
    .describe(
      'The text direction of the paragraph. Direction is not inherited, so an unset value reads as LEFT_TO_RIGHT.',
    ),
  spacingMode: z
    .enum(['NEVER_COLLAPSE', 'COLLAPSE_LISTS'])
    .optional()
    .describe(
      'The spacing mode for the paragraph: NEVER_COLLAPSE always renders the space between paragraphs, COLLAPSE_LISTS skips it between list elements.',
    ),
  spaceAbove: z
    .number()
    .min(0)
    .optional()
    .describe('The amount of extra space above the paragraph, in points.'),
  spaceBelow: z
    .number()
    .min(0)
    .optional()
    .describe('The amount of extra space below the paragraph, in points.'),
  indentFirstLine: z
    .number()
    .min(0)
    .optional()
    .describe('The amount to indent the first line of the paragraph, in points.'),
  indentStart: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The amount to indent the paragraph on the side that corresponds to the start of the text, in points.',
    ),
  indentEnd: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The amount to indent the paragraph on the side that corresponds to the end of the text, in points.',
    ),
  keepLinesTogether: z
    .boolean()
    .optional()
    .describe(
      'Whether all lines of the paragraph should be laid out on the same page if possible.',
    ),
  keepWithNext: z
    .boolean()
    .optional()
    .describe(
      'Whether at least part of the paragraph should be laid out on the same page as the next paragraph if possible.',
    ),
  avoidWidowAndOrphan: z
    .boolean()
    .optional()
    .describe('Whether to avoid widows and orphans for the paragraph.'),
  pageBreakBefore: z
    .boolean()
    .optional()
    .describe('Whether the current paragraph should always start at the beginning of a page.'),
  borderBetween: ParagraphBorder.optional().describe(
    'The border between this paragraph and the next and previous paragraphs, rendered when the adjacent paragraph has the same border and indent properties.',
  ),
  borderTop: ParagraphBorder.optional().describe(
    'The border at the top of the paragraph, rendered when the paragraph above has different border and indent properties.',
  ),
  borderBottom: ParagraphBorder.optional().describe(
    'The border at the bottom of the paragraph, rendered when the paragraph below has different border and indent properties.',
  ),
  borderLeft: ParagraphBorder.optional().describe('The border to the left of the paragraph.'),
  borderRight: ParagraphBorder.optional().describe('The border to the right of the paragraph.'),
  shading: Shading.optional().describe('The shading of the paragraph: its background fill.'),
});

export type ParagraphStyle = z.infer<typeof ParagraphStyle>;
