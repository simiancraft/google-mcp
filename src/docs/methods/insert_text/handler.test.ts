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

describe('insert_text', () => {
  it('appends at the end of the body when no index is given', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-2' } }),
      { documentId: 'D1', text: 'Hello.\n' },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [{ insertText: { endOfSegmentLocation: {}, text: 'Hello.\n' } }],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('inserts at an explicit index', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      text: 'mid',
      index: 7,
    });
    expect(captured.params).toEqual({
      documentId: 'D2',
      requestBody: { requests: [{ insertText: { location: { index: 7 }, text: 'mid' } }] },
    });
    expect(result).toEqual({ documentId: 'D2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
