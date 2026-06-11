import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Replies$Update };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Reply): drive_v3.Drive {
  return {
    replies: {
      update: async (params: drive_v3.Params$Resource$Replies$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('update_reply', () => {
  it('patches the content and projects the reply', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'R1', content: 'amended' }), {
      fileId: 'F1',
      commentId: 'C1',
      replyId: 'R1',
      content: 'amended',
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      commentId: 'C1',
      replyId: 'R1',
      requestBody: { content: 'amended' },
    });
    expect(result).toEqual({ id: 'R1', content: 'amended' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
