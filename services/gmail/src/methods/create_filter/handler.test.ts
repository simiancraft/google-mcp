import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { create_filter } from './handler.js';
import { output } from './schema.js';

function fakeGmail(captured: { body?: gmail_v1.Schema$Filter }): gmail_v1.Gmail {
  return {
    users: {
      settings: {
        filters: {
          create: async (params: gmail_v1.Params$Resource$Users$Settings$Filters$Create) => {
            captured.body = params.requestBody ?? undefined;
            return { data: { id: 'F1', ...params.requestBody } };
          },
        },
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('create_filter', () => {
  it('creates a filter and projects it', async () => {
    const captured: { body?: gmail_v1.Schema$Filter } = {};
    const result = await create_filter.handler(fakeGmail(captured), {
      criteria: { from: 'noreply@example.com' },
      action: { addLabelIds: ['Label_1'] },
    });
    expect(captured.body?.criteria?.from).toBe('noreply@example.com');
    expect(result).toMatchObject({ id: 'F1', criteria: { from: 'noreply@example.com' } });
    expect(() => output.parse(result)).not.toThrow();
  });
});
