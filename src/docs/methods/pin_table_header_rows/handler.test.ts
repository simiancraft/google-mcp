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

describe('pin_table_header_rows', () => {
  it('sends the table start location and pin count', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-1' } }),
      { documentId: 'D1', tableStartLocation: { index: 5 }, pinnedHeaderRowsCount: 2 },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            pinTableHeaderRows: {
              tableStartLocation: { index: 5 },
              pinnedHeaderRowsCount: 2,
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('accepts a count of 0 (unpin all rows)', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      tableStartLocation: { index: 5 },
      pinnedHeaderRowsCount: 0,
    });
    expect(captured.params?.requestBody?.requests?.[0]?.pinTableHeaderRows).toEqual({
      tableStartLocation: { index: 5 },
      pinnedHeaderRowsCount: 0,
    });
  });

  it('rejects a negative count at the schema', () => {
    const parsed = schema.input.safeParse({
      documentId: 'D3',
      tableStartLocation: { index: 5 },
      pinnedHeaderRowsCount: -1,
    });
    expect(parsed.success).toBe(false);
  });
});
