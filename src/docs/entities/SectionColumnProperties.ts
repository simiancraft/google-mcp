import { z } from 'zod';

/**
 * Properties of one column in a multi-column section. Dimension fields ride
 * the fontSize precedent: plain numbers of points here, built into PT
 * Dimensions at the request boundary.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#SectionColumnProperties
 */
export const SectionColumnProperties = z.strictObject({
  width: z.number().positive().optional().describe('The width of the column, in points.'),
  paddingEnd: z
    .number()
    .min(0)
    .optional()
    .describe('The padding at the end of the column, in points.'),
});

export type SectionColumnProperties = z.infer<typeof SectionColumnProperties>;
