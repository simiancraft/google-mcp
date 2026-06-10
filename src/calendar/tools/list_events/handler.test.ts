import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$List };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Events): calendar_v3.Calendar {
  return {
    events: {
      list: async (params: calendar_v3.Params$Resource$Events$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('list_events', () => {
  it('lists with the documented defaults: primary calendar, 250 events, stable order', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        summary: 'Work',
        timeZone: 'America/Chicago',
        items: [{ id: 'E1', summary: 'Standup' }],
      }),
      {},
    );
    expect(captured.params).toEqual({ calendarId: 'primary', maxResults: 250 });
    expect(result.summary).toBe('Work');
    expect(result.timeZone).toBe('America/Chicago');
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ id: 'E1', summary: 'Standup' });
    expect(result.defaultReminders).toBeUndefined();
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the documented filters through to the REST params', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), {
      eventTypeFilter: ['default', 'focusTime'],
      calendarId: 'team@example.com',
      pageSize: 10,
      pageToken: 'P1',
      startTime: '2026-06-01T00:00:00Z',
      endTime: '2026-06-30T00:00:00Z',
      timeZone: 'Europe/Zurich',
      fullText: 'standup',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      eventTypes: ['default', 'focusTime'],
      maxResults: 10,
      pageToken: 'P1',
      timeMin: '2026-06-01T00:00:00Z',
      timeMax: '2026-06-30T00:00:00Z',
      timeZone: 'Europe/Zurich',
      q: 'standup',
    });
  });

  it('omits the REST orderBy for the explicit default ordering', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), { orderBy: 'default' });
    expect(captured.params).toEqual({ calendarId: 'primary', maxResults: 250 });
  });

  it('orders by start time ascending, expanding recurring events', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { items: [{ id: 'E1' }, { id: 'E2' }] }), {
      orderBy: 'startTime',
    });
    expect(captured.params).toMatchObject({ orderBy: 'startTime', singleEvents: true });
    expect(result.events.map((event) => event.id)).toEqual(['E1', 'E2']);
  });

  it('serves startTimeDesc by reversing the ascending page', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { items: [{ id: 'E1' }, { id: 'E2' }] }), {
      orderBy: 'startTimeDesc',
    });
    expect(captured.params).toMatchObject({ orderBy: 'startTime', singleEvents: true });
    expect(result.events.map((event) => event.id)).toEqual(['E2', 'E1']);
  });

  it('maps lastModified onto the REST updated ordering, without expansion', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), { orderBy: 'lastModified' });
    expect(captured.params?.orderBy).toBe('updated');
    expect(captured.params && 'singleEvents' in captured.params).toBe(false);
  });

  it('projects the calendar metadata, default reminders, and page token', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        summary: null,
        description: 'The team calendar',
        updated: '2026-06-09T12:00:00Z',
        accessRole: 'owner',
        defaultReminders: [{ method: 'email', minutes: 10 }],
        nextPageToken: 'N1',
      }),
      {},
    );
    expect(result).toEqual({
      description: 'The team calendar',
      updated: '2026-06-09T12:00:00Z',
      accessRole: 'owner',
      defaultReminders: [{ method: 'email', minutes: 10 }],
      events: [],
      nextPageToken: 'N1',
    });
    expect(result.summary).toBeUndefined();
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
