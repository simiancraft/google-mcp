import { z } from 'zod';

/**
 * One block of a document body, in document order: a paragraph, section
 * break, table, or table of contents, addressed by its UTF-16 index range.
 * A projection of the REST StructuralElement: paragraphs flatten to their
 * concatenated run text, tables to their dimensions; the full recursive
 * trees (cells, styles, inline objects, suggestions) are deferred (issue #36).
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#StructuralElement
 */
export const StructuralElement = z.object({
  startIndex: z
    .number()
    .int()
    .optional()
    .describe(
      'The zero-based start index of this element, in UTF-16 code units. Indices shift on every edit; re-read the document before computing new ranges.',
    ),
  endIndex: z
    .number()
    .int()
    .optional()
    .describe('The zero-based end index of this element, exclusive, in UTF-16 code units.'),
  type: z
    .enum(['paragraph', 'sectionBreak', 'table', 'tableOfContents'])
    .optional()
    .describe(
      'Which kind of block this is; absent for a structural kind this server does not know (the indices still address it).',
    ),
  text: z
    .string()
    .optional()
    .describe(
      "A paragraph's text: its runs concatenated, newline-terminated; absent for non-paragraph elements.",
    ),
  rows: z.number().int().optional().describe("A table's row count; absent for non-table elements."),
  columns: z
    .number()
    .int()
    .optional()
    .describe("A table's column count; absent for non-table elements."),
});

export type StructuralElement = z.infer<typeof StructuralElement>;
