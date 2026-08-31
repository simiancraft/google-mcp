import { z } from 'zod';

/**
 * A particular spot in the document, in zero-based UTF-16 code units. A
 * location addresses the body (the default) or, via `segmentId`, a header,
 * footer, or footnote segment (issue #36's segment addressing; the REST
 * Location's `tabId` stays deferred there): locations without a segment ID
 * address the body of the first tab.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Location
 */
export const Location = z
  .strictObject({
    segmentId: z
      .string()
      .optional()
      .describe(
        "The ID of the header, footer, or footnote the location is in (a headerId, footerId, or footnoteId from get_document). An empty or omitted segment ID signifies the document's body.",
      ),
    index: z
      .number()
      .int()
      .min(0)
      .describe(
        'The zero-based index, in UTF-16 code units, relative to the beginning of the segment. Body content starts at index 1 (index 0 is the initial section break); header, footer, and footnote content starts at index 0. Indices shift on every edit; re-read the document before computing them.',
      ),
  })
  .refine(
    (location) =>
      location.index >= 1 || (location.segmentId !== undefined && location.segmentId !== ''),
    {
      message:
        'index 0 addresses a segment; body locations start at index 1 (index 0 is the initial section break).',
    },
  );

export type Location = z.infer<typeof Location>;
