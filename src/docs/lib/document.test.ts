import { describe, expect, it } from 'bun:test';
import { projectDocument, projectStructuralElement } from './document.js';

describe('projectStructuralElement', () => {
  it('flattens a paragraph to index-faithful text, placeholding non-text elements', () => {
    expect(
      projectStructuralElement({
        startIndex: 1,
        endIndex: 10,
        paragraph: {
          elements: [
            { startIndex: 1, endIndex: 5, textRun: { content: 'one ' } },
            { startIndex: 5, endIndex: 6, inlineObjectElement: {} },
            { startIndex: 6, endIndex: 10, textRun: { content: 'two\n' } },
          ],
        },
      }),
    ).toEqual({ startIndex: 1, endIndex: 10, type: 'paragraph', text: 'one \uFFFCtwo\n' });
  });

  it('keeps text length equal to the index span around placeholders', () => {
    const projected = projectStructuralElement({
      startIndex: 1,
      endIndex: 4,
      paragraph: {
        elements: [
          { startIndex: 1, endIndex: 3, footnoteReference: {} },
          { startIndex: 3, endIndex: 4, textRun: { content: '\n' } },
        ],
      },
    });
    expect(projected.text).toBe('\uFFFC\uFFFC\n');
    expect(projected.text?.length).toBe(3);
  });

  it('keeps indices and drops the rest for an unknown structural kind', () => {
    expect(projectStructuralElement({ startIndex: 5, endIndex: 9 })).toEqual({
      startIndex: 5,
      endIndex: 9,
    });
  });

  it('projects tables to dimensions and the other known kinds to bare types', () => {
    expect(projectStructuralElement({ table: { rows: 1, columns: null } })).toEqual({
      type: 'table',
      rows: 1,
    });
    expect(projectStructuralElement({ tableOfContents: {} })).toEqual({
      type: 'tableOfContents',
    });
  });
});

describe('projectDocument', () => {
  it('cleans nulls and survives a document with no body', () => {
    expect(projectDocument({ documentId: 'D1', title: null, revisionId: 'r' })).toEqual({
      documentId: 'D1',
      revisionId: 'r',
    });
    expect(projectDocument({})).toEqual({ documentId: '' });
  });
});
