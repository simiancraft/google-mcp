import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { add?: string[] }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        modify: async (params: gmail_v1.Params$Resource$Users$Messages$Modify) => {
          captured.add = params.requestBody?.addLabelIds ?? undefined;
          return { data: { id: 'M1', labelIds: ['INBOX', 'UNREAD', 'IMPORTANT'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('label_message', () => {
  it('adds labels and confirms the applied labels', async () => {
    const captured: { add?: string[] } = {};
    const result = await handler(fakeGmail(captured), {
      messageId: 'M1',
      labelIds: ['IMPORTANT'],
    });
    expect(captured.add).toEqual(['IMPORTANT']);
    // Confirms the labels acted on, not the message's full resulting label set.
    expect(result).toEqual({ messageId: 'M1', labelIds: ['IMPORTANT'] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
