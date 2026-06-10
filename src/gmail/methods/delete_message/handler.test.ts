import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string | undefined }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        delete: async (params: gmail_v1.Params$Resource$Users$Messages$Delete) => {
          captured.id = params.id ?? undefined;
          return { data: {} };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('delete_message', () => {
  it('is marked destructive and permanently deletes the message', async () => {
    const captured: { id?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), { messageId: 'M1' });
    expect(captured.id).toBe('M1');
    expect(result).toEqual({ messageId: 'M1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
