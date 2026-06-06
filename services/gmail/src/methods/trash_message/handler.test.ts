import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { trash_message } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        trash: async (params: gmail_v1.Params$Resource$Users$Messages$Trash) => {
          captured.id = params.id ?? undefined;
          return { data: { id: 'M1', labelIds: ['TRASH'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('trash_message', () => {
  it('is reversible (not destructive) and trashes the message', async () => {
    expect(trash_message.destructive).toBeUndefined();
    const captured: { id?: string } = {};
    const result = await trash_message.handler(fakeGmail(captured), { messageId: 'M1' });
    expect(captured.id).toBe('M1');
    expect(result).toMatchObject({ id: 'M1' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
