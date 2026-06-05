import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { unlabel_message } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { remove?: string[] }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        modify: async (params: gmail_v1.Params$Resource$Users$Messages$Modify) => {
          captured.remove = params.requestBody?.removeLabelIds ?? undefined;
          return { data: { id: 'M1', labelIds: ['INBOX'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('unlabel_message', () => {
  it('removes labels and returns the resulting state', async () => {
    const captured: { remove?: string[] } = {};
    const result = await unlabel_message.handler(fakeGmail(captured), {
      messageId: 'M1',
      labelIds: ['IMPORTANT'],
    });
    expect(captured.remove).toEqual(['IMPORTANT']);
    expect(result).toEqual({ messageId: 'M1', labelIds: ['INBOX'] });
    expect(() => output.parse(result)).not.toThrow();
  });
});
