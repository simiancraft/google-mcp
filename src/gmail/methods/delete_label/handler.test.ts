import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: { id?: string | undefined }): gmail_v1.Gmail {
  return {
    users: {
      labels: {
        delete: async (params: gmail_v1.Params$Resource$Users$Labels$Delete) => {
          captured.id = params.id ?? undefined;
          return { data: {} };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('delete_label', () => {
  it('deletes the label and confirms the id', async () => {
    const captured: { id?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), { labelId: 'L1' });
    expect(captured.id).toBe('L1');
    expect(result).toEqual({ labelId: 'L1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
