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

describe('replace_all_text', () => {
  it('replaces matches and reports the count', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        replies: [{ replaceAllText: { occurrencesChanged: 3 } }],
        writeControl: { requiredRevisionId: 'rev-9' },
      }),
      {
        documentId: 'D1',
        containsText: { text: 'colour', matchCase: true },
        replaceText: 'color',
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            replaceAllText: {
              containsText: { text: 'colour', matchCase: true },
              replaceText: 'color',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', occurrencesChanged: 3, revisionId: 'rev-9' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('reports zero when nothing matches and an empty reply comes back', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, { documentId: 'D2', replies: [{}] }), {
      documentId: 'D2',
      containsText: { text: 'absent' },
      replaceText: '',
    });
    expect(result).toEqual({ documentId: 'D2', occurrencesChanged: 0 });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
