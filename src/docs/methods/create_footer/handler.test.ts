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

describe('create_footer', () => {
  it('creates a document-wide footer and projects the created footerId', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        replies: [{ createFooter: { footerId: 'kix.f1' } }],
      }),
      { documentId: 'D1', type: 'DEFAULT' },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: { requests: [{ createFooter: { type: 'DEFAULT' } }] },
    });
    expect(result).toEqual({ documentId: 'D1', footerId: 'kix.f1' });
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
      { createFooter: { type: 'DEFAULT', sectionBreakLocation: { index: 40 } } },
    ]);
  });

  it('falls back to the empty-string sentinel when the reply carries no id', async () => {
    const result = await handler(fakeDocs({}, {}), { documentId: 'D3', type: 'DEFAULT' });
    expect(result.footerId).toBe('');
  });
});
