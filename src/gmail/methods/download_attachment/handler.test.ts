import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        attachments: {
          get: async () => ({
            data: { size: 12, data: Buffer.from('hello').toString('base64url') },
          }),
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('download_attachment', () => {
  it('returns the attachment id, size, and data', async () => {
    const result = await handler(fakeGmail(), {
      messageId: 'M1',
      attachmentId: 'A1',
    });
    expect(result.attachmentId).toBe('A1');
    expect(result.size).toBe(12);
    expect(Buffer.from(result.data, 'base64url').toString('utf8')).toBe('hello');
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
