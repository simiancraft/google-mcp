import { describe, expect, it } from 'bun:test';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { raw?: string | undefined }): gmail_v1.Gmail {
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
    const captured: { raw?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), {
      to: ['x@example.com'],
      subject: 'Hello',
      body: 'Hi there',
    });

    expect(captured.raw).toBeTruthy();
    const decoded = Buffer.from(captured.raw ?? '', 'base64url').toString('utf8');
    expect(decoded).toContain('x@example.com');
    expect(decoded).toContain('Hi there');

    expect(result).toMatchObject({ id: 'D1', threadId: 'T1', subject: 'Hello' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('reads attachments from disk into the raw message', async () => {
    const dir = join(
      tmpdir(),
      `draft-attach-${process.pid}-${Math.random().toString(36).slice(2)}`,
    );
    await mkdir(dir, { recursive: true });
    const path = join(dir, 'packet.pdf');
    const bytes = Buffer.from('pdf bytes');
    await writeFile(path, bytes);

    const captured: { raw?: string | undefined } = {};
    await handler(fakeGmail(captured), {
      to: ['x@example.com'],
      body: 'see attached',
      attachments: [{ path }],
    });

    const decoded = Buffer.from(captured.raw ?? '', 'base64url').toString('utf8');
    expect(decoded).toContain('Content-Type: multipart/mixed');
    expect(decoded).toContain('Content-Disposition: attachment; filename="packet.pdf"');
    expect(decoded).toContain('Content-Type: application/pdf; name="packet.pdf"');
    expect(decoded).toContain(bytes.toString('base64'));
  });

  it('threads a reply: fetches the original for thread + In-Reply-To', async () => {
    const captured: { raw?: string | undefined; threadId?: string | undefined } = {};
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

    await handler(gmail, { to: ['x@example.com'], replyToMessageId: 'M1' });
    expect(captured.threadId).toBe('T9');
    expect(Buffer.from(captured.raw ?? '', 'base64url').toString('utf8')).toContain(
      'In-Reply-To: <orig@x>',
    );
  });
});
