import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { create_label } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { name?: string }): gmail_v1.Gmail {
  return {
    users: {
      labels: {
        create: async (params: gmail_v1.Params$Resource$Users$Labels$Create) => {
          captured.name = params.requestBody?.name ?? undefined;
          return { data: { id: 'Label_42', name: params.requestBody?.name } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('create_label', () => {
  it('creates a label from displayName and projects it', async () => {
    const captured: { name?: string } = {};
    const result = await create_label.handler(fakeGmail(captured), { displayName: 'Work' });
    expect(captured.name).toBe('Work');
    expect(result).toMatchObject({ labelId: 'Label_42', name: 'Work' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
