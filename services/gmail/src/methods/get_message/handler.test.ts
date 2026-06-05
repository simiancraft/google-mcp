import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { get_message } from './handler.js';
import { output } from './schema.js';

const b64 = (s: string) => Buffer.from(s).toString('base64url');

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        get: async () => ({
          data: {
            id: 'M1',
            snippet: 'hi',
            payload: {
              mimeType: 'multipart/alternative',
              headers: [{ name: 'Subject', value: 'Hello' }],
              parts: [
                { mimeType: 'text/plain', body: { data: b64('Plain body') } },
                { mimeType: 'text/html', body: { data: b64('<p>HTML body</p>') } },
              ],
            },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('get_message', () => {
  it('extracts both the plain-text and HTML bodies', async () => {
    const result = await get_message.handler(fakeGmail(), { messageId: 'M1' });
    expect(result).toMatchObject({
      id: 'M1',
      subject: 'Hello',
      plaintextBody: 'Plain body',
      htmlBody: '<p>HTML body</p>',
    });
    expect(() => output.parse(result)).not.toThrow();
  });
});
