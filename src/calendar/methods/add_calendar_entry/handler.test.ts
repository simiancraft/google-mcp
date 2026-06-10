import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendarlist$Insert };

function fakeCalendar(
  captured: Captured,
  data: calendar_v3.Schema$CalendarListEntry,
): calendar_v3.Calendar {
  return {
    calendarList: {
      insert: async (params: calendar_v3.Params$Resource$Calendarlist$Insert) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('add_calendar_entry', () => {
  it('subscribes the calendar id and returns the new entry', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, { id: 'team@example.com', summary: 'Team', accessRole: 'reader' }),
      { calendarId: 'team@example.com' },
    );
    expect(captured.params).toEqual({ requestBody: { id: 'team@example.com' } });
    expect(result).toEqual({ id: 'team@example.com', summary: 'Team', accessRole: 'reader' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
