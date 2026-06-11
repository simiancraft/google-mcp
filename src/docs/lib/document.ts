import type { docs_v1 } from '@googleapis/docs';
import type { Document } from '../entities/Document.js';
import type { StructuralElement } from '../entities/StructuralElement.js';

/** Concatenate a paragraph's text runs; non-text paragraph elements contribute nothing. */
function paragraphText(paragraph: docs_v1.Schema$Paragraph): string {
  return (paragraph.elements ?? []).map((element) => element.textRun?.content ?? '').join('');
}

/**
 * Project one REST structural element: indices plus kind, paragraph text, and
 * table dimensions. An element of a kind this server does not know keeps its
 * indices and drops the rest (the enum-or-drop policy applied to a
 * discriminator), so edits can still be targeted around it.
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
