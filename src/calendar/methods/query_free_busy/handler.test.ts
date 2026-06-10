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

describe('query_free_busy', () => {
  it('queries the window and projects busy intervals per calendar', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        timeMin: '2026-06-15T00:00:00Z',
        timeMax: '2026-06-16T00:00:00Z',
        calendars: {
          primary: {
            busy: [{ start: '2026-06-15T14:00:00Z', end: '2026-06-15T15:00:00Z' }],
          },
          'team@example.com': {
            busy: [],
            errors: [{ domain: 'global', reason: 'notFound' }],
          },
        },
      }),
      {
        timeMin: '2026-06-15T00:00:00Z',
        timeMax: '2026-06-16T00:00:00Z',
        timeZone: 'America/Chicago',
        items: [{ id: 'primary' }, { id: 'team@example.com' }],
      },
    );
    expect(captured.params).toEqual({
      requestBody: {
        timeMin: '2026-06-15T00:00:00Z',
        timeMax: '2026-06-16T00:00:00Z',
        timeZone: 'America/Chicago',
        items: [{ id: 'primary' }, { id: 'team@example.com' }],
      },
    });
    expect(result).toEqual({
      timeMin: '2026-06-15T00:00:00Z',
      timeMax: '2026-06-16T00:00:00Z',
      calendars: {
        primary: {
          busy: [{ start: '2026-06-15T14:00:00Z', end: '2026-06-15T15:00:00Z' }],
        },
        'team@example.com': {
          busy: [],
          errors: [{ domain: 'global', reason: 'notFound' }],
        },
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('drops busy periods missing either bound and tolerates an empty response', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        calendars: { primary: { busy: [{ start: '2026-06-15T14:00:00Z' }, {}] } },
      }),
      {
        timeMin: '2026-06-15T00:00:00Z',
        timeMax: '2026-06-16T00:00:00Z',
        items: [{ id: 'primary' }],
      },
    );
    expect(result).toEqual({ calendars: { primary: { busy: [] } } });
    expect(() => schema.output.parse(result)).not.toThrow();

    const empty = await handler(fakeCalendar(captured, {}), {
      timeMin: '2026-06-15T00:00:00Z',
      timeMax: '2026-06-16T00:00:00Z',
      items: [],
    });
    expect(empty).toEqual({ calendars: {} });
  });
});
