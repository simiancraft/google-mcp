import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Comments$List };

function fakeDrive(captured: Captured, data: drive_v3.Schema$CommentList): drive_v3.Drive {
  return {
    comments: {
      list: async (params: drive_v3.Params$Resource$Comments$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('list_comments', () => {
  it('lists and projects the comments with their replies', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        comments: [{ id: 'C1', content: 'typo', replies: [{ id: 'R1', action: 'resolve' }] }],
        nextPageToken: 'NEXT',
      }),
      { fileId: 'F1', includeDeleted: true, pageSize: 5, pageToken: 'P2' },
    );
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      includeDeleted: true,
      pageSize: 5,
      pageToken: 'P2',
    });
    expect(captured.params?.fields).toContain('nextPageToken,comments(');
    expect(result.comments).toEqual([
      { id: 'C1', content: 'typo', replies: [{ id: 'R1', action: 'resolve' }] },
    ]);
    expect(result.nextPageToken).toBe('NEXT');
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('serves an empty thread as an empty list', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, {}), { fileId: 'F1' });
    expect(result).toEqual({ comments: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
