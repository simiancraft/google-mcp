import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Replies$Delete };

function fakeDrive(captured: Captured): drive_v3.Drive {
  return {
    replies: {
      delete: async (params: drive_v3.Params$Resource$Replies$Delete) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('delete_reply', () => {
  it('deletes the reply and confirms the ids', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured), {
      fileId: 'F1',
      commentId: 'C1',
      replyId: 'R1',
    });
    expect(captured.params).toEqual({ fileId: 'F1', commentId: 'C1', replyId: 'R1' });
    expect(result).toEqual({ fileId: 'F1', commentId: 'C1', replyId: 'R1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
