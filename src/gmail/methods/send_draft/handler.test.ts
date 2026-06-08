import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string | undefined }): gmail_v1.Gmail {
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
  it('sends the draft', async () => {
    const captured: { id?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), { draftId: 'D9' });
    expect(captured.id).toBe('D9');
    expect(result).toMatchObject({ id: 'M9' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
