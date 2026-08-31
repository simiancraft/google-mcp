import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { TableRowStyle } from '../../entities/TableRowStyle.js';
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

describe('update_table_row_style', () => {
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(TableRowStyle.shape);
    // Compile pin: the cast chain fails to compile if an entity key is not a
    // Schema$TableRowStyle field name (a rename would silently 400 live).
    const restKeys: (keyof docs_v1.Schema$TableRowStyle)[] =
      keys as (keyof typeof TableRowStyle.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof TableRowStyle.shape)[]);
  });

  it('derives the field mask from the provided keys and builds the PT dimension', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-3' } }),
      {
        documentId: 'D1',
        tableStartLocation: { index: 5 },
        rowIndices: [0],
        tableRowStyle: { minRowHeight: 24, tableHeader: true },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateTableRowStyle: {
              tableStartLocation: { index: 5 },
              rowIndices: [0],
              tableRowStyle: {
                minRowHeight: { magnitude: 24, unit: 'PT' },
                tableHeader: true,
              },
              fields: 'minRowHeight,tableHeader',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-3' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('omits rowIndices entirely to style every row', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      tableStartLocation: { index: 9 },
      tableRowStyle: { preventOverflow: false },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateTableRowStyle).toEqual({
      tableStartLocation: { index: 9 },
      tableRowStyle: { preventOverflow: false },
      fields: 'preventOverflow',
    });
  });

  it('rejects an empty style object at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D3',
      tableStartLocation: { index: 5 },
      tableRowStyle: {},
    });
    expect(parsed.success).toBe(false);
  });
});
