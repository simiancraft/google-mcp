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

describe('insert_section_break', () => {
  it('inserts at an explicit index via location', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-2' } }),
      { documentId: 'D1', sectionType: 'NEXT_PAGE', index: 25 },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            insertSectionBreak: { location: { index: 25 }, sectionType: 'NEXT_PAGE' },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('appends at the end of the body when index is omitted', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), { documentId: 'D2', sectionType: 'CONTINUOUS' });
    expect(captured.params?.requestBody?.requests?.[0]?.insertSectionBreak).toEqual({
      endOfSegmentLocation: {},
      sectionType: 'CONTINUOUS',
    });
  });
});
