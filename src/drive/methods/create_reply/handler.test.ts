import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Replies$Create };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Reply): drive_v3.Drive {
  return {
    replies: {
      create: async (params: drive_v3.Params$Resource$Replies$Create) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('create_reply', () => {
  it('creates a reply with content', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'R1', content: 'fixed' }), {
      fileId: 'F1',
      commentId: 'C1',
      content: 'fixed',
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      commentId: 'C1',
      requestBody: { content: 'fixed' },
    });
    expect(result).toEqual({ id: 'R1', content: 'fixed' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('resolves a comment with a bare action', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'R2', action: 'resolve' }), {
      fileId: 'F1',
      commentId: 'C1',
      action: 'resolve',
    });
    expect(captured.params?.requestBody).toEqual({ action: 'resolve' });
  });

  it('refuses a reply with neither content nor action at the schema', () => {
    const result = schema.input.safeParse({ fileId: 'F1', commentId: 'C1' });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain('content is required');
  });
});
