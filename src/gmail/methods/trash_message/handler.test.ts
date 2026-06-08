import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string | undefined }): gmail_v1.Gmail {
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
    const captured: { id?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), { messageId: 'M1' });
    expect(captured.id).toBe('M1');
    expect(result).toMatchObject({ id: 'M1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
