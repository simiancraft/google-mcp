import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { create_draft } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { raw?: string }): gmail_v1.Gmail {
  return {
    users: {
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
    expect(decoded).toContain('To: x@example.com');
    expect(decoded).toContain('Subject: Hello');
    expect(decoded).toContain('Hi there');

    expect(result).toMatchObject({ id: 'D1', threadId: 'T1', subject: 'Hello' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
