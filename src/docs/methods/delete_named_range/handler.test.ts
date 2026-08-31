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

describe('delete_named_range', () => {
  it('deletes by id, sending only the id', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, { documentId: 'D1' }), {
      documentId: 'D1',
      namedRangeId: 'nr-1',
    });
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ deleteNamedRange: { namedRangeId: 'nr-1' } }] },
    });
    expect(result).toEqual({ documentId: 'D1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('deletes by name, sending only the name', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), { documentId: 'D2', name: 'summary' });
    expect(captured.params?.requestBody?.requests).toEqual([
      { deleteNamedRange: { name: 'summary' } },
    ]);
  });

  it('rejects neither and both at the schema (exactly one selector)', () => {
    expect(schema.input.safeParse({ documentId: 'D3' }).success).toBe(false);
    expect(
      schema.input.safeParse({ documentId: 'D3', namedRangeId: 'nr-1', name: 'summary' }).success,
    ).toBe(false);
  });
});
