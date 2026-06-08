import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: {
  body?: gmail_v1.Schema$BatchModifyMessagesRequest | undefined;
}): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        batchModify: async (params: gmail_v1.Params$Resource$Users$Messages$Batchmodify) => {
          captured.body = params.requestBody ?? undefined;
          return { data: {} };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('batch_modify_messages', () => {
  it('applies label changes across messages and confirms them', async () => {
    const captured: { body?: gmail_v1.Schema$BatchModifyMessagesRequest | undefined } = {};
    const result = await handler(fakeGmail(captured), {
      messageIds: ['M1', 'M2'],
      addLabelIds: ['IMPORTANT'],
    });
    expect(captured.body?.ids).toEqual(['M1', 'M2']);
    expect(captured.body?.addLabelIds).toEqual(['IMPORTANT']);
    expect(result).toMatchObject({ messageIds: ['M1', 'M2'], addLabelIds: ['IMPORTANT'] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
