import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { remove?: string[] | undefined }): gmail_v1.Gmail {
  return {
    users: {
      threads: {
        modify: async (params: gmail_v1.Params$Resource$Users$Threads$Modify) => {
          captured.remove = params.requestBody?.removeLabelIds ?? undefined;
          return { data: { id: 'T1' } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('unlabel_thread', () => {
  it('removes labels from a thread and confirms them', async () => {
    const captured: { remove?: string[] | undefined } = {};
    const result = await handler(fakeGmail(captured), {
      threadId: 'T1',
      labelIds: ['IMPORTANT'],
    });
    expect(captured.remove).toEqual(['IMPORTANT']);
    expect(result).toEqual({ threadId: 'T1', labelIds: ['IMPORTANT'] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
