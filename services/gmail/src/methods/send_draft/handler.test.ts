import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { send_draft } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
  return {
    users: {
      drafts: {
        send: async (params: gmail_v1.Params$Resource$Users$Drafts$Send) => {
          captured.id = params.requestBody?.id ?? undefined;
          return { data: { id: 'M9', threadId: 'T9', labelIds: ['SENT'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('send_draft', () => {
  it('is marked destructive and sends the draft', async () => {
    expect(send_draft.destructive).toBe(true);
    const captured: { id?: string } = {};
    const result = await send_draft.handler(fakeGmail(captured), { draftId: 'D9' });
    expect(captured.id).toBe('D9');
    expect(result).toMatchObject({ id: 'M9' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
