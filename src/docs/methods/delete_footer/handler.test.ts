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

describe('delete_footer', () => {
  it('deletes by footerId', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, { documentId: 'D1' }), {
      documentId: 'D1',
      footerId: 'kix.f1',
    });
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ deleteFooter: { footerId: 'kix.f1' } }] },
    });
    expect(result).toEqual({ documentId: 'D1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('rejects an empty footerId at the schema', () => {
    expect(schema.input.safeParse({ documentId: 'D2', footerId: '' }).success).toBe(false);
  });
});
