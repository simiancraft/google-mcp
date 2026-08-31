import { z } from 'zod';

/**
 * A contiguous span of document content, in zero-based UTF-16 code units,
 * end-exclusive. A range addresses the body (the default) or, via
 * `segmentId`, a header, footer, or footnote segment (issue #36's segment
 * addressing; the REST Range's `tabId` stays deferred there): ranges without
 * a segment ID address the body of the first tab.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Range
 */
export const Range = z
  .strictObject({
    segmentId: z
      .string()
      .optional()
      .describe(
        "The ID of the header, footer, or footnote this range is contained in (a headerId, footerId, or footnoteId from get_document). An empty or omitted segment ID signifies the document's body.",
      ),
    startIndex: z
      .number()
      .int()
      .min(0)
      .describe(
        'The zero-based start index of the range, inclusive, in UTF-16 code units, relative to the beginning of the segment. Body content starts at index 1 (index 0 is the initial section break); header, footer, and footnote content starts at index 0. Indices shift on every edit; re-read the document before computing ranges.',
      ),
    endIndex: z
      .number()
      .int()
      .min(1)
      .describe(
        'The zero-based end index of the range, exclusive, in UTF-16 code units; must be greater than startIndex.',
      ),
  })
  .refine((range) => range.endIndex > range.startIndex, {
    message: 'endIndex must be greater than startIndex.',
  })
  .refine(
    (range) => range.startIndex >= 1 || (range.segmentId !== undefined && range.segmentId !== ''),
    {
      message:
        'startIndex 0 addresses a segment; body ranges start at index 1 (index 0 is the initial section break).',
    },
  );

export type Range = z.infer<typeof Range>;
