import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { search_threads } from './handler.js';
import { output } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      threads: {
        list: async () => ({ data: { threads: [{ id: 'T1' }], nextPageToken: 'next' } }),
        get: async () => ({
          data: {
            id: 'T1',
            messages: [
              {
                id: 'M1',
                snippet: 'hello',
                payload: { headers: [{ name: 'Subject', value: 'Hi' }] },
              },
            ],
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('search_threads', () => {
  it('lists threads and projects their messages', async () => {
    const result = await search_threads.handler(fakeGmail(), { query: 'is:unread' });
    expect(result.threads).toHaveLength(1);
    expect(result.threads[0]).toMatchObject({ id: 'T1' });
    expect(result.threads[0]?.messages[0]).toMatchObject({ id: 'M1', subject: 'Hi' });
    expect(result.nextPageToken).toBe('next');
    expect(() => output.parse(result)).not.toThrow();
  });
});
