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

describe('create_header', () => {
  it('creates a document-wide header and projects the created headerId', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        replies: [{ createHeader: { headerId: 'kix.h1' } }],
        writeControl: { requiredRevisionId: 'rev-2' },
      }),
      { documentId: 'D1', type: 'DEFAULT' },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ createHeader: { type: 'DEFAULT' } }] },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-2', headerId: 'kix.h1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('sends the section break location when sectionBreakIndex is given', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      type: 'DEFAULT',
      sectionBreakIndex: 40,
    });
    expect(captured.params?.requestBody?.requests).toEqual([
      { createHeader: { type: 'DEFAULT', sectionBreakLocation: { index: 40 } } },
    ]);
  });

  it('falls back to the empty-string sentinel when the reply carries no id', async () => {
    const result = await handler(fakeDocs({}, {}), { documentId: 'D3', type: 'DEFAULT' });
    expect(result.headerId).toBe('');
  });
});
