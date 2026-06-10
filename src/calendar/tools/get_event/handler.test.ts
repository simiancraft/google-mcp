import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$Get };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Event): calendar_v3.Calendar {
  return {
    events: {
      get: async (params: calendar_v3.Params$Resource$Events$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('get_event', () => {
  it('gets the event from the primary calendar by default and projects it', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'E1',
        summary: 'Standup',
        status: 'confirmed',
        start: { dateTime: '2026-06-10T09:00:00-05:00', timeZone: 'America/Chicago' },
        end: { dateTime: '2026-06-10T09:15:00-05:00', timeZone: 'America/Chicago' },
        hangoutLink: 'https://meet.google.com/abc-defg-hij',
      }),
      { eventId: 'E1' },
    );
    expect(captured.params).toEqual({ calendarId: 'primary', eventId: 'E1' });
    expect(result).toMatchObject({
      id: 'E1',
      summary: 'Standup',
      status: 'confirmed',
      conferenceUrl: 'https://meet.google.com/abc-defg-hij',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes an explicit calendarId through', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'E2' }), {
      eventId: 'E2',
      calendarId: 'team@example.com',
    });
    expect(captured.params).toEqual({ calendarId: 'team@example.com', eventId: 'E2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
