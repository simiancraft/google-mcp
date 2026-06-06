import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { get_thread } from './handler.js';
import { output } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      threads: {
        get: async () => ({
          data: {
            id: 'T1',
            messages: [
              {
                id: 'M1',
                snippet: 'body preview',
                payload: {
                  headers: [
                    { name: 'Subject', value: 'Re: Hello' },
                    { name: 'From', value: 'a@example.com' },
                  ],
                  mimeType: 'text/plain',
                  body: { data: Buffer.from('Full body').toString('base64url') },
                },
              },
            ],
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('get_thread', () => {
  it('projects the thread messages, decoding the plaintext body', async () => {
    const result = await get_thread.handler(fakeGmail(), { threadId: 'T1' });
    expect(result.id).toBe('T1');
    expect(result.messages[0]).toMatchObject({
      id: 'M1',
      subject: 'Re: Hello',
      sender: { address: 'a@example.com' },
      plaintextBody: 'Full body',
    });
    expect(() => output.parse(result)).not.toThrow();
  });
});
