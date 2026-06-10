import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendarlist$Delete };

function fakeCalendar(captured: Captured): calendar_v3.Calendar {
  return {
    calendarList: {
      delete: async (params: calendar_v3.Params$Resource$Calendarlist$Delete) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('remove_calendar_entry', () => {
  it('removes the named entry and confirms its id', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured), { calendarId: 'team@example.com' });
    expect(captured.params).toEqual({ calendarId: 'team@example.com' });
    expect(result).toEqual({ calendarId: 'team@example.com' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
