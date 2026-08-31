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

describe('merge_table_cells', () => {
  it('sends the table range', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-8' } }),
      {
        documentId: 'D1',
        tableRange: {
          tableCellLocation: { tableStartLocation: { index: 5 }, rowIndex: 0, columnIndex: 0 },
          rowSpan: 2,
          columnSpan: 3,
        },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            mergeTableCells: {
              tableRange: {
                tableCellLocation: {
                  tableStartLocation: { index: 5 },
                  rowIndex: 0,
                  columnIndex: 0,
                },
                rowSpan: 2,
                columnSpan: 3,
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-8' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('rejects a zero row span at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D2',
      tableRange: {
        tableCellLocation: { tableStartLocation: { index: 5 }, rowIndex: 0, columnIndex: 0 },
        rowSpan: 0,
        columnSpan: 1,
      },
    });
    expect(parsed.success).toBe(false);
  });
});
