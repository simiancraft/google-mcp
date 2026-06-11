import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Replies$List };

function fakeDrive(captured: Captured, data: drive_v3.Schema$ReplyList): drive_v3.Drive {
  return {
    replies: {
      list: async (params: drive_v3.Params$Resource$Replies$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('list_replies', () => {
  it('lists and projects the replies', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        replies: [{ id: 'R1', content: 'fixed', action: 'resolve' }],
        nextPageToken: 'NEXT',
      }),
      { fileId: 'F1', commentId: 'C1', pageSize: 5 },
    );
    expect(captured.params).toMatchObject({ fileId: 'F1', commentId: 'C1', pageSize: 5 });
    expect(captured.params?.fields).toContain('nextPageToken,replies(');
    expect(result.replies).toEqual([{ id: 'R1', content: 'fixed', action: 'resolve' }]);
    expect(result.nextPageToken).toBe('NEXT');
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('serves an empty thread as an empty list', async () => {
    const result = await handler(fakeDrive({}, {}), { fileId: 'F1', commentId: 'C1' });
    expect(result).toEqual({ replies: [] });
  });
});
