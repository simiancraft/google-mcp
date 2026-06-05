import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { delete_thread } from './handler.js';
import { output } from './schema.js';

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
  it('is destructive and permanently deletes the thread', async () => {
    expect(delete_thread.destructive).toBe(true);
    const captured: { id?: string } = {};
    const result = await delete_thread.handler(fakeGmail(captured), { threadId: 'T1' });
    expect(captured.id).toBe('T1');
    expect(result).toEqual({ threadId: 'T1' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
