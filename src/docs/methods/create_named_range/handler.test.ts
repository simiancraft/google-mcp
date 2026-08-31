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

describe('create_named_range', () => {
  it('sends the name and range, and projects the created namedRangeId from the reply', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        replies: [{ createNamedRange: { namedRangeId: 'nr-1' } }],
        writeControl: { requiredRevisionId: 'rev-2' },
      }),
      { documentId: 'D1', name: 'summary', range: { startIndex: 5, endIndex: 42 } },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          { createNamedRange: { name: 'summary', range: { startIndex: 5, endIndex: 42 } } },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-2', namedRangeId: 'nr-1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('falls back to the empty-string sentinel when the reply carries no id', async () => {
    const result = await handler(fakeDocs({}, {}), {
      documentId: 'D2',
      name: 'n',
      range: { startIndex: 1, endIndex: 2 },
    });
    expect(result.namedRangeId).toBe('');
  });

  it('rejects an empty and an over-long name at the schema', () => {
    const range = { startIndex: 1, endIndex: 2 };
    expect(schema.input.safeParse({ documentId: 'D3', name: '', range }).success).toBe(false);
    expect(schema.input.safeParse({ documentId: 'D3', name: 'x'.repeat(257), range }).success).toBe(
      false,
    );
  });
});
