import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendarlist$Get };

function fakeCalendar(
  captured: Captured,
  data: calendar_v3.Schema$CalendarListEntry,
): calendar_v3.Calendar {
  return {
    calendarList: {
      get: async (params: calendar_v3.Params$Resource$Calendarlist$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('get_calendar_entry', () => {
  it("gets the primary calendar's entry by default", async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'info@simiancraft.com',
        summary: 'Jesse',
        accessRole: 'owner',
        primary: true,
        defaultReminders: [{ method: 'popup', minutes: 10 }],
      }),
      {},
    );
    expect(captured.params).toEqual({ calendarId: 'primary' });
    expect(result).toEqual({
      id: 'info@simiancraft.com',
      summary: 'Jesse',
      accessRole: 'owner',
      primary: true,
      defaultReminders: [{ method: 'popup', minutes: 10 }],
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('gets an explicit calendar entry', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'team@example.com',
        accessRole: 'reader',
        backgroundColor: '#0088aa',
        hidden: true,
      }),
      { calendarId: 'team@example.com' },
    );
    expect(captured.params).toEqual({ calendarId: 'team@example.com' });
    expect(result).toMatchObject({
      id: 'team@example.com',
      accessRole: 'reader',
      backgroundColor: '#0088aa',
      hidden: true,
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
