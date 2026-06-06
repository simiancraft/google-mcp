import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { create_draft } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { raw?: string }): gmail_v1.Gmail {
  return {
    users: {
      getProfile: async () => ({ data: { emailAddress: 'me@example.com' } }),
      drafts: {
        create: async (params: gmail_v1.Params$Resource$Users$Drafts$Create) => {
          captured.raw = params.requestBody?.message?.raw ?? undefined;
          return { data: { id: 'D1' } };
        },
        get: async () => ({
          data: {
            id: 'D1',
            message: {
              threadId: 'T1',
              payload: { headers: [{ name: 'Subject', value: 'Hello' }] },
            },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('create_draft', () => {
  it('builds a raw message, creates the draft, and projects it', async () => {
    const captured: { raw?: string } = {};
    const result = await create_draft.handler(fakeGmail(captured), {
      to: ['x@example.com'],
      subject: 'Hello',
      body: 'Hi there',
    });

    expect(captured.raw).toBeTruthy();
    const decoded = Buffer.from(captured.raw ?? '', 'base64url').toString('utf8');
    expect(decoded).toContain('x@example.com');
    expect(decoded).toContain('Hi there');

    expect(result).toMatchObject({ id: 'D1', threadId: 'T1', subject: 'Hello' });
    expect(() => output.parse(result)).not.toThrow();
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
        },
        drafts: {
          create: async (params: gmail_v1.Params$Resource$Users$Drafts$Create) => {
            captured.raw = params.requestBody?.message?.raw ?? undefined;
            captured.threadId = params.requestBody?.message?.threadId ?? undefined;
            return { data: { id: 'D2' } };
          },
          get: async () => ({ data: { id: 'D2', message: { threadId: 'T9' } } }),
        },
      },
    } as unknown as gmail_v1.Gmail;

    await create_draft.handler(gmail, { to: ['x@example.com'], replyToMessageId: 'M1' });
    expect(captured.threadId).toBe('T9');
    expect(Buffer.from(captured.raw ?? '', 'base64url').toString('utf8')).toContain(
      'In-Reply-To: <orig@x>',
    );
  });
});
