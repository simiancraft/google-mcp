import { z } from 'zod';
import { StructuralElement } from './StructuralElement.js';

/**
 * The content of one header, footer, or footnote segment: the same
 * structural-element shape as the document body, so segment text is
 * targetable exactly like body text (with the segment's id as `segmentId`,
 * and indices starting at 0). An output-only wrapper over the REST Header,
 * Footer, and Footnote (whose id lives in the map key).
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Header
 */
export const SegmentContent = z.object({
  content: z
    .array(StructuralElement)
    .describe(
      "The segment's structural elements, in order; indices are relative to the segment and start at 0.",
    ),
});

export type SegmentContent = z.infer<typeof SegmentContent>;

/**
 * A document: identity, title, revision, and the body's blocks as text with
 * UTF-16 index ranges, plus its header, footer, and footnote segments keyed
 * by the segmentId that writes address them with. This projection is what an
 * agent needs to read a document and to target edits; the rest of the
 * recursive REST tree (tabs, styles, objects, suggestions) is deferred
 * (issue #36), and the body is the legacy single-tab view.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Document
 * @see https://developers.google.com/workspace/docs/api/concepts/structure
 */
export const Document = z.object({
  documentId: z.string().describe('The ID of the document.'),
  title: z.string().optional().describe('The title of the document.'),
  revisionId: z
    .string()
    .optional()
    .describe('The revision ID of the document; changes with every edit.'),
  content: z
    .array(StructuralElement)
    .optional()
    .describe("The body's structural elements, in document order."),
  headers: z
    .record(z.string(), SegmentContent)
    .optional()
    .describe(
      'The headers in the document, keyed by headerId: the key is the segmentId that insert_text and the styling ranges take to write into that header. Absent when the document has none.',
    ),
  footers: z
    .record(z.string(), SegmentContent)
    .optional()
    .describe(
      'The footers in the document, keyed by footerId: the key is the segmentId that insert_text and the styling ranges take to write into that footer. Absent when the document has none.',
    ),
  footnotes: z
    .record(z.string(), SegmentContent)
    .optional()
    .describe(
      'The footnotes in the document, keyed by footnoteId: the key is the segmentId that insert_text and the styling ranges take to write into that footnote. Absent when the document has none.',
    ),
});

export type Document = z.infer<typeof Document>;
