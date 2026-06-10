import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$Instances };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Events): calendar_v3.Calendar {
  return {
    events: {
      instances: async (params: calendar_v3.Params$Resource$Events$Instances) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('list_event_instances', () => {
  it('expands the series on the primary calendar by default and projects the page', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        summary: 'Work',
        description: 'Team calendar',
        updated: '2026-06-01T12:00:00Z',
        timeZone: 'America/Chicago',
        accessRole: 'owner',
        defaultReminders: [{ method: 'popup', minutes: 10 }],
        items: [
          { id: 'E1_20260615', recurringEventId: 'E1' },
          { id: 'E1_20260622', recurringEventId: 'E1' },
        ],
        nextPageToken: 'next',
      }),
      { eventId: 'E1' },
    );
    expect(captured.params).toEqual({ calendarId: 'primary', eventId: 'E1' });
    expect(result).toEqual({
      summary: 'Work',
      description: 'Team calendar',
      updated: '2026-06-01T12:00:00Z',
      timeZone: 'America/Chicago',
      accessRole: 'owner',
      defaultReminders: [{ method: 'popup', minutes: 10 }],
      events: [
        expect.objectContaining({ id: 'E1_20260615', recurringEventId: 'E1' }),
        expect.objectContaining({ id: 'E1_20260622', recurringEventId: 'E1' }),
      ],
      nextPageToken: 'next',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the filters and paging through against an explicit calendar', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { items: [] }), {
      eventId: 'E1',
      calendarId: 'team@example.com',
      maxResults: 50,
      pageToken: 'page-2',
      originalStart: '2026-06-15T09:00:00-05:00',
      showDeleted: true,
      timeMin: '2026-06-01T00:00:00-05:00',
      timeMax: '2026-07-01T00:00:00-05:00',
      timeZone: 'America/Chicago',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      eventId: 'E1',
      maxResults: 50,
      pageToken: 'page-2',
      originalStart: '2026-06-15T09:00:00-05:00',
      showDeleted: true,
      timeMin: '2026-06-01T00:00:00-05:00',
      timeMax: '2026-07-01T00:00:00-05:00',
      timeZone: 'America/Chicago',
    });
  });

  it('returns an empty page when the response carries nothing', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), { eventId: 'E1' });
    expect(result).toEqual({ events: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
