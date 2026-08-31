import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: docs_v1.Params$Resource$Documents$Batchupdate };

function fakeDocs(
  captured: Captured,
  data: docs_v1.Schema$BatchUpdateDocumentResponse,
): docs_v1.Docs {
  return {
    documents: {
      batchUpdate: async (params: docs_v1.Params$Resource$Documents$Batchupdate) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as docs_v1.Docs;
}

describe('delete_header', () => {
  it('deletes by headerId', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-5' } }),
      { documentId: 'D1', headerId: 'kix.h1' },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ deleteHeader: { headerId: 'kix.h1' } }] },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-5' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('rejects an empty headerId at the schema', () => {
    expect(schema.input.safeParse({ documentId: 'D2', headerId: '' }).success).toBe(false);
  });
});
