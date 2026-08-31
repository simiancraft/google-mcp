import { z } from 'zod';

/**
 * The properties an agent can set on table columns: the width type and, for
 * fixed-width columns, the width in points (the fontSize precedent: a plain
 * number here, a PT Dimension on the wire). Omitting a field leaves the
 * existing property untouched, because the update's field mask is derived
 * from the keys provided.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableColumnProperties
 */
export const TableColumnProperties = z.strictObject({
  widthType: z
    .enum(['EVENLY_DISTRIBUTED', 'FIXED_WIDTH'])
    .optional()
    .describe(
      'The width type of the column: EVENLY_DISTRIBUTED shares the usable width equally across such columns, FIXED_WIDTH takes the width field.',
    ),
  width: z
    .number()
    .min(5)
    .optional()
    .describe(
      "The width of the column, in points; set when the column's widthType is FIXED_WIDTH. A width of less than 5 points (5/72 inch) returns a 400 bad request error.",
    ),
});

export type TableColumnProperties = z.infer<typeof TableColumnProperties>;
