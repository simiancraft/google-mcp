import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      labels: {
        get: async () => ({ data: { id: 'L1', name: 'Work', threadsTotal: 3, threadsUnread: 1 } }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('get_label', () => {
  it('projects the label with counts', async () => {
    const result = await handler(fakeGmail(), { labelId: 'L1' });
    expect(result).toMatchObject({
      labelId: 'L1',
      name: 'Work',
      threadsTotal: 3,
      threadsUnread: 1,
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
