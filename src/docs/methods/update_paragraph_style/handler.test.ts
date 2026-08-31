import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { ParagraphStyle } from '../../entities/ParagraphStyle.js';
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
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(ParagraphStyle.shape);
    // Compile pin: fails to compile if an entity key is not a
    // Schema$ParagraphStyle field name.
    const restKeys: (keyof docs_v1.Schema$ParagraphStyle)[] =
      keys as (keyof typeof ParagraphStyle.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof ParagraphStyle.shape)[]);
  });

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

  it('builds PT dimensions for spacing and indents', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D4',
      range: { startIndex: 1, endIndex: 30 },
      paragraphStyle: {
        spaceAbove: 12,
        spaceBelow: 6,
        indentFirstLine: 18,
        indentStart: 36,
        indentEnd: 0,
        spacingMode: 'COLLAPSE_LISTS',
        direction: 'LEFT_TO_RIGHT',
        keepWithNext: true,
      },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateParagraphStyle).toEqual({
      range: { startIndex: 1, endIndex: 30 },
      paragraphStyle: {
        spaceAbove: { magnitude: 12, unit: 'PT' },
        spaceBelow: { magnitude: 6, unit: 'PT' },
        indentFirstLine: { magnitude: 18, unit: 'PT' },
        indentStart: { magnitude: 36, unit: 'PT' },
        indentEnd: { magnitude: 0, unit: 'PT' },
        spacingMode: 'COLLAPSE_LISTS',
        direction: 'LEFT_TO_RIGHT',
        keepWithNext: true,
      },
      fields:
        'spaceAbove,spaceBelow,indentFirstLine,indentStart,indentEnd,spacingMode,direction,keepWithNext',
    });
  });

  it('builds borders and shading with nested PT dimensions', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D5',
      range: { startIndex: 1, endIndex: 10 },
      paragraphStyle: {
        borderLeft: {
          color: { color: { rgbColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
          width: 1.5,
          padding: 6,
          dashStyle: 'SOLID',
        },
        borderTop: { dashStyle: 'DOT' },
        shading: { backgroundColor: { color: { rgbColor: { red: 1, green: 0.9, blue: 0.6 } } } },
      },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateParagraphStyle).toEqual({
      range: { startIndex: 1, endIndex: 10 },
      paragraphStyle: {
        borderLeft: {
          color: { color: { rgbColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
          width: { magnitude: 1.5, unit: 'PT' },
          padding: { magnitude: 6, unit: 'PT' },
          dashStyle: 'SOLID',
        },
        borderTop: { dashStyle: 'DOT' },
        shading: { backgroundColor: { color: { rgbColor: { red: 1, green: 0.9, blue: 0.6 } } } },
      },
      fields: 'borderLeft,borderTop,shading',
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
