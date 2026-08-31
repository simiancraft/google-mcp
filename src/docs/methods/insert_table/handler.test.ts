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

describe('insert_table', () => {
  it('inserts at a location when an index is given', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-7' } }),
      { documentId: 'D1', rows: 3, columns: 2, index: 25 },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [{ insertTable: { location: { index: 25 }, rows: 3, columns: 2 } }],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-7' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('appends at the end of the body when the index is omitted', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), { documentId: 'D2', rows: 1, columns: 4 });
    expect(captured.params?.requestBody?.requests?.[0]).toEqual({
      insertTable: { endOfSegmentLocation: {}, rows: 1, columns: 4 },
    });
  });

  it('rejects a zero-row table at the schema', () => {
    const parsed = schema.input.safeParse({ documentId: 'D3', rows: 0, columns: 1 });
    expect(parsed.success).toBe(false);
  });
});
