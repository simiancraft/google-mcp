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

describe('create_footnote', () => {
  it('creates at an explicit index and projects the created footnoteId', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        replies: [{ createFootnote: { footnoteId: 'kix.fn1' } }],
      }),
      { documentId: 'D1', index: 12 },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ createFootnote: { location: { index: 12 } } }] },
    });
    expect(result).toEqual({ documentId: 'D1', footnoteId: 'kix.fn1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('appends the reference at the end of the body when no index is given', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, {}), { documentId: 'D2' });
    expect(captured.params?.requestBody?.requests).toEqual([
      { createFootnote: { endOfSegmentLocation: {} } },
    ]);
    expect(result.footnoteId).toBe('');
  });
});
