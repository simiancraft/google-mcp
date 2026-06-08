import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { raw?: string }): gmail_v1.Gmail {
  return {
    users: {
      getProfile: async () => ({ data: { emailAddress: 'me@example.com' } }),
      messages: {
        send: async (params: gmail_v1.Params$Resource$Users$Messages$Send) => {
          captured.raw = params.requestBody?.raw ?? undefined;
          return { data: { id: 'M1', threadId: 'T1', labelIds: ['SENT'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('send_message', () => {
  it('is destructive, builds the raw message, and sends it', async () => {
    const captured: { raw?: string } = {};
    const result = await handler(fakeGmail(captured), {
      to: ['x@example.com'],
      subject: 'Hi',
      body: 'Hello',
    });
    const decoded = Buffer.from(captured.raw ?? '', 'base64url').toString('utf8');
    expect(decoded).toContain('x@example.com');
    expect(decoded).toContain('Hello');
    expect(result).toMatchObject({ id: 'M1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('threads a reply: fetches the original for thread + In-Reply-To', async () => {
    const captured: { raw?: string; threadId?: string } = {};
    const gmail = {
      users: {
        getProfile: async () => ({ data: { emailAddress: 'me@example.com' } }),
        messages: {
          get: async () => ({
            data: {
              threadId: 'T9',
              payload: { headers: [{ name: 'Message-ID', value: '<orig@x>' }] },
            },
          }),
          send: async (params: gmail_v1.Params$Resource$Users$Messages$Send) => {
            captured.raw = params.requestBody?.raw ?? undefined;
            captured.threadId = params.requestBody?.threadId ?? undefined;
            return { data: { id: 'M2', threadId: 'T9' } };
          },
        },
      },
    } as unknown as gmail_v1.Gmail;

    await handler(gmail, {
      to: ['x@example.com'],
      body: 'reply',
      replyToMessageId: 'M1',
    });
    expect(captured.threadId).toBe('T9');
    expect(Buffer.from(captured.raw ?? '', 'base64url').toString('utf8')).toContain(
      'In-Reply-To: <orig@x>',
    );
  });
});
