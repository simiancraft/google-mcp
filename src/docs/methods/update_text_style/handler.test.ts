import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { TextStyle } from '../../entities/TextStyle.js';
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

describe('update_text_style', () => {
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(TextStyle.shape);
    // Compile pin: the cast chain fails to compile if an entity key is not a
    // Schema$TextStyle field name (a rename would silently 400 live).
    const restKeys: (keyof docs_v1.Schema$TextStyle)[] = keys as (keyof typeof TextStyle.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof TextStyle.shape)[]);
  });

  it('derives the field mask from the provided keys and builds the PT dimension', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-4' } }),
      {
        documentId: 'D1',
        range: { startIndex: 1, endIndex: 10 },
        textStyle: { bold: true, fontSize: 14, link: { url: 'https://example.test/' } },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateTextStyle: {
              range: { startIndex: 1, endIndex: 10 },
              textStyle: {
                bold: true,
                fontSize: { magnitude: 14, unit: 'PT' },
                link: { url: 'https://example.test/' },
              },
              fields: 'bold,fontSize,link',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-4' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes colors and font family through with the mask (no conversion needed)', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D4',
      range: { startIndex: 3, endIndex: 9 },
      textStyle: {
        foregroundColor: { color: { rgbColor: { red: 0.8, green: 0.2, blue: 0.1 } } },
        backgroundColor: {},
        weightedFontFamily: { fontFamily: 'Roboto', weight: 700 },
      },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateTextStyle).toEqual({
      range: { startIndex: 3, endIndex: 9 },
      textStyle: {
        foregroundColor: { color: { rgbColor: { red: 0.8, green: 0.2, blue: 0.1 } } },
        backgroundColor: {},
        weightedFontFamily: { fontFamily: 'Roboto', weight: 700 },
      },
      fields: 'foregroundColor,backgroundColor,weightedFontFamily',
    });
  });

  it('rejects a font weight that is not a multiple of 100 in range', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D5',
      range: { startIndex: 1, endIndex: 2 },
      textStyle: { weightedFontFamily: { fontFamily: 'Roboto', weight: 450 } },
    });
    expect(parsed.success).toBe(false);
  });

  it('keeps explicit false in the mask (turning a style off)', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      range: { startIndex: 2, endIndex: 5 },
      textStyle: { bold: false, baselineOffset: 'SUPERSCRIPT' },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateTextStyle).toEqual({
      range: { startIndex: 2, endIndex: 5 },
      textStyle: { bold: false, baselineOffset: 'SUPERSCRIPT' },
      fields: 'bold,baselineOffset',
    });
  });

  it('rejects an empty style object at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D3',
      range: { startIndex: 1, endIndex: 2 },
      textStyle: {},
    });
    expect(parsed.success).toBe(false);
  });
});
