import { describe, expect, it } from 'bun:test';
import { projectDocument, projectStructuralElement } from './document.js';

describe('projectStructuralElement', () => {
  it('flattens a paragraph to its concatenated run text', () => {
    expect(
      projectStructuralElement({
        startIndex: 1,
        endIndex: 8,
        paragraph: {
          elements: [
            { textRun: { content: 'one ' } },
            { inlineObjectElement: {} },
            { textRun: { content: 'two\n' } },
          ],
        },
      }),
    ).toEqual({ startIndex: 1, endIndex: 8, type: 'paragraph', text: 'one two\n' });
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
