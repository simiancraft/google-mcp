import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { remove?: string[] }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        modify: async (params: gmail_v1.Params$Resource$Users$Messages$Modify) => {
          captured.remove = params.requestBody?.removeLabelIds ?? undefined;
          return { data: { id: 'M1', labelIds: ['INBOX', 'UNREAD'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('unlabel_message', () => {
  it('removes labels and confirms the removed labels', async () => {
    const captured: { remove?: string[] } = {};
    const result = await handler(fakeGmail(captured), {
      messageId: 'M1',
      labelIds: ['IMPORTANT'],
    });
    expect(captured.remove).toEqual(['IMPORTANT']);
    // Confirms the labels acted on, not the message's full resulting label set.
    expect(result).toEqual({ messageId: 'M1', labelIds: ['IMPORTANT'] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
