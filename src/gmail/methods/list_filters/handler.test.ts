import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(): gmail_v1.Gmail {
  return {
    users: {
      settings: {
        filters: {
          list: async () => ({ data: { filter: [{ id: 'F1', criteria: {}, action: {} }] } }),
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('list_filters', () => {
  it('lists and projects filters', async () => {
    const result = await handler(fakeGmail());
    expect(result.filters).toHaveLength(1);
    expect(result.filters[0]?.id).toBe('F1');
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
