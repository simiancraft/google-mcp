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

describe('delete_table_row', () => {
  it('sends the reference cell location', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-9' } }),
      {
        documentId: 'D1',
        tableCellLocation: { tableStartLocation: { index: 8 }, rowIndex: 2, columnIndex: 1 },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            deleteTableRow: {
              tableCellLocation: {
                tableStartLocation: { index: 8 },
                rowIndex: 2,
                columnIndex: 1,
              },
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-9' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('rejects a missing table start location at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D2',
      tableCellLocation: { rowIndex: 0, columnIndex: 0 },
    });
    expect(parsed.success).toBe(false);
  });
});
