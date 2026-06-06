import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { batch_delete_messages } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { ids?: string[] }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        batchDelete: async (params: gmail_v1.Params$Resource$Users$Messages$Batchdelete) => {
          captured.ids = params.requestBody?.ids ?? undefined;
          return { data: {} };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('batch_delete_messages', () => {
  it('is destructive and permanently deletes the given messages', async () => {
    expect(batch_delete_messages.destructive).toBe(true);
    const captured: { ids?: string[] } = {};
    const result = await batch_delete_messages.handler(fakeGmail(captured), {
      messageIds: ['M1', 'M2'],
    });
    expect(captured.ids).toEqual(['M1', 'M2']);
    expect(result).toEqual({ messageIds: ['M1', 'M2'] });
    expect(() => output.parse(result)).not.toThrow();
  });
});
