import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
  return {
    users: {
      threads: {
        delete: async (params: gmail_v1.Params$Resource$Users$Threads$Delete) => {
          captured.id = params.id ?? undefined;
          return { data: {} };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('delete_thread', () => {
  it('permanently deletes the thread', async () => {
    const captured: { id?: string } = {};
    const result = await handler(fakeGmail(captured), { threadId: 'T1' });
    expect(captured.id).toBe('T1');
    expect(result).toEqual({ threadId: 'T1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
