import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendars$Patch };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Calendar): calendar_v3.Calendar {
  return {
    calendars: {
      patch: async (params: calendar_v3.Params$Resource$Calendars$Patch) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('update_calendar', () => {
  it('patches only the given fields on the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'primary-id', summary: 'Renamed' }), {
      summary: 'Renamed',
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      requestBody: { summary: 'Renamed' },
    });
    expect(result).toMatchObject({ id: 'primary-id', summary: 'Renamed' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('patches an explicit calendar with the full field set', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'C1' }), {
      calendarId: 'team@example.com',
      summary: 'Team',
      description: 'Shared calendar',
      location: 'Norman, OK',
      timeZone: 'America/Chicago',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      requestBody: {
        summary: 'Team',
        description: 'Shared calendar',
        location: 'Norman, OK',
        timeZone: 'America/Chicago',
      },
    });
  });
});
