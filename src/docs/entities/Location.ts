import { z } from 'zod';

/**
 * A particular spot in the document body, in zero-based UTF-16 code units.
 * The REST Location's `segmentId` and `tabId` are not exposed (issue #36):
 * locations address the body of the first tab.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Location
 */
export const Location = z.strictObject({
  index: z
    .number()
    .int()
    .min(1)
    .describe(
      'The zero-based index, in UTF-16 code units (body content starts at index 1). Indices shift on every edit; re-read the document before computing them.',
    ),
});

export type Location = z.infer<typeof Location>;
