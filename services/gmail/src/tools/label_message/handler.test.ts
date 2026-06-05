import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { label_message } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { add?: string[] }): gmail_v1.Gmail {
  return {
    users: {
      messages: {
        modify: async (params: gmail_v1.Params$Resource$Users$Messages$Modify) => {
          captured.add = params.requestBody?.addLabelIds ?? undefined;
          return { data: { id: 'M1', labelIds: ['INBOX', 'IMPORTANT'] } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('label_message', () => {
  it('adds labels and returns the resulting state', async () => {
    const captured: { add?: string[] } = {};
    const result = await label_message.handler(fakeGmail(captured), {
      messageId: 'M1',
      labelIds: ['IMPORTANT'],
    });
    expect(captured.add).toEqual(['IMPORTANT']);
    expect(result).toEqual({ messageId: 'M1', labelIds: ['INBOX', 'IMPORTANT'] });
    expect(() => output.parse(result)).not.toThrow();
  });
});
