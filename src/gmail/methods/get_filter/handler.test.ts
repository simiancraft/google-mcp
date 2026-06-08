import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { get_filter } from './handler.js';
import { output } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      settings: {
        filters: {
          get: async () => ({
            data: { id: 'F1', criteria: { from: 'a@b.com' }, action: { addLabelIds: ['L1'] } },
          }),
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('get_filter', () => {
  it('projects the filter', async () => {
    const result = await get_filter.handler(fakeGmail(), { filterId: 'F1' });
    expect(result).toMatchObject({ id: 'F1', criteria: { from: 'a@b.com' } });
    expect(() => output.parse(result)).not.toThrow();
  });
});
