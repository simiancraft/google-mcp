import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { delete_label } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { id?: string }): gmail_v1.Gmail {
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
    const captured: { id?: string } = {};
    const result = await delete_label.handler(fakeGmail(captured), { labelId: 'L1' });
    expect(captured.id).toBe('L1');
    expect(result).toEqual({ labelId: 'L1' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
