import { z } from 'zod';
import { StructuralElement } from './StructuralElement.js';

/**
 * A document: identity, title, revision, and the body's blocks as text with
 * UTF-16 index ranges. This projection is what an agent needs to read a
 * document and to target edits; the recursive REST tree (tabs, table cells,
 * styles, objects, suggestions) is deferred (issue #36), and the body is the
 * legacy single-tab view.
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
});

export type Document = z.infer<typeof Document>;
