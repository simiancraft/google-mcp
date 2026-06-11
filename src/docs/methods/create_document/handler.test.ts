import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: docs_v1.Params$Resource$Documents$Create };

function fakeDocs(captured: Captured, data: docs_v1.Schema$Document): docs_v1.Docs {
  return {
    documents: {
      create: async (params: docs_v1.Params$Resource$Documents$Create) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as docs_v1.Docs;
}

describe('create_document', () => {
  it('creates a blank document with the title', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'NEW1',
        title: 'Meeting notes',
        revisionId: 'rev-1',
        body: { content: [{ endIndex: 1, sectionBreak: {} }] },
      }),
      { title: 'Meeting notes' },
    );
    expect(captured.params).toEqual({ requestBody: { title: 'Meeting notes' } });
    expect(result).toEqual({
      documentId: 'NEW1',
      title: 'Meeting notes',
      revisionId: 'rev-1',
      content: [{ endIndex: 1, type: 'sectionBreak' }],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
