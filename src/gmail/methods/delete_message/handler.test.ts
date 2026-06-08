import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { delete_message } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
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
    expect(delete_message.destructive).toBe(true);
    const captured: { id?: string } = {};
    const result = await delete_message.handler(fakeGmail(captured), { messageId: 'M1' });
    expect(captured.id).toBe('M1');
    expect(result).toEqual({ messageId: 'M1' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
