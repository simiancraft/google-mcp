import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
  return {
    users: {
      threads: {
        trash: async (params: gmail_v1.Params$Resource$Users$Threads$Trash) => {
          captured.id = params.id ?? undefined;
          return { data: { id: 'T1', messages: [{ id: 'M1' }] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('trash_thread', () => {
  it('is reversible and trashes the thread', async () => {
    const captured: { id?: string } = {};
    const result = await handler(fakeGmail(captured), { threadId: 'T1' });
    expect(captured.id).toBe('T1');
    expect(result).toMatchObject({ id: 'T1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
