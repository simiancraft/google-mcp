import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendarlist$List };

function fakeCalendar(
  captured: Captured,
  data: calendar_v3.Schema$CalendarList,
): calendar_v3.Calendar {
  return {
    calendarList: {
      list: async (params: calendar_v3.Params$Resource$Calendarlist$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('list_calendars', () => {
  it('lists with the documented default page size of 100', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), {});
    expect(captured.params).toEqual({ maxResults: 100 });
    expect(result).toEqual({ calendars: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the page size and page token through to the REST params', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), { pageSize: 25, pageToken: 'P1' });
    expect(captured.params).toEqual({ maxResults: 25, pageToken: 'P1' });
  });

  it('projects each entry to the documented four fields', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        items: [
          {
            id: 'primary@example.com',
            summary: 'Work',
            description: 'The team calendar',
            timeZone: 'America/Chicago',
            accessRole: 'owner',
            backgroundColor: '#ffffff',
            primary: true,
          },
        ],
        nextPageToken: 'N1',
      }),
      {},
    );
    expect(result).toEqual({
      calendars: [
        {
          id: 'primary@example.com',
          summary: 'Work',
          description: 'The team calendar',
          timeZone: 'America/Chicago',
        },
      ],
      nextPageToken: 'N1',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('cleans null fields to undefined and an absent id to the empty string', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        items: [{ id: null, summary: null, description: null, timeZone: null }],
      }),
      {},
    );
    expect(result.calendars).toEqual([{ id: '' }]);
    expect(result.nextPageToken).toBeUndefined();
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
