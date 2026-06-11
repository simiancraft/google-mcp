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

describe('update_paragraph_style', () => {
  it('derives the field mask from the provided keys', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-5' } }),
      {
        documentId: 'D1',
        range: { startIndex: 1, endIndex: 20 },
        paragraphStyle: { namedStyleType: 'HEADING_2', alignment: 'CENTER' },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateParagraphStyle: {
              range: { startIndex: 1, endIndex: 20 },
              paragraphStyle: { namedStyleType: 'HEADING_2', alignment: 'CENTER' },
              fields: 'namedStyleType,alignment',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-5' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('sends a lone line spacing change with a single-field mask', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      range: { startIndex: 1, endIndex: 2 },
      paragraphStyle: { lineSpacing: 150 },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateParagraphStyle).toEqual({
      range: { startIndex: 1, endIndex: 2 },
      paragraphStyle: { lineSpacing: 150 },
      fields: 'lineSpacing',
    });
  });

  it('rejects an empty style object at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D3',
      range: { startIndex: 1, endIndex: 2 },
      paragraphStyle: {},
    });
    expect(parsed.success).toBe(false);
  });
});
