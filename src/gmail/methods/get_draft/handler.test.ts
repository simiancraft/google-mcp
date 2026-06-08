import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      drafts: {
        get: async () => ({
          data: {
            id: 'D1',
            message: { threadId: 'T1', payload: { headers: [{ name: 'Subject', value: 'Hi' }] } },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('get_draft', () => {
  it('projects the draft', async () => {
    const result = await handler(fakeGmail(), { draftId: 'D1' });
    expect(result).toMatchObject({ id: 'D1', threadId: 'T1', subject: 'Hi' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
