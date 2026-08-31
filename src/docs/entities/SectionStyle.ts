import { z } from 'zod';
import { SectionColumnProperties } from './SectionColumnProperties.js';

/**
 * The section styling an agent can set: a curated projection of the REST
 * SectionStyle restricted to its unambiguously updatable core (columns,
 * content direction, margins). The header and footer ids are read-only, and
 * sectionType is set at insertion (insert_section_break), not by update;
 * the remaining section fields (page number start, orientation, first-page
 * header toggle) stay with issue #35. Dimension fields ride the fontSize
 * precedent: plain numbers of points here, built into PT Dimensions at the
 * request boundary.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#SectionStyle
 */
export const SectionStyle = z.strictObject({
  columnProperties: z
    .array(SectionColumnProperties)
    .max(3)
    .optional()
    .describe(
      'The columns the section contains, one entry per column (an empty object per column lets Docs compute equal widths). Sections can have at most three columns; when updating, providing an empty list restores the single-column layout, and omitting the field leaves the columns unchanged (the update mask is derived from the provided keys).',
    ),
  columnSeparatorStyle: z
    .enum(['NONE', 'BETWEEN_EACH_COLUMN'])
    .optional()
    .describe(
      'The style of column separators: NONE renders no separator lines, BETWEEN_EACH_COLUMN renders one between each column.',
    ),
  contentDirection: z
    .enum(['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT'])
    .optional()
    .describe(
      'The content direction of the section. Updating it also flips the start and end margins.',
    ),
  marginTop: z
    .number()
    .min(0)
    .optional()
    .describe('The top page margin of the section, in points.'),
  marginBottom: z
    .number()
    .min(0)
    .optional()
    .describe('The bottom page margin of the section, in points.'),
  marginLeft: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The left page margin of the section, in points. Updating it adjusts column style in the section.',
    ),
  marginRight: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The right page margin of the section, in points. Updating it adjusts column style in the section.',
    ),
  marginHeader: z
    .number()
    .min(0)
    .optional()
    .describe('The header margin of the section, in points.'),
  marginFooter: z
    .number()
    .min(0)
    .optional()
    .describe('The footer margin of the section, in points.'),
});

export type SectionStyle = z.infer<typeof SectionStyle>;
