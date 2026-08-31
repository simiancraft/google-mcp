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

describe('replace_named_range_content', () => {
  it('replaces by id, sending only the id and text', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-3' } }),
      { documentId: 'D1', namedRangeId: 'nr-1', text: 'Q3 summary' },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [{ replaceNamedRangeContent: { namedRangeId: 'nr-1', text: 'Q3 summary' } }],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-3' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('replaces by name, sending only the name and text (empty text allowed)', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      namedRangeName: 'summary',
      text: '',
    });
    expect(captured.params?.requestBody?.requests).toEqual([
      { replaceNamedRangeContent: { namedRangeName: 'summary', text: '' } },
    ]);
  });

  it('rejects neither and both selectors at the schema', () => {
    expect(schema.input.safeParse({ documentId: 'D3', text: 't' }).success).toBe(false);
    expect(
      schema.input.safeParse({
        documentId: 'D3',
        namedRangeId: 'nr-1',
        namedRangeName: 'summary',
        text: 't',
      }).success,
    ).toBe(false);
  });
});
