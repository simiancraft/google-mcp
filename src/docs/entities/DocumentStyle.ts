import { z } from 'zod';
import { OptionalColor } from './OptionalColor.js';

/**
 * The document-wide styling an agent can set: a curated projection of the
 * REST DocumentStyle restricted to its writable fields. The header and
 * footer ids and useCustomHeaderFooterMargins are read-only and stay in the
 * REST entity (issue #36's read work). Dimension fields ride the fontSize
 * precedent: plain numbers of points here, built into PT Dimensions at the
 * request boundary.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#DocumentStyle
 */
export const DocumentStyle = z.strictObject({
  marginTop: z.number().min(0).optional().describe('The top page margin, in points.'),
  marginBottom: z.number().min(0).optional().describe('The bottom page margin, in points.'),
  marginLeft: z
    .number()
    .min(0)
    .optional()
    .describe('The left page margin, in points. Updating it adjusts column style in all sections.'),
  marginRight: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The right page margin, in points. Updating it adjusts column style in all sections.',
    ),
  marginHeader: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The amount of space between the top of the page and the contents of the header, in points. Writing it makes the document use custom header and footer margins.',
    ),
  marginFooter: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The amount of space between the bottom of the page and the contents of the footer, in points. Writing it makes the document use custom header and footer margins.',
    ),
  pageSize: z
    .strictObject({
      height: z.number().positive().describe('The page height, in points.'),
      width: z.number().positive().describe('The page width, in points.'),
    })
    .optional()
    .describe('The size of a page in the document.'),
  pageNumberStart: z
    .number()
    .int()
    .optional()
    .describe('The page number from which to start counting the number of pages.'),
  useFirstPageHeaderFooter: z
    .boolean()
    .optional()
    .describe(
      'Whether to use the first-page header and footer ids for the first page of the document.',
    ),
  useEvenPageHeaderFooter: z
    .boolean()
    .optional()
    .describe('Whether to use the even-page header and footer ids for even pages of the document.'),
  flipPageOrientation: z
    .boolean()
    .optional()
    .describe(
      'Whether to flip the dimensions of pageSize, changing the page orientation between portrait and landscape.',
    ),
  background: z
    .strictObject({
      color: OptionalColor.describe(
        'The background color; documents cannot have a transparent background, so the color field must be set.',
      ),
    })
    .optional()
    .describe('The background of the document.'),
});

export type DocumentStyle = z.infer<typeof DocumentStyle>;
