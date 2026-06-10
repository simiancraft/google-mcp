import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Freebusy$Query };

function fakeCalendar(
  captured: Captured,
  data: calendar_v3.Schema$FreeBusyResponse,
): calendar_v3.Calendar {
  return {
    freebusy: {
      query: async (params: calendar_v3.Params$Resource$Freebusy$Query) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('suggest_time', () => {
  it("queries freebusy over the window, passing 'primary' and attendee emails straight through", async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), {
      attendeeEmails: ['primary', 'a@example.com'],
      startTime: '2026-06-10T09:00:00Z',
      endTime: '2026-06-10T10:00:00Z',
    });
    expect(captured.params).toEqual({
      requestBody: {
        timeMin: '2026-06-10T09:00:00Z',
        timeMax: '2026-06-10T10:00:00Z',
        items: [{ id: 'primary' }, { id: 'a@example.com' }],
      },
    });
    // No busy data: the window itself is free, in default 30-minute slots.
    expect(result.timeSlots).toEqual([
      {
        startTime: '2026-06-10T09:00:00.000Z',
        endTime: '2026-06-10T09:30:00.000Z',
        durationMinutes: 30,
      },
      {
        startTime: '2026-06-10T09:30:00.000Z',
        endTime: '2026-06-10T10:00:00.000Z',
        durationMinutes: 30,
      },
    ]);
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the time zone through to the freebusy query', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), {
      attendeeEmails: ['primary'],
      startTime: '2026-06-10T09:00:00Z',
      endTime: '2026-06-10T10:00:00Z',
      timeZone: 'America/Chicago',
    });
    expect(captured.params?.requestBody?.timeZone).toBe('America/Chicago');
  });

  it("flattens every calendar's busy periods before suggesting", async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        calendars: {
          primary: {
            busy: [{ start: '2026-06-10T09:00:00Z', end: '2026-06-10T10:00:00Z' }],
          },
          'a@example.com': {
            busy: [{ start: '2026-06-10T10:30:00Z', end: '2026-06-10T11:00:00Z' }],
          },
        },
      }),
      {
        attendeeEmails: ['primary', 'a@example.com'],
        startTime: '2026-06-10T09:00:00Z',
        endTime: '2026-06-10T11:30:00Z',
      },
    );
    expect(result.timeSlots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T10:00:00.000Z',
      '2026-06-10T11:00:00.000Z',
    ]);
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('treats a calendar without busy data as fully free', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { calendars: { primary: {} } }), {
      attendeeEmails: ['primary'],
      startTime: '2026-06-10T09:00:00Z',
      endTime: '2026-06-10T09:30:00Z',
    });
    expect(result.timeSlots).toHaveLength(1);
  });

  it('skips a busy period missing either bound', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        calendars: {
          primary: { busy: [{ start: '2026-06-10T09:00:00Z' }, { end: '2026-06-10T09:15:00Z' }] },
        },
      }),
      {
        attendeeEmails: ['primary'],
        startTime: '2026-06-10T09:00:00Z',
        endTime: '2026-06-10T09:30:00Z',
      },
    );
    expect(result.timeSlots).toHaveLength(1);
  });

  it('applies the duration and the scheduling preferences', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), {
      attendeeEmails: ['primary'],
      startTime: '2026-06-10T06:00:00Z',
      endTime: '2026-06-10T18:00:00Z',
      durationMinutes: 60,
      preferences: { startHour: '09:00', endHour: '17:00', excludeWeekends: true, pageSize: 2 },
    });
    expect(result.timeSlots).toEqual([
      {
        startTime: '2026-06-10T09:00:00.000Z',
        endTime: '2026-06-10T10:00:00.000Z',
        durationMinutes: 60,
      },
      {
        startTime: '2026-06-10T10:00:00.000Z',
        endTime: '2026-06-10T11:00:00.000Z',
        durationMinutes: 60,
      },
    ]);
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
