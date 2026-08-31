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

describe('insert_inline_image', () => {
  it('inserts at an index with a PT size and projects the created objectId', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, {
        documentId: 'D1',
        replies: [{ insertInlineImage: { objectId: 'kix.img1' } }],
        writeControl: { requiredRevisionId: 'rev-9' },
      }),
      { documentId: 'D1', uri: 'https://example.test/logo.png', width: 320, index: 7 },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            insertInlineImage: {
              uri: 'https://example.test/logo.png',
              objectSize: { width: { magnitude: 320, unit: 'PT' } },
              location: { index: 7 },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-9', objectId: 'kix.img1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('appends at the end of a segment with no size when only uri and segmentId are given', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      uri: 'https://example.test/mark.gif',
      segmentId: 'kix.header1',
    });
    expect(captured.params?.requestBody?.requests).toEqual([
      {
        insertInlineImage: {
          uri: 'https://example.test/mark.gif',
          endOfSegmentLocation: { segmentId: 'kix.header1' },
        },
      },
    ]);
    expect(result.objectId).toBe('');
  });

  it('rejects an over-long uri and a body index of 0 at the schema', () => {
    expect(
      schema.input.safeParse({ documentId: 'D3', uri: `https://e.test/${'x'.repeat(2048)}` })
        .success,
    ).toBe(false);
    expect(
      schema.input.safeParse({ documentId: 'D3', uri: 'https://e.test/i.png', index: 0 }).success,
    ).toBe(false);
  });
});
