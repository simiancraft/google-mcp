import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: docs_v1.Params$Resource$Documents$Get };

function fakeDocs(captured: Captured, data: docs_v1.Schema$Document): docs_v1.Docs {
  return {
    documents: {
      get: async (params: docs_v1.Params$Resource$Documents$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as docs_v1.Docs;
}

describe('get_document', () => {
  it('gets the document and projects body blocks to text with indices', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        title: 'Notes',
        revisionId: 'rev-7',
        body: {
          content: [
            { endIndex: 1, sectionBreak: {} },
            {
              startIndex: 1,
              endIndex: 14,
              paragraph: {
                elements: [
                  { textRun: { content: 'Hello ' } },
                  { textRun: { content: 'world.\n' } },
                ],
              },
            },
            { startIndex: 14, endIndex: 20, table: { rows: 2, columns: 3 } },
          ],
        },
      }),
      { documentId: 'D1' },
    );
    expect(captured.params).toEqual({ documentId: 'D1' });
    expect(result).toEqual({
      documentId: 'D1',
      title: 'Notes',
      revisionId: 'rev-7',
      content: [
        { endIndex: 1, type: 'sectionBreak' },
        { startIndex: 1, endIndex: 14, type: 'paragraph', text: 'Hello world.\n' },
        { startIndex: 14, endIndex: 20, type: 'table', rows: 2, columns: 3 },
      ],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('survives a bare document', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, {}), { documentId: 'D2' });
    expect(result).toEqual({ documentId: '' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
