import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { update_label } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { name?: string }): gmail_v1.Gmail {
  return {
    users: {
      labels: {
        patch: async (params: gmail_v1.Params$Resource$Users$Labels$Patch) => {
          captured.name = params.requestBody?.name ?? undefined;
          return { data: { id: 'L1', name: params.requestBody?.name } };
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('update_label', () => {
  it('patches the label and projects it', async () => {
    const captured: { name?: string } = {};
    const result = await update_label.handler(fakeGmail(captured), {
      labelId: 'L1',
      name: 'Renamed',
    });
    expect(captured.name).toBe('Renamed');
    expect(result).toMatchObject({ labelId: 'L1', name: 'Renamed' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
