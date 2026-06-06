import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { update_draft } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { id?: string; raw?: string }): gmail_v1.Gmail {
  return {
    users: {
      getProfile: async () => ({ data: { emailAddress: 'me@example.com' } }),
      drafts: {
        update: async (params: gmail_v1.Params$Resource$Users$Drafts$Update) => {
          captured.id = params.id ?? undefined;
          captured.raw = params.requestBody?.message?.raw ?? undefined;
          return { data: { id: 'D1' } };
        },
        get: async () => ({
          data: {
            id: 'D1',
            message: { payload: { headers: [{ name: 'Subject', value: 'New' }] } },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('update_draft', () => {
  it('replaces the draft content and projects it', async () => {
    const captured: { id?: string; raw?: string } = {};
    const result = await update_draft.handler(fakeGmail(captured), {
      draftId: 'D1',
      to: ['x@example.com'],
      subject: 'New',
    });
    expect(captured.id).toBe('D1');
    expect(Buffer.from(captured.raw ?? '', 'base64url').toString('utf8')).toContain(
      'x@example.com',
    );
    expect(result).toMatchObject({ id: 'D1', subject: 'New' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
