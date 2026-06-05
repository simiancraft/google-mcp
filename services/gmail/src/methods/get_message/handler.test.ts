import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { get_message } from './handler.js';
import { output } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        get: async () => ({
          data: {
            id: 'M1',
            snippet: 'hi',
            payload: {
              headers: [{ name: 'Subject', value: 'Hello' }],
              mimeType: 'text/plain',
              body: { data: Buffer.from('Body text').toString('base64url') },
            },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('get_message', () => {
  it('projects the message and decodes the body', async () => {
    const result = await get_message.handler(fakeGmail(), { messageId: 'M1' });
    expect(result).toMatchObject({ id: 'M1', subject: 'Hello', plaintextBody: 'Body text' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
