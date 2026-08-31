import { describe, expect, it } from 'bun:test';
import { StructuralElement } from '../entities/StructuralElement.js';
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

  it('projects the cell tree of a table, recursing into cell content', () => {
    const projected = projectStructuralElement({
      startIndex: 5,
      endIndex: 30,
      table: {
        rows: 1,
        columns: 2,
        tableRows: [
          {
            startIndex: 6,
            endIndex: 29,
            tableCells: [
              {
                startIndex: 7,
                endIndex: 12,
                content: [
                  {
                    startIndex: 8,
                    endIndex: 12,
                    paragraph: { elements: [{ textRun: { content: 'one\n' } }] },
                  },
                ],
              },
              {
                startIndex: 12,
                endIndex: 29,
                content: [{ startIndex: 13, endIndex: 29, table: { rows: 1, columns: 1 } }],
              },
            ],
          },
        ],
      },
    });
    expect(projected).toEqual({
      startIndex: 5,
      endIndex: 30,
      type: 'table',
      rows: 1,
      columns: 2,
      tableRows: [
        {
          startIndex: 6,
          endIndex: 29,
          cells: [
            {
              startIndex: 7,
              endIndex: 12,
              content: [{ startIndex: 8, endIndex: 12, type: 'paragraph', text: 'one\n' }],
            },
            {
              startIndex: 12,
              endIndex: 29,
              // A nested table recurses through the same projector.
              content: [{ startIndex: 13, endIndex: 29, type: 'table', rows: 1, columns: 1 }],
            },
          ],
        },
      ],
    });
    expect(() => StructuralElement.parse(projected)).not.toThrow();
  });

  it('projects a row with no cells and a cell with no content to empty arrays', () => {
    expect(projectStructuralElement({ table: { rows: 1, columns: 0, tableRows: [{}] } })).toEqual({
      type: 'table',
      rows: 1,
      columns: 0,
      tableRows: [{ cells: [] }],
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

  it('projects headers, footers, and footnotes keyed by their segment id', () => {
    const projected = projectDocument({
      documentId: 'D2',
      headers: {
        'kix.h1': {
          headerId: 'kix.h1',
          content: [
            {
              startIndex: 0,
              endIndex: 12,
              paragraph: { elements: [{ textRun: { content: 'Page header\n' } }] },
            },
          ],
        },
      },
      footers: { 'kix.f1': { footerId: 'kix.f1', content: [] } },
      footnotes: {
        'kix.fn1': {
          footnoteId: 'kix.fn1',
          content: [
            {
              startIndex: 0,
              endIndex: 2,
              paragraph: { elements: [{ textRun: { content: ' \n' } }] },
            },
          ],
        },
      },
    });
    expect(projected.headers).toEqual({
      'kix.h1': {
        content: [{ startIndex: 0, endIndex: 12, type: 'paragraph', text: 'Page header\n' }],
      },
    });
    expect(projected.footers).toEqual({ 'kix.f1': { content: [] } });
    expect(projected.footnotes).toEqual({
      'kix.fn1': { content: [{ startIndex: 0, endIndex: 2, type: 'paragraph', text: ' \n' }] },
    });
  });

  it('leaves the segment maps absent when the document has none (empty maps included)', () => {
    const projected = projectDocument({ documentId: 'D3', headers: {} });
    expect(projected.headers).toBeUndefined();
    expect(projected.footers).toBeUndefined();
    expect(projected.footnotes).toBeUndefined();
  });
});
