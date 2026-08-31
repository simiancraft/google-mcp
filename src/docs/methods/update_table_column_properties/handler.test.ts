import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { TableColumnProperties } from '../../entities/TableColumnProperties.js';
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

describe('update_table_column_properties', () => {
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(TableColumnProperties.shape);
    // Compile pin: the cast chain fails to compile if an entity key is not a
    // Schema$TableColumnProperties field name (a rename would silently 400
    // live).
    const restKeys: (keyof docs_v1.Schema$TableColumnProperties)[] =
      keys as (keyof typeof TableColumnProperties.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof TableColumnProperties.shape)[]);
  });

  it('derives the field mask from the provided keys and builds the PT dimension', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-5' } }),
      {
        documentId: 'D1',
        tableStartLocation: { index: 7 },
        columnIndices: [1, 2],
        tableColumnProperties: { widthType: 'FIXED_WIDTH', width: 120 },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateTableColumnProperties: {
              tableStartLocation: { index: 7 },
              columnIndices: [1, 2],
              tableColumnProperties: {
                widthType: 'FIXED_WIDTH',
                width: { magnitude: 120, unit: 'PT' },
              },
              fields: 'widthType,width',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-5' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('omits columnIndices entirely to update every column', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      tableStartLocation: { index: 4 },
      tableColumnProperties: { widthType: 'EVENLY_DISTRIBUTED' },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateTableColumnProperties).toEqual({
      tableStartLocation: { index: 4 },
      tableColumnProperties: { widthType: 'EVENLY_DISTRIBUTED' },
      fields: 'widthType',
    });
  });

  it('rejects FIXED_WIDTH without a width at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D3',
      tableStartLocation: { index: 4 },
      tableColumnProperties: { widthType: 'FIXED_WIDTH' },
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects an empty properties object at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D4',
      tableStartLocation: { index: 4 },
      tableColumnProperties: {},
    });
    expect(parsed.success).toBe(false);
  });
});
