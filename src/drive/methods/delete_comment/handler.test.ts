import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Comments$Delete };

function fakeDrive(captured: Captured): drive_v3.Drive {
  return {
    comments: {
      delete: async (params: drive_v3.Params$Resource$Comments$Delete) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('delete_comment', () => {
  it('deletes the comment and confirms the ids', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured), { fileId: 'F1', commentId: 'C1' });
    expect(captured.params).toEqual({ fileId: 'F1', commentId: 'C1' });
    expect(result).toEqual({ fileId: 'F1', commentId: 'C1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
