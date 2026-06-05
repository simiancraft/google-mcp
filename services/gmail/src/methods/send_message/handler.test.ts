import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { send_message } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { raw?: string }): gmail_v1.Gmail {
  return {
    users: {
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
    expect(send_message.destructive).toBe(true);
    const captured: { raw?: string } = {};
    const result = await send_message.handler(fakeGmail(captured), {
      to: ['x@example.com'],
      subject: 'Hi',
      body: 'Hello',
    });
    const decoded = Buffer.from(captured.raw ?? '', 'base64url').toString('utf8');
    expect(decoded).toContain('To: x@example.com');
    expect(decoded).toContain('Subject: Hi');
    expect(result).toMatchObject({ id: 'M1' });
    expect(() => output.parse(result)).not.toThrow();
  });

  it('threads a reply: fetches the original for thread + In-Reply-To', async () => {
    const captured: { raw?: string; threadId?: string } = {};
    const gmail = {
      users: {
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

    await send_message.handler(gmail, {
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
