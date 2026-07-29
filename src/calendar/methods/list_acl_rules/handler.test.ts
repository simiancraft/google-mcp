import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Acl$List };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Acl): calendar_v3.Calendar {
  return {
    acl: {
      list: async (params: calendar_v3.Params$Resource$Acl$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('list_acl_rules', () => {
  it('lists the primary calendar by default and projects each rule', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        items: [
          {
            etag: '"1"',
            kind: 'calendar#aclRule',
            id: 'user:someone@example.com',
            role: 'writer',
            scope: { type: 'user', value: 'someone@example.com' },
          },
        ],
        nextPageToken: 'page-2',
      }),
      {},
    );
    expect(captured.params).toEqual({ calendarId: 'primary' });
    expect(result).toEqual({
      rules: [
        {
          id: 'user:someone@example.com',
          role: 'writer',
          scope: { type: 'user', value: 'someone@example.com' },
        },
      ],
      nextPageToken: 'page-2',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the calendar, paging, and showDeleted through', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), {
      calendarId: 'team@example.com',
      maxResults: 50,
      pageToken: 'page-2',
      showDeleted: true,
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      maxResults: 50,
      pageToken: 'page-2',
      showDeleted: true,
    });
  });

  it('returns an empty list when the calendar has no rules', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), {});
    expect(result).toEqual({ rules: [], nextPageToken: undefined });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
