import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { ids?: string[] | undefined }): gmail_v1.Gmail {
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
  it('permanently deletes the given messages', async () => {
    const captured: { ids?: string[] | undefined } = {};
    const result = await handler(fakeGmail(captured), {
      messageIds: ['M1', 'M2'],
    });
    expect(captured.ids).toEqual(['M1', 'M2']);
    expect(result).toEqual({ messageIds: ['M1', 'M2'] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
