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

describe('replace_image', () => {
  it('replaces by object id with an explicit method', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-3' } }),
      {
        documentId: 'D1',
        imageObjectId: 'kix.img1',
        uri: 'https://example.test/new.png',
        imageReplaceMethod: 'CENTER_CROP',
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            replaceImage: {
              imageObjectId: 'kix.img1',
              uri: 'https://example.test/new.png',
              imageReplaceMethod: 'CENTER_CROP',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-3' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('omits the method from the wire when not provided', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      imageObjectId: 'kix.img2',
      uri: 'https://example.test/new.gif',
    });
    expect(captured.params?.requestBody?.requests).toEqual([
      { replaceImage: { imageObjectId: 'kix.img2', uri: 'https://example.test/new.gif' } },
    ]);
  });

  it('rejects an empty imageObjectId at the schema', () => {
    expect(
      schema.input.safeParse({ documentId: 'D3', imageObjectId: '', uri: 'https://e.test/i.png' })
        .success,
    ).toBe(false);
  });
});
