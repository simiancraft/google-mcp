import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { delete_draft } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
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
    const captured: { id?: string } = {};
    const result = await delete_draft.handler(fakeGmail(captured), { draftId: 'D1' });
    expect(captured.id).toBe('D1');
    expect(result).toEqual({ draftId: 'D1' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
