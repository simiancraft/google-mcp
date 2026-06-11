import { z } from 'zod';

/**
 * A contiguous span of document body content, in zero-based UTF-16 code
 * units, end-exclusive. The REST Range's `segmentId` and `tabId` are not
 * exposed (issue #36): ranges address the body of the first tab.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Range
 */
export const Range = z.object({
  startIndex: z
    .number()
    .int()
    .min(1)
    .describe(
      'The zero-based start index of the range, inclusive, in UTF-16 code units. Body content starts at index 1 (index 0 is the initial section break). Indices shift on every edit; re-read the document before computing ranges.',
    ),
  endIndex: z
    .number()
    .int()
    .min(2)
    .describe(
      'The zero-based end index of the range, exclusive, in UTF-16 code units; must be greater than startIndex.',
    ),
});

export type Range = z.infer<typeof Range>;
