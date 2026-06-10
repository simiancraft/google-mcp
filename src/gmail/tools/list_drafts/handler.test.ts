import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      drafts: {
        list: async () => ({ data: { drafts: [{ id: 'D1' }] } }),
        get: async () => ({
          data: {
            id: 'D1',
            message: {
              threadId: 'T9',
              payload: {
                headers: [
                  { name: 'Subject', value: 'Draft subject' },
                  { name: 'To', value: 'x@example.com, y@example.com' },
                ],
              },
            },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('list_drafts', () => {
  it('fetches and projects each draft', async () => {
    const result = await handler(fakeGmail(), {});
    expect(result.drafts).toHaveLength(1);
    expect(result.drafts[0]).toMatchObject({
      id: 'D1',
      threadId: 'T9',
      subject: 'Draft subject',
      toRecipients: [{ address: 'x@example.com' }, { address: 'y@example.com' }],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
