import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Comments$Create };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Comment): drive_v3.Drive {
  return {
    comments: {
      create: async (params: drive_v3.Params$Resource$Comments$Create) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('create_comment', () => {
  it('creates the comment with content and anchor', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'C1', content: 'typo' }), {
      fileId: 'F1',
      content: 'typo',
      anchor: '{"r":"head"}',
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      requestBody: { content: 'typo', anchor: '{"r":"head"}' },
    });
    expect(result).toEqual({ id: 'C1', content: 'typo' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('omits the anchor for unanchored comments', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'C2' }), { fileId: 'F1', content: 'general note' });
    expect(captured.params?.requestBody).toEqual({ content: 'general note' });
  });
});
