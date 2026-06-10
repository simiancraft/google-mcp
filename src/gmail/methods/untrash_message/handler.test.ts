import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string | undefined }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        untrash: async (params: gmail_v1.Params$Resource$Users$Messages$Untrash) => {
          captured.id = params.id ?? undefined;
          return { data: { id: 'M1', labelIds: ['INBOX'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('untrash_message', () => {
  it('removes the message from the trash', async () => {
    const captured: { id?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), { messageId: 'M1' });
    expect(captured.id).toBe('M1');
    expect(result).toMatchObject({ id: 'M1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
