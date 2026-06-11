import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { applyUpdate } from './batch.js';

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

describe('applyUpdate', () => {
  it('wraps exactly one request and surfaces identity and revision', async () => {
    const captured: Captured = {};
    const result = await applyUpdate(
      fakeDocs(captured, {
        documentId: 'D1',
        writeControl: { requiredRevisionId: 'rev-2' },
        replies: [{}],
      }),
      'D1',
      { insertText: { endOfSegmentLocation: {}, text: 'hi' } },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ insertText: { endOfSegmentLocation: {}, text: 'hi' } }] },
    });
    expect(result.documentId).toBe('D1');
    expect(result.revisionId).toBe('rev-2');
    expect(result.reply).toEqual({});
  });

  it('falls back to the requested id and omits an unreported revision', async () => {
    const captured: Captured = {};
    const result = await applyUpdate(fakeDocs(captured, {}), 'D9', {
      deleteContentRange: { range: { startIndex: 1, endIndex: 2 } },
    });
    expect(result.documentId).toBe('D9');
    expect(result.revisionId).toBeUndefined();
    expect(result.reply).toBeUndefined();
  });
});
