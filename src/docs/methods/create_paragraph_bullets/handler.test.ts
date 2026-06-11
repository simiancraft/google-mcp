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

describe('create_paragraph_bullets', () => {
  it('applies the preset to the range', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-6' } }),
      {
        documentId: 'D1',
        range: { startIndex: 1, endIndex: 30 },
        bulletPreset: 'NUMBERED_DECIMAL_ALPHA_ROMAN',
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            createParagraphBullets: {
              range: { startIndex: 1, endIndex: 30 },
              bulletPreset: 'NUMBERED_DECIMAL_ALPHA_ROMAN',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-6' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('rejects an unknown preset at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D2',
      range: { startIndex: 1, endIndex: 2 },
      bulletPreset: 'BULLET_GLYPH_PRESET_UNSPECIFIED',
    });
    expect(parsed.success).toBe(false);
  });
});
