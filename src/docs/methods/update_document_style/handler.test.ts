import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { DocumentStyle } from '../../entities/DocumentStyle.js';
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

describe('update_document_style', () => {
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(DocumentStyle.shape);
    // Compile pin: fails to compile if an entity key is not a
    // Schema$DocumentStyle field name.
    const restKeys: (keyof docs_v1.Schema$DocumentStyle)[] =
      keys as (keyof typeof DocumentStyle.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof DocumentStyle.shape)[]);
  });

  it('builds PT dimensions for margins and page size and derives the mask', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-7' } }),
      {
        documentId: 'D1',
        documentStyle: {
          marginTop: 72,
          marginBottom: 72,
          pageSize: { height: 792, width: 612 },
          flipPageOrientation: true,
        },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateDocumentStyle: {
              documentStyle: {
                marginTop: { magnitude: 72, unit: 'PT' },
                marginBottom: { magnitude: 72, unit: 'PT' },
                pageSize: {
                  height: { magnitude: 792, unit: 'PT' },
                  width: { magnitude: 612, unit: 'PT' },
                },
                flipPageOrientation: true,
              },
              fields: 'marginTop,marginBottom,pageSize,flipPageOrientation',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-7' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes background and page numbering through unconverted', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      documentStyle: {
        background: { color: { color: { rgbColor: { red: 1, green: 1, blue: 0.9 } } } },
        pageNumberStart: 3,
        useEvenPageHeaderFooter: true,
      },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateDocumentStyle).toEqual({
      documentStyle: {
        background: { color: { color: { rgbColor: { red: 1, green: 1, blue: 0.9 } } } },
        pageNumberStart: 3,
        useEvenPageHeaderFooter: true,
      },
      fields: 'background,pageNumberStart,useEvenPageHeaderFooter',
    });
  });

  it('rejects an empty style object at the schema', () => {
    const parsed = schema.input.safeParse({ documentId: 'D3', documentStyle: {} });
    expect(parsed.success).toBe(false);
  });
});
