import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string | undefined }): gmail_v1.Gmail {
  return {
    users: {
      drafts: {
        delete: async (params: gmail_v1.Params$Resource$Users$Drafts$Delete) => {
          captured.id = params.id ?? undefined;
          return { data: {} };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('delete_draft', () => {
  it('deletes the draft and confirms the id', async () => {
    const captured: { id?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), { draftId: 'D1' });
    expect(captured.id).toBe('D1');
    expect(result).toEqual({ draftId: 'D1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
