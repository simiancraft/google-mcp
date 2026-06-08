import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { list_messages } from './handler.js';
import { output } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        list: async () => ({ data: { messages: [{ id: 'M1' }], nextPageToken: 'n' } }),
        get: async () => ({
          data: {
            id: 'M1',
            snippet: 's',
            payload: { headers: [{ name: 'Subject', value: 'Hi' }] },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('list_messages', () => {
  it('lists and projects messages', async () => {
    const result = await list_messages.handler(fakeGmail(), { query: 'is:unread' });
    expect(result.messages[0]).toMatchObject({ id: 'M1', subject: 'Hi' });
    expect(result.nextPageToken).toBe('n');
    expect(() => output.parse(result)).not.toThrow();
  });
});
