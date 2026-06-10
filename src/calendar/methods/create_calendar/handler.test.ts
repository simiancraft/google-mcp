import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendars$Insert };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Calendar): calendar_v3.Calendar {
  return {
    calendars: {
      insert: async (params: calendar_v3.Params$Resource$Calendars$Insert) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('create_calendar', () => {
  it('creates a calendar from the title alone', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'C1', summary: 'Side projects' }), {
      summary: 'Side projects',
    });
    expect(captured.params).toEqual({ requestBody: { summary: 'Side projects' } });
    expect(result).toMatchObject({ id: 'C1', summary: 'Side projects' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the full body through', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'C2' }), {
      summary: 'Installations',
      description: 'Build and install dates',
      location: 'Oklahoma City, OK',
      timeZone: 'America/Chicago',
    });
    expect(captured.params).toEqual({
      requestBody: {
        summary: 'Installations',
        description: 'Build and install dates',
        location: 'Oklahoma City, OK',
        timeZone: 'America/Chicago',
      },
    });
  });
});
