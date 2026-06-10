import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendars$Clear };

function fakeCalendar(captured: Captured): calendar_v3.Calendar {
  return {
    calendars: {
      clear: async (params: calendar_v3.Params$Resource$Calendars$Clear) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('clear_calendar', () => {
  it('clears the primary calendar by default and confirms the id', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured), {});
    expect(captured.params).toEqual({ calendarId: 'primary' });
    expect(result).toEqual({ calendarId: 'primary' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes an explicit calendar id through', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured), {
      calendarId: 'info@simiancraft.com',
    });
    expect(captured.params).toEqual({ calendarId: 'info@simiancraft.com' });
    expect(result).toEqual({ calendarId: 'info@simiancraft.com' });
  });
});
