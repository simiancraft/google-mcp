import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendars$Delete };

function fakeCalendar(captured: Captured): calendar_v3.Calendar {
  return {
    calendars: {
      delete: async (params: calendar_v3.Params$Resource$Calendars$Delete) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('delete_calendar', () => {
  it('deletes the named calendar and confirms its id', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured), { calendarId: 'old@example.com' });
    expect(captured.params).toEqual({ calendarId: 'old@example.com' });
    expect(result).toEqual({ calendarId: 'old@example.com' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
