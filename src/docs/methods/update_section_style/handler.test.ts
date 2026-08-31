import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { SectionStyle } from '../../entities/SectionStyle.js';
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

describe('update_section_style', () => {
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(SectionStyle.shape);
    // Compile pin: fails to compile if an entity key is not a
    // Schema$SectionStyle field name.
    const restKeys: (keyof docs_v1.Schema$SectionStyle)[] =
      keys as (keyof typeof SectionStyle.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof SectionStyle.shape)[]);
  });

  it('builds column properties and margins with PT dimensions and derives the mask', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-9' } }),
      {
        documentId: 'D1',
        range: { startIndex: 1, endIndex: 40 },
        sectionStyle: {
          columnProperties: [{ width: 216, paddingEnd: 18 }, {}],
          columnSeparatorStyle: 'BETWEEN_EACH_COLUMN',
          marginLeft: 36,
        },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateSectionStyle: {
              range: { startIndex: 1, endIndex: 40 },
              sectionStyle: {
                columnProperties: [
                  {
                    width: { magnitude: 216, unit: 'PT' },
                    paddingEnd: { magnitude: 18, unit: 'PT' },
                  },
                  {},
                ],
                columnSeparatorStyle: 'BETWEEN_EACH_COLUMN',
                marginLeft: { magnitude: 36, unit: 'PT' },
              },
              fields: 'columnProperties,columnSeparatorStyle,marginLeft',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-9' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('sends a lone content direction change with a single-field mask', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      range: { startIndex: 1, endIndex: 5 },
      sectionStyle: { contentDirection: 'RIGHT_TO_LEFT' },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateSectionStyle).toEqual({
      range: { startIndex: 1, endIndex: 5 },
      sectionStyle: { contentDirection: 'RIGHT_TO_LEFT' },
      fields: 'contentDirection',
    });
  });

  it('rejects an empty style object at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D3',
      range: { startIndex: 1, endIndex: 2 },
      sectionStyle: {},
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects more than three columns at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D4',
      range: { startIndex: 1, endIndex: 2 },
      sectionStyle: { columnProperties: [{}, {}, {}, {}] },
    });
    expect(parsed.success).toBe(false);
  });
});
