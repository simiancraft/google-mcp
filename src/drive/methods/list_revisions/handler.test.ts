import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Revisions$List };

function fakeDrive(captured: Captured, data: drive_v3.Schema$RevisionList): drive_v3.Drive {
  return {
    revisions: {
      list: async (params: drive_v3.Params$Resource$Revisions$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('list_revisions', () => {
  it('lists and projects the revisions', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        revisions: [{ id: 'V1', mimeType: 'image/png' }],
        nextPageToken: 'NEXT',
      }),
      { fileId: 'F1', pageSize: 5, pageToken: 'P2' },
    );
    expect(captured.params).toMatchObject({ fileId: 'F1', pageSize: 5, pageToken: 'P2' });
    expect(captured.params?.fields).toContain('nextPageToken,revisions(');
    expect(result.revisions).toEqual([{ id: 'V1', mimeType: 'image/png' }]);
    expect(result.nextPageToken).toBe('NEXT');
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('serves an empty history as an empty list', async () => {
    const result = await handler(fakeDrive({}, {}), { fileId: 'F1' });
    expect(result).toEqual({ revisions: [] });
  });
});
