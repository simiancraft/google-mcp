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

describe('delete_content_range', () => {
  it('deletes the range', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-3' } }),
      { documentId: 'D1', range: { startIndex: 5, endIndex: 12 } },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [{ deleteContentRange: { range: { startIndex: 5, endIndex: 12 } } }],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-3' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the requested id on a bare response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      range: { startIndex: 1, endIndex: 2 },
    });
    expect(result).toEqual({ documentId: 'D2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
