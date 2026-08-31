import { z } from 'zod';

/**
 * The row styling an agent can set on table rows. Point-valued fields ride
 * the fontSize precedent: plain numbers of points here, built into PT
 * Dimensions at the request boundary (PT is the API's only unit). Omitting a
 * field leaves the existing style untouched, because the update's field mask
 * is derived from the keys provided.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableRowStyle
 */
export const TableRowStyle = z.strictObject({
  minRowHeight: z
    .number()
    .min(0)
    .optional()
    .describe(
      "The minimum height of the row, in points. The row will be rendered at a height equal to or greater than this value in order to show all the content in the row's cells.",
    ),
  tableHeader: z.boolean().optional().describe('Whether the row is a table header.'),
  preventOverflow: z
    .boolean()
    .optional()
    .describe('Whether the row cannot overflow across page or column boundaries.'),
});

export type TableRowStyle = z.infer<typeof TableRowStyle>;
