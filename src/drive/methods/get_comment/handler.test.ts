import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Comments$Get };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Comment): drive_v3.Drive {
  return {
    comments: {
      get: async (params: drive_v3.Params$Resource$Comments$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('get_comment', () => {
  it('gets and projects the comment', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, { id: 'C1', content: 'typo', resolved: false }),
      { fileId: 'F1', commentId: 'C1' },
    );
    expect(captured.params).toMatchObject({ fileId: 'F1', commentId: 'C1' });
    expect(result).toEqual({ id: 'C1', content: 'typo', resolved: false });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
