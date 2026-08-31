import { z } from 'zod';

/**
 * One block of a document body, in document order: a paragraph, section
 * break, table, or table of contents, addressed by its UTF-16 index range.
 * A projection of the REST StructuralElement: paragraphs flatten to their
 * concatenated run text, tables to their dimensions plus their cell tree
 * (each cell's content recursing into this same shape, so nested tables
 * project too); styles, inline objects, and suggestions are deferred
 * (issue #36). The recursion needs explicit types: zod cannot infer a cycle,
 * so the three shapes are declared by hand and pinned to their schemas.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#StructuralElement
 */
export type StructuralElement = {
  startIndex?: number | undefined;
  endIndex?: number | undefined;
  type?: 'paragraph' | 'sectionBreak' | 'table' | 'tableOfContents' | undefined;
  text?: string | undefined;
  rows?: number | undefined;
  columns?: number | undefined;
  tableRows?: TableRowElement[] | undefined;
};

/**
 * One row of a projected table: its index range and its cells. A projection
 * of the REST TableRow (row styling and suggestions are deferred; issue #36).
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableRow
 */
export type TableRowElement = {
  startIndex?: number | undefined;
  endIndex?: number | undefined;
  cells: TableCellElement[];
};

/**
 * One cell of a projected table: its index range and its content as
 * structural elements, the same shape as the document body, so the text
 * inside a cell is targetable exactly like body text. A projection of the
 * REST TableCell (cell styling and suggestions are deferred; issue #36).
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableCell
 */
export type TableCellElement = {
  startIndex?: number | undefined;
  endIndex?: number | undefined;
  content: StructuralElement[];
};

export const TableCellElement: z.ZodType<TableCellElement> = z.object({
  startIndex: z
    .number()
    .int()
    .optional()
    .describe('The zero-based start index of this cell, in UTF-16 code units.'),
  endIndex: z
    .number()
    .int()
    .optional()
    .describe('The zero-based end index of this cell, exclusive, in UTF-16 code units.'),
  get content() {
    return z
      .array(StructuralElement)
      .describe(
        "The cell's content as structural elements, the same shape as the document body; the paragraph indices inside are what edits targeting the cell's text use.",
      );
  },
});

export const TableRowElement: z.ZodType<TableRowElement> = z.object({
  startIndex: z
    .number()
    .int()
    .optional()
    .describe('The zero-based start index of this row, in UTF-16 code units.'),
  endIndex: z
    .number()
    .int()
    .optional()
    .describe('The zero-based end index of this row, exclusive, in UTF-16 code units.'),
  get cells() {
    return z
      .array(TableCellElement)
      .describe(
        'The contents of each cell in this row. A table may be non-rectangular, so some rows may have a different number of cells than other rows in the same table.',
      );
  },
});

export const StructuralElement: z.ZodType<StructuralElement> = z.object({
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
      "A paragraph's text: its runs concatenated, newline-terminated; absent for non-paragraph elements. Non-text elements (images, footnote references, chips) appear as one U+FFFC placeholder per UTF-16 unit they occupy, so the text length always equals endIndex - startIndex.",
    ),
  rows: z.number().int().optional().describe("A table's row count; absent for non-table elements."),
  columns: z
    .number()
    .int()
    .optional()
    .describe("A table's column count; absent for non-table elements."),
  get tableRows() {
    return z
      .array(TableRowElement)
      .optional()
      .describe(
        "A table's rows, each carrying its cells and their content; absent for non-table elements. Cell content recurses into this same element shape, so nested tables project too.",
      );
  },
});
