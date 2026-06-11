import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Comments$Update };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Comment): drive_v3.Drive {
  return {
    comments: {
      update: async (params: drive_v3.Params$Resource$Comments$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('update_comment', () => {
  it('patches the content and projects the comment', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'C1', content: 'fixed typo' }), {
      fileId: 'F1',
      commentId: 'C1',
      content: 'fixed typo',
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      commentId: 'C1',
      requestBody: { content: 'fixed typo' },
    });
    expect(result).toEqual({ id: 'C1', content: 'fixed typo' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
