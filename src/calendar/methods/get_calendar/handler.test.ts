import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendars$Get };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Calendar): calendar_v3.Calendar {
  return {
    calendars: {
      get: async (params: calendar_v3.Params$Resource$Calendars$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('get_calendar', () => {
  it('gets the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'info@simiancraft.com',
        summary: 'Jesse',
        timeZone: 'America/Chicago',
      }),
      {},
    );
    expect(captured.params).toEqual({ calendarId: 'primary' });
    expect(result).toEqual({
      id: 'info@simiancraft.com',
      summary: 'Jesse',
      timeZone: 'America/Chicago',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('gets an explicit calendar', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'team@example.com',
        summary: 'Team',
        description: 'Shared calendar',
        location: 'Norman, OK',
      }),
      { calendarId: 'team@example.com' },
    );
    expect(captured.params).toEqual({ calendarId: 'team@example.com' });
    expect(result).toMatchObject({ id: 'team@example.com', location: 'Norman, OK' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
