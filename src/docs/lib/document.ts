import type { docs_v1 } from '@googleapis/docs';
import type { Document } from '../entities/Document.js';
import type {
  StructuralElement,
  TableCellElement,
  TableRowElement,
} from '../entities/StructuralElement.js';

/**
 * Concatenate a paragraph's elements into index-faithful text: text runs
 * verbatim, and every non-text element (inline object, footnote reference,
 * chip, rule, ...) as one U+FFFC placeholder per UTF-16 unit it occupies, so
 * `text.length` always equals `endIndex - startIndex` and offsets into the
 * text can be added to `startIndex` to target edits.
 */
function paragraphText(paragraph: docs_v1.Schema$Paragraph): string {
  return (paragraph.elements ?? [])
    .map((element) => {
      if (element.textRun) {
        return element.textRun.content ?? '';
      }
      const span = (element.endIndex ?? 0) - (element.startIndex ?? 0);
      return span > 0 ? '\uFFFC'.repeat(span) : '';
    })
    .join('');
}

/** Project one REST table cell: indices plus its content, recursively. */
function projectTableCell(cell: docs_v1.Schema$TableCell): TableCellElement {
  return {
    startIndex: cell.startIndex ?? undefined,
    endIndex: cell.endIndex ?? undefined,
    content: (cell.content ?? []).map(projectStructuralElement),
  };
}

/** Project one REST table row: indices plus its cells. */
function projectTableRow(row: docs_v1.Schema$TableRow): TableRowElement {
  return {
    startIndex: row.startIndex ?? undefined,
    endIndex: row.endIndex ?? undefined,
    cells: (row.tableCells ?? []).map(projectTableCell),
  };
}

/**
 * Project one REST structural element: indices plus kind, paragraph text, and
 * for tables the dimensions and the cell tree (cell content recurses into
 * this same projector, so nested tables project too). An element of a kind
 * this server does not know keeps its indices and drops the rest (the
 * enum-or-drop policy applied to a discriminator), so edits can still be
 * targeted around it.
 */
export function projectStructuralElement(
  element: docs_v1.Schema$StructuralElement,
): StructuralElement {
  const base = {
    startIndex: element.startIndex ?? undefined,
    endIndex: element.endIndex ?? undefined,
  };
  if (element.paragraph) {
    return { ...base, type: 'paragraph', text: paragraphText(element.paragraph) };
  }
  if (element.table) {
    return {
      ...base,
      type: 'table',
      rows: element.table.rows ?? undefined,
      columns: element.table.columns ?? undefined,
      tableRows: element.table.tableRows ? element.table.tableRows.map(projectTableRow) : undefined,
    };
  }
  if (element.sectionBreak) {
    return { ...base, type: 'sectionBreak' };
  }
  if (element.tableOfContents) {
    return { ...base, type: 'tableOfContents' };
  }
  return base;
}

/** Project a REST document onto the text-with-indices Document shape, cleaning nulls. */
export function projectDocument(data: docs_v1.Schema$Document): Document {
  return {
    documentId: data.documentId ?? '',
    title: data.title ?? undefined,
    revisionId: data.revisionId ?? undefined,
    content: data.body?.content ? data.body.content.map(projectStructuralElement) : undefined,
  };
}
